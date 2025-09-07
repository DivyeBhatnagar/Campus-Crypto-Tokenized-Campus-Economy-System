// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./CampusCoin.sol";
import "./CampusBadgeNFT.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title CampusEconomyManager
 * @dev Central contract that manages the entire campus token economy
 * Coordinates between CampusCoin and CampusBadgeNFT contracts
 */
contract CampusEconomyManager is AccessControl, ReentrancyGuard, Pausable {
    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant REWARD_MANAGER_ROLE = keccak256("REWARD_MANAGER_ROLE");
    bytes32 public constant VENDOR_ROLE = keccak256("VENDOR_ROLE");
    
    // Contract references
    CampusCoin public campusCoin;
    CampusBadgeNFT public campusBadgeNFT;
    
    // Reward rules
    struct RewardRule {
        string code;
        uint256 tokenAmount;
        bool hasBadge;
        string badgeName;
        string badgeDescription;
        string badgeCategory;
        string badgeImageURI;
        bool isActive;
        uint256 maxClaimsPerUser;
        uint256 totalClaimed;
        mapping(address => uint256) userClaims;
        mapping(address => uint256) lastClaimTime;
        uint256 cooldownPeriod; // in seconds
    }
    
    // Vendor products
    struct VendorProduct {
        string name;
        string description;
        uint256 price;
        string vendor;
        string category;
        bool isActive;
        uint256 totalSold;
    }
    
    mapping(string => RewardRule) public rewardRules;
    mapping(string => VendorProduct) public vendorProducts;
    mapping(address => bool) public registeredStudents;
    mapping(address => string) public studentIds;
    
    string[] public activeRewardCodes;
    string[] public activeProductIds;
    
    // Events
    event StudentRegistered(address indexed student, string studentId);
    event RewardRuleCreated(string rewardCode, uint256 tokenAmount, bool hasBadge);
    event VendorProductAdded(string productId, string name, uint256 price, string vendor);
    event RewardClaimed(address indexed student, string rewardCode, uint256 tokens, bool badgeAwarded);
    event ProductPurchased(address indexed student, string productId, uint256 price);
    event TokensTransferred(address indexed from, address indexed to, uint256 amount);
    
    constructor(address _campusCoinAddress, address _campusBadgeNFTAddress) {
        campusCoin = CampusCoin(_campusCoinAddress);
        campusBadgeNFT = CampusBadgeNFT(_campusBadgeNFTAddress);
        
        // Set up roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(REWARD_MANAGER_ROLE, msg.sender);
    }
    
    /**
     * @dev Register a new student
     */
    function registerStudent(address student, string memory studentId) 
        public onlyRole(ADMIN_ROLE) {
        require(!registeredStudents[student], "CampusEconomyManager: Student already registered");
        require(bytes(studentId).length > 0, "CampusEconomyManager: Student ID cannot be empty");
        
        registeredStudents[student] = true;
        studentIds[student] = studentId;
        
        emit StudentRegistered(student, studentId);
    }
    
    /**
     * @dev Create a new reward rule
     */
    function createRewardRule(
        string memory rewardCode,
        uint256 tokenAmount,
        bool hasBadge,
        string memory badgeName,
        string memory badgeDescription,
        string memory badgeCategory,
        string memory badgeImageURI,
        uint256 maxClaimsPerUser,
        uint256 cooldownPeriod
    ) public onlyRole(ADMIN_ROLE) {
        require(bytes(rewardCode).length > 0, "CampusEconomyManager: Reward code cannot be empty");
        require(tokenAmount > 0, "CampusEconomyManager: Token amount must be greater than zero");
        require(!rewardRules[rewardCode].isActive, "CampusEconomyManager: Reward code already exists");
        
        RewardRule storage rule = rewardRules[rewardCode];
        rule.code = rewardCode;
        rule.tokenAmount = tokenAmount;
        rule.hasBadge = hasBadge;
        rule.badgeName = badgeName;
        rule.badgeDescription = badgeDescription;
        rule.badgeCategory = badgeCategory;
        rule.badgeImageURI = badgeImageURI;
        rule.isActive = true;
        rule.maxClaimsPerUser = maxClaimsPerUser;
        rule.cooldownPeriod = cooldownPeriod;
        
        activeRewardCodes.push(rewardCode);
        
        // Add reward code to CampusCoin contract
        campusCoin.addRewardCode(rewardCode, tokenAmount, maxClaimsPerUser);
        
        // Add achievement code to Badge NFT contract if badge is enabled
        if (hasBadge) {
            campusBadgeNFT.addAchievementCode(rewardCode, badgeName);
        }
        
        emit RewardRuleCreated(rewardCode, tokenAmount, hasBadge);
    }
    
    /**
     * @dev Add a vendor product
     */
    function addVendorProduct(
        string memory productId,
        string memory name,
        string memory description,
        uint256 price,
        string memory vendor,
        string memory category
    ) public onlyRole(ADMIN_ROLE) {
        require(bytes(productId).length > 0, "CampusEconomyManager: Product ID cannot be empty");
        require(price > 0, "CampusEconomyManager: Price must be greater than zero");
        require(!vendorProducts[productId].isActive, "CampusEconomyManager: Product ID already exists");
        
        vendorProducts[productId] = VendorProduct({
            name: name,
            description: description,
            price: price,
            vendor: vendor,
            category: category,
            isActive: true,
            totalSold: 0
        });
        
        activeProductIds.push(productId);
        
        emit VendorProductAdded(productId, name, price, vendor);
    }
    
    /**
     * @dev Claim reward tokens and badge (if applicable)
     */
    function claimReward(string memory rewardCode, string memory evidence) 
        public nonReentrant whenNotPaused {
        require(registeredStudents[msg.sender], "CampusEconomyManager: Not a registered student");
        require(rewardRules[rewardCode].isActive, "CampusEconomyManager: Invalid or inactive reward code");
        
        RewardRule storage rule = rewardRules[rewardCode];
        
        // Check maximum claims per user
        if (rule.maxClaimsPerUser > 0) {
            require(
                rule.userClaims[msg.sender] < rule.maxClaimsPerUser,
                "CampusEconomyManager: Maximum claims reached for this reward"
            );
        }
        
        // Check cooldown period
        if (rule.cooldownPeriod > 0 && rule.lastClaimTime[msg.sender] > 0) {
            require(
                block.timestamp >= rule.lastClaimTime[msg.sender] + rule.cooldownPeriod,
                "CampusEconomyManager: Cooldown period not expired"
            );
        }
        
        // Update claim tracking
        rule.userClaims[msg.sender]++;
        rule.lastClaimTime[msg.sender] = block.timestamp;
        rule.totalClaimed++;
        
        // Distribute tokens
        campusCoin.distributeReward(msg.sender, rewardCode, evidence);
        
        // Award badge if applicable
        bool badgeAwarded = false;
        if (rule.hasBadge && !campusBadgeNFT.hasAchievement(msg.sender, rewardCode)) {
            string[] memory attributeKeys = new string[](3);
            string[] memory attributeValues = new string[](3);
            
            attributeKeys[0] = "Reward Code";
            attributeValues[0] = rewardCode;
            attributeKeys[1] = "Earned Date";
            attributeValues[1] = toString(block.timestamp);
            attributeKeys[2] = "Student ID";
            attributeValues[2] = studentIds[msg.sender];
            
            campusBadgeNFT.mintBadge(
                msg.sender,
                rewardCode,
                rule.badgeImageURI,
                rule.badgeName,
                rule.badgeDescription,
                rule.badgeCategory,
                attributeKeys,
                attributeValues
            );
            badgeAwarded = true;
        }
        
        emit RewardClaimed(msg.sender, rewardCode, rule.tokenAmount, badgeAwarded);
    }
    
    /**
     * @dev Purchase a vendor product
     */
    function purchaseProduct(string memory productId) 
        public nonReentrant whenNotPaused {
        require(registeredStudents[msg.sender], "CampusEconomyManager: Not a registered student");
        require(vendorProducts[productId].isActive, "CampusEconomyManager: Invalid or inactive product");
        
        VendorProduct storage product = vendorProducts[productId];
        uint256 price = product.price;
        
        require(campusCoin.balanceOf(msg.sender) >= price, "CampusEconomyManager: Insufficient balance");
        
        // Process payment (burn tokens)
        campusCoin.redeem(price, product.vendor, product.name);
        
        // Update product statistics
        product.totalSold++;
        
        emit ProductPurchased(msg.sender, productId, price);
    }
    
    /**
     * @dev Transfer tokens between students
     */
    function transferTokens(address to, uint256 amount, string memory memo) 
        public nonReentrant whenNotPaused {
        require(registeredStudents[msg.sender], "CampusEconomyManager: Sender not registered");
        require(registeredStudents[to], "CampusEconomyManager: Recipient not registered");
        require(to != msg.sender, "CampusEconomyManager: Cannot transfer to yourself");
        require(amount > 0, "CampusEconomyManager: Amount must be greater than zero");
        
        // Transfer tokens
        campusCoin.transferFrom(msg.sender, to, amount);
        
        emit TokensTransferred(msg.sender, to, amount);
    }
    
    /**
     * @dev Get student information
     */
    function getStudentInfo(address student) public view returns (
        bool isRegistered,
        string memory studentId,
        uint256 tokenBalance,
        uint256 totalEarned,
        uint256 totalSpent,
        uint256 badgeCount
    ) {
        isRegistered = registeredStudents[student];
        studentId = studentIds[student];
        (tokenBalance, totalEarned, totalSpent,) = campusCoin.getUserStats(student);
        badgeCount = campusBadgeNFT.balanceOf(student);
    }
    
    /**
     * @dev Get reward rule information
     */
    function getRewardRule(string memory rewardCode) public view returns (
        uint256 tokenAmount,
        bool hasBadge,
        string memory badgeName,
        bool isActive,
        uint256 maxClaimsPerUser,
        uint256 totalClaimed,
        uint256 cooldownPeriod
    ) {
        RewardRule storage rule = rewardRules[rewardCode];
        return (
            rule.tokenAmount,
            rule.hasBadge,
            rule.badgeName,
            rule.isActive,
            rule.maxClaimsPerUser,
            rule.totalClaimed,
            rule.cooldownPeriod
        );
    }
    
    /**
     * @dev Get user's claim count for a reward
     */
    function getUserClaimCount(address user, string memory rewardCode) 
        public view returns (uint256) {
        return rewardRules[rewardCode].userClaims[user];
    }
    
    /**
     * @dev Get all active reward codes
     */
    function getActiveRewardCodes() public view returns (string[] memory) {
        return activeRewardCodes;
    }
    
    /**
     * @dev Get all active product IDs
     */
    function getActiveProductIds() public view returns (string[] memory) {
        return activeProductIds;
    }
    
    /**
     * @dev Pause the contract
     */
    function pause() public onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() public onlyRole(ADMIN_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Utility function to convert uint to string
     */
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}