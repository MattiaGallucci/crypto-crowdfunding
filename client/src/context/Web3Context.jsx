import React, { useEffect, useState, createContext } from 'react';
import { ethers } from 'ethers';

import CrowdFundingABI from './CrowdFunding.json';

const contractAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; //Cambia ad ogni delpoy. Cambialo ad ogni deploy

export const Web3Context = createContext();

const { ethereum } = window;

export const Web3Provider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");

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

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <Web3Context.Provider value={{ currentAccount, connectWallet, getEthereumContract }}>
            {children}
        </Web3Context.Provider>
    );
}