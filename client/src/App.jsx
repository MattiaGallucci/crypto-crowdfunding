import React, { useContext } from 'react';
import { Web3Context } from './context/Web3Context';
import CreateCampaign from './CreateCampaign';

const App = () => {
  const { connectWallet, currentAccount } = useContext(Web3Context);  

  return (
    <div className="app" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Crypto Crowdfunding</h1>
      
      {!currentAccount ? (
        <button onClick={connectWallet}>Connetti MetaMask</button>
      ) : (
        <div>
            <p>Connesso: {currentAccount}</p>
            <hr />
            <CreateCampaign />
        </div>
      )}
    </div>
  );
}

export default App;