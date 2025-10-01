import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Replace with YOUR deployed contract address from Step 1.2
export const MODULE_ADDRESS = "0x9706d4116f83f9701aaee780d6d046088a159c8934492b3a8b5eb28ee55faa32";

export const APTOS_CONFIG = new AptosConfig({ 
  network: Network.TESTNET 
});

export const aptos = new Aptos(APTOS_CONFIG);

// Contract function names
export const MODULE_NAME = "StudentNFTGenerator";

export const FUNCTIONS = {
  CREATE_AVATAR: `${MODULE_ADDRESS}::${MODULE_NAME}::create_avatar`,
  COMPLETE_AND_REWARD: `${MODULE_ADDRESS}::${MODULE_NAME}::complete_and_reward`,
};