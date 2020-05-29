import React from "react";
import { Jumbotron } from 'react-bootstrap';
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
// import MyComponent from "./MyComponent";
import CryptoMuseum from './CryptoMuseum';
import "./App.css";

const drizzle = new Drizzle(drizzleOptions);

const App = () => {
  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized || drizzleState.web3.status === 'failed') {
            return (
              <Jumbotron className="loading-jumbo">
                <div className="loading-text">
                  <div>Connect Metamask to start the app</div>
                  <div>This app works on the Ropsten Testnet</div>
                </div>
              </Jumbotron>
            )
          }

          return (
            <CryptoMuseum drizzle={drizzle} drizzleState={drizzleState} />
          )
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  );
}

export default App;
