import React, { useContext } from 'react';
import { Web3Context } from './context/Web3Context';

const App = () => {
  const { connectWallet, currentAccount } = useContext(Web3Context);  

  return (
    <div className="app" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Crypto Crowdfunding</h1>
      
      {currentAccount ? (
        <div style={{ backgroundColor: '#d4edda', padding: '10px', borderRadius: '5px' }}>
          <p>Wallet Connesso: <strong>{currentAccount}</strong></p>
        </div>
      ) : (
        <button 
          onClick={connectWallet}
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer',
            borderRadius: '5px'
          }}
        >
          Connetti MetaMask
        </button>
      )}

      <div style={{ marginTop: '20px' }}>
        <p>Stato progetto: Frontend collegato al Context.</p>
      </div>
    </div>
  );
}

export default App;