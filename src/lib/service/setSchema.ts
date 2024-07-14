import { getWalletClient } from "@wagmi/core";
import { encodeFunctionData, type TransactionReceipt } from "viem";
import {
  sendTransaction,
  estimateGas,
  waitForTransactionReceipt,
} from "viem/actions";

import { RESOLVER_CONTRACT_OP } from "@/lib/client/constants";
import { Action } from "@/lib/shared/types";
import { publicClient } from "@/lib/wallet/client";
import { wagmiConfig } from "@/wagmi";

export async function setSchema({
  from,
  uid,
  roleId,
  action,
  msgValue,
}: {
  from: `0x${string}`;
  uid: `0x${string}`;
  roleId: `0x${string}`;
  action: Action;
  msgValue: bigint;
}): Promise<TransactionReceipt | Error> {
  const actionAsBigInt = BigInt(action);
  const walletClient = await getWalletClient(wagmiConfig);
  let gasLimit;

  const data = encodeFunctionData({
    abi: [
      {
        inputs: [
          { internalType: "bytes32", name: "uid", type: "bytes32" },
          { internalType: "bytes32", name: "roleId", type: "bytes32" },
          { internalType: "uint256", name: "action", type: "uint256" },
        ],
        name: "setSchema",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    args: [uid, roleId, actionAsBigInt],
  });

  try {
    gasLimit = estimateGas(publicClient, {
      account: from as `0x${string}`,
      to: RESOLVER_CONTRACT_OP as `0x${string}`,
      data: data,
      value: msgValue,
    });
  } catch (error) {
    return Error("Error estimating gas.");
  }

  try {
    const transactionHash = await sendTransaction(walletClient, {
      account: from as `0x${string}`,
      to: RESOLVER_CONTRACT_OP as `0x${string}`,
      gasLimit: gasLimit,
      data: data,
      value: msgValue,
      chain: walletClient.chain,
    });

    const transactionReceipt: TransactionReceipt =
      await waitForTransactionReceipt(publicClient, {
        hash: transactionHash,
      });

    return transactionReceipt;
  } catch (error) {
    return Error("Error sending transaction.");
  }
}
