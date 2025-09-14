// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CampusBadgeNFT
 * @dev NFT contract for achievement badges in the Campus Token Economy
 * Features:
 * - Unique achievement badges as NFTs
 * - Metadata storage for badge details
 * - Role-based minting
 * - Enumerable for easy querying
 * - Non-transferable badges (soulbound)
 */
contract CampusBadgeNFT is ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl, Pausable {
    using Counters for Counters.Counter;

    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    Counters.Counter private _tokenIdCounter;
    
    // Badge metadata
    struct BadgeMetadata {
        string name;
        string description;
        string category;
        uint256 mintedAt;
        string achievementCode;
        mapping(string => string) attributes;
        string[] attributeKeys;
    }
    
    mapping(uint256 => BadgeMetadata) public badgeMetadata;
    mapping(address => uint256[]) public userBadges;
    mapping(string => bool) public validAchievementCodes;
    mapping(string => string) public achievementNames;
    mapping(address => mapping(string => bool)) public userHasAchievement;
    
    // Configuration
    bool public transfersEnabled = false; // Badges are soulbound by default
    
    // Events
    event BadgeMinted(
        address indexed recipient, 
        uint256 indexed tokenId, 
        string achievementCode, 
        string name
    );
    event AchievementCodeAdded(string code, string name);
    event AchievementCodeRemoved(string code);
    event TransfersToggled(bool enabled);
    
    constructor() ERC721("CampusBadgeNFT", "CAMPUSBADGE") {
        // Set up roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        
        // Start token IDs from 1
        _tokenIdCounter.increment();
    }
    
    /**
     * @dev Mint a badge to a user for a specific achievement
     */
    function mintBadge(
        address recipient,
        string memory achievementCode,
        string memory tokenURI,
        string memory name,
        string memory description,
        string memory category,
        string[] memory attributeKeys,
        string[] memory attributeValues
    ) public onlyRole(MINTER_ROLE) whenNotPaused {
        require(recipient != address(0), "CampusBadgeNFT: Cannot mint to zero address");
        require(validAchievementCodes[achievementCode], "CampusBadgeNFT: Invalid achievement code");
        require(!userHasAchievement[recipient][achievementCode], "CampusBadgeNFT: User already has this achievement");
        require(attributeKeys.length == attributeValues.length, "CampusBadgeNFT: Attributes length mismatch");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Mint the NFT
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Set badge metadata
        BadgeMetadata storage badge = badgeMetadata[tokenId];
        badge.name = name;
        badge.description = description;
        badge.category = category;
        badge.mintedAt = block.timestamp;
        badge.achievementCode = achievementCode;
        badge.attributeKeys = attributeKeys;
        
        // Set attributes
        for (uint i = 0; i < attributeKeys.length; i++) {
            badge.attributes[attributeKeys[i]] = attributeValues[i];
        }
        
        // Update user tracking
        userBadges[recipient].push(tokenId);
        userHasAchievement[recipient][achievementCode] = true;
        
        emit BadgeMinted(recipient, tokenId, achievementCode, name);
    }
    
    /**
     * @dev Add a valid achievement code
     */
    function addAchievementCode(string memory code, string memory name) 
        public onlyRole(ADMIN_ROLE) {
        require(bytes(code).length > 0, "CampusBadgeNFT: Achievement code cannot be empty");
        require(bytes(name).length > 0, "CampusBadgeNFT: Achievement name cannot be empty");
        
        validAchievementCodes[code] = true;
        achievementNames[code] = name;
        
        emit AchievementCodeAdded(code, name);
    }
    
    /**
     * @dev Remove an achievement code
     */
    function removeAchievementCode(string memory code) 
        public onlyRole(ADMIN_ROLE) {
        validAchievementCodes[code] = false;
        achievementNames[code] = "";
        
        emit AchievementCodeRemoved(code);
    }
    
    /**
     * @dev Toggle whether badges can be transferred (soulbound vs transferable)
     */
    function toggleTransfers(bool enabled) public onlyRole(ADMIN_ROLE) {
        transfersEnabled = enabled;
        emit TransfersToggled(enabled);
    }
    
    /**
     * @dev Get all badges owned by a user
     */
    function getUserBadges(address user) public view returns (uint256[] memory) {
        return userBadges[user];
    }
    
    /**
     * @dev Get badge metadata
     */
    function getBadgeMetadata(uint256 tokenId) public view returns (
        string memory name,
        string memory description,
        string memory category,
        uint256 mintedAt,
        string memory achievementCode,
        string[] memory attributeKeys
    ) {
        require(_exists(tokenId), "CampusBadgeNFT: Badge does not exist");
        
        BadgeMetadata storage badge = badgeMetadata[tokenId];
        return (
            badge.name,
            badge.description,
            badge.category,
            badge.mintedAt,
            badge.achievementCode,
            badge.attributeKeys
        );
    }
    
    /**
     * @dev Get badge attribute value
     */
    function getBadgeAttribute(uint256 tokenId, string memory attributeKey) 
        public view returns (string memory) {
        require(_exists(tokenId), "CampusBadgeNFT: Badge does not exist");
        return badgeMetadata[tokenId].attributes[attributeKey];
    }
    
    /**
     * @dev Check if user has a specific achievement
     */
    function hasAchievement(address user, string memory achievementCode) 
        public view returns (bool) {
        return userHasAchievement[user][achievementCode];
    }
    
    /**
     * @dev Get total number of unique badge holders
     */
    function getTotalHolders() public view returns (uint256) {
        uint256 holders = 0;
        uint256 totalSupply = totalSupply();
        
        for (uint256 i = 1; i <= totalSupply; i++) {
            if (_exists(i)) {
                holders++;
            }
        }
        
        return holders;
    }
    
    /**
     * @dev Override transfer functions to make badges soulbound unless enabled
     */
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        whenNotPaused
        override(ERC721, ERC721Enumerable)
    {
        // Allow minting (from == address(0))
        if (from != address(0) && !transfersEnabled) {
            revert("CampusBadgeNFT: Badges are soulbound and cannot be transferred");
        }
        
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    /**
     * @dev Pause all badge operations
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause all badge operations
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    // Required overrides
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}