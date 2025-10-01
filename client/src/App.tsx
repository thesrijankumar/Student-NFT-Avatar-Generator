import React from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import StudentNFTApp from "./StudentNFTApp";

function App() {

  return (
    <AptosWalletAdapterProvider autoConnect={true}>
      <StudentNFTApp />
    </AptosWalletAdapterProvider>
  );
}

export default App;
