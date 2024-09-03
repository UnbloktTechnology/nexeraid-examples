export const mockSwapABi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "nativeAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "usdtAmount",
        type: "uint256",
      },
    ],
    name: "SwapNativeForUSDT",
    type: "event",
  },
  {
    inputs: [],
    name: "swapNativeForUSDT",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
