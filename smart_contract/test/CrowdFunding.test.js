const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdFunding COntract", function () {
    let CrowdFunding;
    let crowdFunding;
    let owner;
    let addr1;

    this.beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();

        CrowdFunding = await ethers.getContractFactory("CrowdFunding");
        crowdFunding = await CrowdFunding.deploy();
    });

    it("Dovrebbe creare una campagna correttamente", async function () {
        const title = "Aiuta la ricerca";
        const description = "Descrizione test";
        const target = ethers.parseEther("1");
        const deadline = Math.floor(Date.now() / 1000) + 1000;
        const image = "https://ipfs.io/ipfs/hash...";

        await crowdFunding.createCampaign(
            owner.address,
            title,
            description,
            target,
            deadline,
            image
        );

        // 1. Controlliamo che il numero di campagne sia 1
        expect(await crowdFunding.numberOfCampaigns()).to.equal(1);

        // 2. Recuperiamo la campagna 0 e controlliamo i dati
        const campaign = await crowdFunding.campaigns(0);

        expect(campaign.title).to.equal(title);
        expect(campaign.target).to.equal(target);
        // Verifica che l'owner della campagna sia l'account che l'ha creata
        expect(campaign.owner).to.equal(owner.address);

    });

    it("Dovrebbe fallire se la data è nel passato", async function () {
        const pastDate = Math.floor(Date.now() / 1000) - 1000;
        
        // Ci aspettiamo che la transazione venga "reverted" (rifiutata) con il nostro messaggio di errore
        await expect(
            crowdFunding.createCampaign(owner.address, "Test", "Desc", 100, pastDate, "img")
        ).to.be.revertedWith("La scadenza deve essere nel futuro");
    });
});