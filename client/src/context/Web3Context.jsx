import React, { useEffect, useState, createContext } from 'react';
import { ethers } from 'ethers';

import CrowdFundingABI from './CrowdFunding.json';

const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; //Cambia ad ogni delpoy. Cambialo ad ogni deploy

export const Web3Context = createContext();

const { ethereum } = window;

export const Web3Provider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");

    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Funzione per ottenere l'istanza del contratto
    const getEthereumContract = () => {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const transactionContract = new ethers.Contract(contractAddress, CrowdFundingABI.abi, signer);

        return transactionContract;
    }

    // Funzione per connettere il wallet
    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Per favore installa MetaMask.");

            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error("Nessun oggetto ethereum trovato");
        }
    }

    // Funzione per controllare se il wallet è già connesso al caricamento della pagina
    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Per favore installa MetaMask.");

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            } else {
                console.log("Nessun account trovato");
            }
        } catch (error) {
            console.log(error);
            throw new Error("Nessun oggetto ethereum trovato");
        }
    }

    const fetchCampaigns = async () => {
        setIsLoading(true);
        try {
            const contract = getEthereumContract();
            const data = await contract.getCampaigns();

            const parsedCampaigns = data.map((campaign, i) => ({
                owner: campaign.owner,
                title: campaign.title,
                description: campaign.description,
                target: ethers.utils.formatEther(campaign.target.toString()),
                deadline: campaign.deadline.toNumber(),
                amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
                image: campaign.image,
                pId: i
            }));

            console.log("Campagne caricate:", parsedCampaigns);
            setCampaigns(parsedCampaigns);
        } catch (error) {
            console.log("Errore nel caricamento delle campagne:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if(contractAddress) fetchCampaigns();
    }, [currentAccount]);

    return (
        <Web3Context.Provider value={{ 
            connectWallet, 
            currentAccount, 
            getEthereumContract,
            campaigns,
            fetchCampaigns,
            isLoading 
        }}>
            {children}
        </Web3Context.Provider>
    );
}