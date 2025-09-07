const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment of Campus Economy contracts...");
  
  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`📝 Deploying contracts with account: ${deployer.address}`);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${hre.ethers.formatEther(balance)} ETH`);

  try {
    // Deploy CampusCoin
    console.log("\n🪙 Deploying CampusCoin...");
    const CampusCoin = await hre.ethers.getContractFactory("CampusCoin");
    const campusCoin = await CampusCoin.deploy();
    await campusCoin.waitForDeployment();
    const campusCoinAddress = await campusCoin.getAddress();
    console.log(`✅ CampusCoin deployed to: ${campusCoinAddress}`);

    // Deploy CampusBadgeNFT
    console.log("\n🏅 Deploying CampusBadgeNFT...");
    const CampusBadgeNFT = await hre.ethers.getContractFactory("CampusBadgeNFT");
    const campusBadgeNFT = await CampusBadgeNFT.deploy();
    await campusBadgeNFT.waitForDeployment();
    const campusBadgeNFTAddress = await campusBadgeNFT.getAddress();
    console.log(`✅ CampusBadgeNFT deployed to: ${campusBadgeNFTAddress}`);

    // Deploy CampusEconomyManager
    console.log("\n🏢 Deploying CampusEconomyManager...");
    const CampusEconomyManager = await hre.ethers.getContractFactory("CampusEconomyManager");
    const campusEconomyManager = await CampusEconomyManager.deploy(
      campusCoinAddress,
      campusBadgeNFTAddress
    );
    await campusEconomyManager.waitForDeployment();
    const campusEconomyManagerAddress = await campusEconomyManager.getAddress();
    console.log(`✅ CampusEconomyManager deployed to: ${campusEconomyManagerAddress}`);

    // Grant roles to CampusEconomyManager
    console.log("\n🔐 Setting up roles...");
    
    // Grant MINTER_ROLE and REWARD_DISTRIBUTOR_ROLE to CampusEconomyManager for CampusCoin
    const MINTER_ROLE = await campusCoin.MINTER_ROLE();
    const REWARD_DISTRIBUTOR_ROLE = await campusCoin.REWARD_DISTRIBUTOR_ROLE();
    
    console.log("🔑 Granting MINTER_ROLE to CampusEconomyManager...");
    await campusCoin.grantRole(MINTER_ROLE, campusEconomyManagerAddress);
    
    console.log("🔑 Granting REWARD_DISTRIBUTOR_ROLE to CampusEconomyManager...");
    await campusCoin.grantRole(REWARD_DISTRIBUTOR_ROLE, campusEconomyManagerAddress);

    // Grant MINTER_ROLE to CampusEconomyManager for CampusBadgeNFT
    const NFT_MINTER_ROLE = await campusBadgeNFT.MINTER_ROLE();
    console.log("🔑 Granting NFT MINTER_ROLE to CampusEconomyManager...");
    await campusBadgeNFT.grantRole(NFT_MINTER_ROLE, campusEconomyManagerAddress);

    // Setup initial reward rules
    console.log("\n🎯 Setting up initial reward rules...");
    
    const rewardRules = [
      {
        code: "ATTENDANCE",
        tokenAmount: hre.ethers.parseEther("10"),
        hasBadge: false,
        badgeName: "",
        badgeDescription: "",
        badgeCategory: "",
        badgeImageURI: "",
        maxClaimsPerUser: 0, // unlimited
        cooldownPeriod: 24 * 60 * 60 // 24 hours
      },
      {
        code: "HACKATHON_WIN",
        tokenAmount: hre.ethers.parseEther("500"),
        hasBadge: true,
        badgeName: "Hackathon Winner",
        badgeDescription: "Awarded for winning a campus hackathon",
        badgeCategory: "Competition",
        badgeImageURI: "ipfs://QmHackathonWinnerBadge",
        maxClaimsPerUser: 1,
        cooldownPeriod: 0
      },
      {
        code: "VOLUNTEER_HOURS",
        tokenAmount: hre.ethers.parseEther("25"),
        hasBadge: false,
        badgeName: "",
        badgeDescription: "",
        badgeCategory: "",
        badgeImageURI: "",
        maxClaimsPerUser: 0,
        cooldownPeriod: 7 * 24 * 60 * 60 // 7 days
      },
      {
        code: "SPORTS_CHAMPION",
        tokenAmount: hre.ethers.parseEther("300"),
        hasBadge: true,
        badgeName: "Sports Champion",
        badgeDescription: "Awarded for winning campus sports competition",
        badgeCategory: "Sports",
        badgeImageURI: "ipfs://QmSportsChampionBadge",
        maxClaimsPerUser: 1,
        cooldownPeriod: 0
      },
      {
        code: "PROJECT_EXCELLENCE",
        tokenAmount: hre.ethers.parseEther("200"),
        hasBadge: true,
        badgeName: "Project Excellence",
        badgeDescription: "Awarded for outstanding project work",
        badgeCategory: "Academic",
        badgeImageURI: "ipfs://QmProjectExcellenceBadge",
        maxClaimsPerUser: 3,
        cooldownPeriod: 30 * 24 * 60 * 60 // 30 days
      }
    ];

    for (const rule of rewardRules) {
      console.log(`📝 Creating reward rule: ${rule.code}`);
      await campusEconomyManager.createRewardRule(
        rule.code,
        rule.tokenAmount,
        rule.hasBadge,
        rule.badgeName,
        rule.badgeDescription,
        rule.badgeCategory,
        rule.badgeImageURI,
        rule.maxClaimsPerUser,
        rule.cooldownPeriod
      );
    }

    // Setup initial vendor products
    console.log("\n🏪 Setting up initial vendor products...");
    
    const products = [
      {
        id: "CANTEEN_MEAL_REG",
        name: "Regular Meal",
        description: "Standard meal combo with rice, curry, and sides",
        price: hre.ethers.parseEther("50"),
        vendor: "Campus Canteen",
        category: "food"
      },
      {
        id: "CANTEEN_MEAL_PREM",
        name: "Premium Meal",
        description: "Premium meal with special dishes and dessert",
        price: hre.ethers.parseEther("75"),
        vendor: "Campus Canteen",
        category: "food"
      },
      {
        id: "LIBRARY_EXTEND",
        name: "Book Extension (7 days)",
        description: "Extend your book borrowing period by 7 days",
        price: hre.ethers.parseEther("20"),
        vendor: "Central Library",
        category: "services"
      },
      {
        id: "EVENT_PASS_CULTURAL",
        name: "Cultural Event Pass",
        description: "Access to premium cultural events and shows",
        price: hre.ethers.parseEther("100"),
        vendor: "Student Activities",
        category: "events"
      },
      {
        id: "MERCH_TSHIRT",
        name: "Campus T-Shirt",
        description: "Official campus merchandise t-shirt",
        price: hre.ethers.parseEther("150"),
        vendor: "Campus Store",
        category: "merchandise"
      }
    ];

    for (const product of products) {
      console.log(`🛍️ Adding product: ${product.name}`);
      await campusEconomyManager.addVendorProduct(
        product.id,
        product.name,
        product.description,
        product.price,
        product.vendor,
        product.category
      );
    }

    // Output deployment summary
    console.log("\n🎉 Deployment completed successfully!");
    console.log("\n📋 Contract Addresses:");
    console.log(`├── CampusCoin: ${campusCoinAddress}`);
    console.log(`├── CampusBadgeNFT: ${campusBadgeNFTAddress}`);
    console.log(`└── CampusEconomyManager: ${campusEconomyManagerAddress}`);
    
    console.log("\n💾 Save these addresses to your environment variables:");
    console.log(`CAMPUS_COIN_ADDRESS=${campusCoinAddress}`);
    console.log(`CAMPUS_BADGE_NFT_ADDRESS=${campusBadgeNFTAddress}`);
    console.log(`CAMPUS_ECONOMY_MANAGER_ADDRESS=${campusEconomyManagerAddress}`);

    // Verify contracts if on a testnet/mainnet
    const network = hre.network.name;
    if (network !== "hardhat" && network !== "localhost") {
      console.log("\n🔍 Waiting before verification...");
      await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
      
      console.log("🔍 Verifying contracts on Etherscan...");
      try {
        await hre.run("verify:verify", {
          address: campusCoinAddress,
          constructorArguments: []
        });
        
        await hre.run("verify:verify", {
          address: campusBadgeNFTAddress,
          constructorArguments: []
        });
        
        await hre.run("verify:verify", {
          address: campusEconomyManagerAddress,
          constructorArguments: [campusCoinAddress, campusBadgeNFTAddress]
        });
        
        console.log("✅ All contracts verified successfully!");
      } catch (error) {
        console.log("⚠️ Verification failed:", error.message);
      }
    }

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});