// utils/aptosClient.ts
import { FUNCTIONS } from "../config/aptosConfig";

interface EntryFunctionPayload {
  function: string;
  typeArguments: string[];
  functionArguments: any[];
  max_gas_amount?: number;
  gas_unit_price?: number;
}

// Create Avatar Transaction
export const createAvatarTransaction = (avatarUri: string): { data: EntryFunctionPayload } => {
  return {
    data: {
      function: FUNCTIONS.CREATE_AVATAR,
      typeArguments: [],
      functionArguments: [avatarUri],
      max_gas_amount: 2000, // safe default
      gas_unit_price: 1,     // default price
    },
  };
};

// Complete and Reward Transaction
export const completeAndRewardTransaction = (
  studentAddress: string,
  rewardAmount: number
): { data: EntryFunctionPayload } => {
  return {
    data: {
      function: FUNCTIONS.COMPLETE_AND_REWARD,
      typeArguments: [],
      functionArguments: [studentAddress, rewardAmount],
      max_gas_amount: 3000, // higher for more complex tx
      gas_unit_price: 1,
    },
  };
};
