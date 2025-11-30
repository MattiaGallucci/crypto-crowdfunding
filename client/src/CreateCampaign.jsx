import React, { useState, useContext } from 'react';
import { Web3Context } from './context/Web3Context';
import axios from 'axios';

const CreateCampaign = () => {
    const { getEthereumContract, currentAccount } = useContext(Web3Context);

    const [form, setForm] = useState({
        title: '',
        description: '',
        target: '',
        deadline: '',
        image: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const uploadToPinata = async (file) => {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

        let data = new FormData();
        data.append('file', file);

        /*const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
        const pinataSecretApiKey = import.meta.env.VITE_PINATA_SECRET_API_KEY;

        if (!pinataApiKey || !pinataSecretApiKey) {
            alert("Errore: Chiavi Pinata non trovate nel file .env");
            return null;
        }*/
        
        const pinataJWT = import.meta.env.VITE_PINATA_JWT;

        if (!pinataJWT) {
            alert("Errore: JWT Pinata non trovato nel file .env");
            return null;
        }

        try {
            const res = await axios.post(url, data, {
                headers: {
                    // Axios imposta automaticamente il boundary per FormData, 
                    // noi dobbiamo solo aggiungere l'Authorization
                    'Authorization': `Bearer ${pinataJWT}`
                }
            });
            console.log("Upload riuscito:", res.data);
            return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
        } catch (error) {
            console.error('Errore uploading IPFS:', error);
            return null;
        }
    };

    const handleFormFieldChange = (fieldName, e) => {
        setForm({ ...form, [fieldName]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        let imageUrl = '';
        if (imageFile) {
            imageUrl = await uploadToPinata(imageFile);
            if(!imageUrl) return alert ("Errore caricamento immagine");
        }

        const { title, description, target, deadline } = form;

        const targetInWei = ethers.utils.parseUnits(target, 18);
        const deadlineTimestamp = new Date(deadline).getTime() / 1000;

        try {
            const contract = getEthereumContract();

            const transactin = await contract.createCampaign(
                currentAccount,
                title,
                description,
                targetInWei,
                deadlineTimestamp,
                imageUrl
            );

            await transactin.wait();
            alert("Campagna creata con successo!");
            setIsLoading(false);
        } catch (error) {
            console.error("Errore creazione campagna:", error);
            setIsLoading(false);
        }
    };

    return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Lancia una Campagna</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        <input 
          placeholder="Titolo Campagna" 
          onChange={(e) => handleFormFieldChange('title', e)}
          required
        />
        
        <textarea 
          placeholder="Raccontaci la tua storia..." 
          onChange={(e) => handleFormFieldChange('description', e)}
          required
        />
        
        <input 
          type="number" 
          step="0.01" 
          placeholder="Obiettivo in ETH (es. 0.5)" 
          onChange={(e) => handleFormFieldChange('target', e)}
          required
        />
        
        <label>Scadenza:</label>
        <input 
          type="date" 
          onChange={(e) => handleFormFieldChange('deadline', e)}
          required
        />

        <label>Immagine:</label>
        <input 
          type="file" 
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        <button type="submit" disabled={isLoading} style={{ marginTop: '10px', padding: '10px' }}>
            {isLoading ? "Creazione in corso..." : "Crea Campagna"}
        </button>
      </form>
    </div>
  );
}

import { ethers } from 'ethers';

export default CreateCampaign;