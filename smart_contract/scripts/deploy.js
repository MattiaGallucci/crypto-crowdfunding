const hre = require("hardhat");

async function main() {
  // Otteniamo il factory del contratto
  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
  
  // Deploy del contratto
  const crowdFunding = await CrowdFunding.deploy();

  // Attendiamo che il deploy sia completato
  await crowdFunding.deployed();

  console.log(`CrowdFunding deployato a: ${crowdFunding.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});