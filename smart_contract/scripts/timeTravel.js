const { network } = require("hardhat");

async function main() {
  // Avanza di 30 giorni (in secondi)
  await network.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
  await network.provider.send("evm_mine"); // Mina un nuovo blocco per confermare
  console.log("Viaggio nel tempo completato: +30 giorni");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });