// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CampusCoin
 * @dev ERC20 token for the Tokenized Campus Economy
 * Features:
 * - Mintable by authorized reward distributors
 * - Burnable for token redemptions
 * - Pausable for emergency stops
 * - Role-based access control
 * - Reentrancy protection
 */
contract CampusCoin is ERC20, ERC20Burnable, AccessControl, Pausable, ReentrancyGuard {
    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant REWARD_DISTRIBUTOR_ROLE = keccak256("REWARD_DISTRIBUTOR_ROLE");
    
    // Token configuration
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens with 18 decimals
    uint256 public constant INITIAL_ADMIN_SUPPLY = 10000000 * 10**18; // 10 million for initial distribution
    
    // Reward tracking
    mapping(address => uint256) public totalEarned;
    mapping(address => uint256) public totalSpent;
    mapping(address => mapping(string => uint256)) public rewardClaims; // user -> rewardCode -> claimCount
    mapping(string => bool) public validRewardCodes;
    mapping(string => uint256) public rewardAmounts;
    mapping(string => uint256) public maxClaimsPerUser;
    
    // Events
    event RewardClaimed(address indexed user, string rewardCode, uint256 amount, string evidence);
    event TokensRedeemed(address indexed user, uint256 amount, string vendor, string product);
    event RewardCodeAdded(string rewardCode, uint256 amount, uint256 maxClaims);
    event RewardCodeRemoved(string rewardCode);
    event TokensBurned(address indexed user, uint256 amount, string reason);
    
    constructor() ERC20("CampusCoin", "CAMPUS") {
        // Set up roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(REWARD_DISTRIBUTOR_ROLE, msg.sender);
        
        // Mint initial supply to deployer
        _mint(msg.sender, INITIAL_ADMIN_SUPPLY);
    }
    
    /**
     * @dev Mint tokens for reward distribution
     * Can only be called by accounts with MINTER_ROLE
     */
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) whenNotPaused {
        require(totalSupply() + amount <= MAX_SUPPLY, "CampusCoin: Max supply exceeded");
        _mint(to, amount);
    }
    
    /**
     * @dev Distribute reward tokens to a user
     * Can only be called by accounts with REWARD_DISTRIBUTOR_ROLE
     */
    function distributeReward(
        address user, 
        string memory rewardCode, 
        string memory evidence
    ) public onlyRole(REWARD_DISTRIBUTOR_ROLE) whenNotPaused nonReentrant {
        require(validRewardCodes[rewardCode], "CampusCoin: Invalid reward code");
        require(user != address(0), "CampusCoin: Cannot reward zero address");
        
        uint256 amount = rewardAmounts[rewardCode];
        uint256 maxClaims = maxClaimsPerUser[rewardCode];
        
        // Check if user has exceeded max claims for this reward
        if (maxClaims > 0) {
            require(
                rewardClaims[user][rewardCode] < maxClaims, 
                "CampusCoin: User has reached max claims for this reward"
            );
        }
        
        // Ensure we don't exceed max supply
        require(totalSupply() + amount <= MAX_SUPPLY, "CampusCoin: Max supply exceeded");
        
        // Update tracking
        rewardClaims[user][rewardCode]++;
        totalEarned[user] += amount;
        
        // Mint and transfer tokens
        _mint(user, amount);
        
        emit RewardClaimed(user, rewardCode, amount, evidence);
    }
    
    /**
     * @dev Redeem tokens for products/services
     * Burns tokens from user's balance
     */
    function redeem(
        uint256 amount, 
        string memory vendor, 
        string memory product
    ) public whenNotPaused nonReentrant {
        require(amount > 0, "CampusCoin: Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "CampusCoin: Insufficient balance");
        
        // Update tracking
        totalSpent[msg.sender] += amount;
        
        // Burn tokens
        _burn(msg.sender, amount);
        
        emit TokensRedeemed(msg.sender, amount, vendor, product);
    }
    
    /**
     * @dev Add a new reward code
     * Can only be called by accounts with ADMIN_ROLE
     */
    function addRewardCode(
        string memory rewardCode, 
        uint256 amount, 
        uint256 maxClaims
    ) public onlyRole(ADMIN_ROLE) {
        require(bytes(rewardCode).length > 0, "CampusCoin: Reward code cannot be empty");
        require(amount > 0, "CampusCoin: Reward amount must be greater than zero");
        
        validRewardCodes[rewardCode] = true;
        rewardAmounts[rewardCode] = amount;
        maxClaimsPerUser[rewardCode] = maxClaims; // 0 means unlimited
        
        emit RewardCodeAdded(rewardCode, amount, maxClaims);
    }
    
    /**
     * @dev Remove a reward code
     * Can only be called by accounts with ADMIN_ROLE
     */
    function removeRewardCode(string memory rewardCode) public onlyRole(ADMIN_ROLE) {
        validRewardCodes[rewardCode] = false;
        rewardAmounts[rewardCode] = 0;
        maxClaimsPerUser[rewardCode] = 0;
        
        emit RewardCodeRemoved(rewardCode);
    }
    
    /**
     * @dev Burn tokens with reason (admin function)
     * Can only be called by accounts with ADMIN_ROLE
     */
    function adminBurn(address user, uint256 amount, string memory reason) 
        public onlyRole(ADMIN_ROLE) whenNotPaused {
        require(balanceOf(user) >= amount, "CampusCoin: Insufficient balance to burn");
        
        _burn(user, amount);
        emit TokensBurned(user, amount, reason);
    }
    
    /**
     * @dev Pause all token operations
     * Can only be called by accounts with PAUSER_ROLE
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause all token operations
     * Can only be called by accounts with PAUSER_ROLE
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Get user's statistics
     */
    function getUserStats(address user) public view returns (
        uint256 balance,
        uint256 earned,
        uint256 spent,
        uint256 net
    ) {
        balance = balanceOf(user);
        earned = totalEarned[user];
        spent = totalSpent[user];
        net = earned - spent;
    }
    
    /**
     * @dev Get reward code information
     */
    function getRewardInfo(string memory rewardCode) public view returns (
        bool isValid,
        uint256 amount,
        uint256 maxClaims
    ) {
        isValid = validRewardCodes[rewardCode];
        amount = rewardAmounts[rewardCode];
        maxClaims = maxClaimsPerUser[rewardCode];
    }
    
    /**
     * @dev Get user's claim count for a specific reward
     */
    function getUserClaimCount(address user, string memory rewardCode) public view returns (uint256) {
        return rewardClaims[user][rewardCode];
    }
    
    /**
     * @dev Override transfer to add pause functionality
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    /**
     * @dev The following functions are overrides required by Solidity
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}