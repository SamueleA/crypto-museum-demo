import React, { useState, useRef } from "react";
import { Spinner, Button, Jumbotron } from 'react-bootstrap';
import fleekStorage from '@fleekhq/fleek-storage-js';
import { newContextComponents } from "@drizzle/react-components";
import ImageUploader from "react-images-upload";

const { ContractData } = newContextComponents;

export default ({ drizzle, drizzleState }) => {
  const imageUploaderRef = useRef(null);
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txQueue, setTxQueue] = useState([]);
  const onDrop = (picture) => {
    if (picture.length) {
      return setArtwork(picture[0])
    }
    setArtwork(null)
  };

  const clearPreview = () => {
    setArtwork(null);
    imageUploaderRef.current.clearPictures();
  };

  const createNFTTransaction = async (hash) => {
    const tokenURI = `https://ipfs.io/ipfs/${hash}`;

    const removeFromQueue = () => {
      const newTxQueue = txQueue.filter((uri) => uri !== tokenURI);
      setTxQueue(newTxQueue);
    }

    try {
      setTxQueue([...txQueue, tokenURI]);
      await drizzle.contracts.CryptoMuseum.methods.mint(hash).send({from: drizzleState.accounts[0]})
      removeFromQueue(tokenURI);
    } catch(e) {
      console.error(e);
      removeFromQueue(tokenURI);
    }
  };

  const handleButtonClick = async (newTokenId) => {
    setLoading(true)
    try {
      const date = new Date();
      const timestamp = date.getTime();

      const { hash } = await fleekStorage.upload({
        apiKey: 'API_KEY',
        apiSecret: 'API_SECRET',
        key: `nft/${newTokenId}-${timestamp}`,
        data: artwork,
      });

      setLoading(false);
      clearPreview();
      createNFTTransaction(hash)
    } catch(e) {
      console.error(e);
      setLoading(false);
    }
  }

  const getTokenDisplay = (tokenId) => {
    return (
      <div className="token-container">
        <span>token ID: {tokenId}</span>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="CryptoMuseum"
          method="CID"
          methodArgs={[tokenId]}
          render={(cid) =>  (
            <div className="artwork-container">
              <img className="artwork" src={`https://ipfs.fleek.co/ipfs/${cid}`} />
            </div>
          )}
        />
      </div>
    )
  };

  return (
  <div className="App">
    <div className="title"><h1>The Crypto Museum</h1></div>
    <div className="subtitle">
      {"ERC-721 Address: "}
      <a
        href={`https://ropsten.etherscan.io/address/${drizzle.contractList[0].address}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {drizzle.contractList[0].address}
        </a>
    </div>
    <Jumbotron>
      <div>The Crypto Museum is a Dapp meant to demo the capabilities of <a href="https://docs.fleek.co/Storage/CLI_SDK">Fleek's Storage SDK</a>, which facilitates the permanent storage of files to IPFS.</div>
      <div>The Museum itself is an ERC-721 contract that allows users to upload a piece of artwork and mint a new ERC-721 token.</div>
      <div>An art gallery allows users to view their token collection.</div>
      <div>NOTE: This app runs on the Ropsten Testnet</div>
      <div className="add-nft-title">
        <h2>Add a new NFT to your collection!</h2>
      </div>
      <div className="steps">
        <span>1. Upload artwork</span>
      </div>
      <div className="uploader">
        <ImageUploader
          withIcon={true}
          buttonText="Choose image"
          onChange={onDrop}
          imgExtension={[".jpg", ".gif", ".png", ".gif"]}
          maxFileSize={5242880}
          withPreview
          singleImage
          ref={iu => imageUploaderRef.current = iu}
        />
      </div>
      <div className="steps">
        <span>2. Create an NFT!</span>
        <div>
          Connect to the Ropsten Network on Metamask. Go <a href="https://faucet.ropsten.be/" target="_blank" rel="noopener noreferrer">here</a> for Ropsten Ether.
        </div>
      </div>
      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract="CryptoMuseum"
        method="totalSupply"
        render={(supply) => (
          <div>
            <Button
              disabled={!artwork || loading}
              onClick={() => handleButtonClick(supply)}
              className="button"
            >
            {loading
              ? <Spinner animation="border" variant="light" size="sm" />
              : <span>Create NFT</span>
            }
          </Button>
        </div>
        )}
      />
      <div className="steps">
        3. Your artwork will appear in your collection once the transaction is accepted
      </div>
      <div>
      {txQueue.length === 1 && (
          <>
            Minting a new token...
          </>
        )}
        {txQueue.length > 1 && (
          <>
            Minting {txQueue.length} new tokens...
          </>
        )}
      </div>
      {
        txQueue.length > 0 && (
          <div>
            <Spinner animation="border" />
          </div>
        )
      }
    </Jumbotron>
    <div className="collection-title"><h1>Collection</h1></div>
    <div className="colleciton-subtitle">These fine pieces of art belong to: {drizzleState.accounts[0]}</div>
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract="CryptoMuseum"
      method="balanceOf"
      methodArgs={[drizzleState.accounts[0]]}
      render={(balanceOf) => {
        const emptyArray = [];
        const arrayLength = Number(balanceOf);
        for(let i=0;i<arrayLength;i++){ emptyArray.push('') }
        if(emptyArray.length === 0) {
          return (
            <Jumbotron className="no-artwork">
              You have no artwork in your collection!
            </Jumbotron>
          )
        }
        return (
            <div className="collection-container">
                {emptyArray.map(( _, index) => {
                  return (
                    <ContractData
                      key={index}
                      drizzle={drizzle}
                      drizzleState={drizzleState}
                      contract="CryptoMuseum"
                      method="tokenOfOwnerByIndex"
                      methodArgs={[drizzleState.accounts[0], arrayLength - 1 - index]}
                      render={(tokenId) => (
                        <>
                          {getTokenDisplay(tokenId)}
                        </>
                      )}
                    />
                  )}
                )}
            </div>
          );
      }}
    />
  </div>
  );
};
