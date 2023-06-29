/* eslint-disable @typescript-eslint/no-unsafe-member-access */
 
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useContract, useAccount, useSigner } from 'wagmi'
import { type BigNumber, ethers } from 'ethers';

import { type ISwapOut } from '../../Interfaces';
import LBRouterAbi from "./abis/LBRouter.json";
import LBFactoryAbi from "./abis/LBFactory.json";

// TODO: read from enviroment variable
const CONTRACT_ADDRESS_ROUTER  = "0xb4315e873dBcf96Ffd0acd8EA43f689D8c20fB30";
const CONTRACT_ADDRESS_FACTORY = "0x8e42f2F4101563bF679975178e880FD87d3eFd4e";
const WNATIVE = "0xd00ae08403B9bbb9124bB305C09058E32C39A48c";
const USDT = "0xAb231A5744C8E6c45481754928cCfFFFD4aa0732";
const USDC = "0xB6076C93701D6a07266c31066B298AeC6dd65c2d";
const ERC20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)"
];

/**
 * @dev This enum represents the version of the pair requested
 * - V1: Joe V1 pair
 * - V2: LB pair V2. Also called legacyPair
 * - V2_1: LB pair V2.1 (current version)
 */
enum JoeVersion {
  V1,
  V2,
  V2_1
}

export const useTraderJoe = () => {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const lbRouterContract = useContract({
    address: CONTRACT_ADDRESS_ROUTER,
    abi: LBRouterAbi,
    signerOrProvider: signer,
  });
  const lbFactoryContract = useContract({
    address: CONTRACT_ADDRESS_FACTORY,
    abi: LBFactoryAbi,
    signerOrProvider: signer,
  });
  const usdtContract = useContract({
    address: USDT,
    abi: ERC20Abi,
    signerOrProvider: signer,
  });
  const usdcContract = useContract({
    address: USDC,
    abi: ERC20Abi,
    signerOrProvider: signer,
  });

  const getLastBlockTimestamp = () => {  
    return Math.floor(Date.now() / 1000) + 60 * 20;
  }

  const erc20Approve = async (token: string, amount: string) => {
    if (!usdtContract || !usdcContract) throw new Error('No ERC20 initialized');

    if (token === USDT) {
      await usdtContract.approve(CONTRACT_ADDRESS_ROUTER, amount);
    } else {
      await usdcContract.approve(CONTRACT_ADDRESS_ROUTER, amount);
    }
  }

  const buildPath = async (path: string[]) => {
    const tokenIn = path[0];
    const tokenOut = path[path.length - 1];
    const allSteps = await lbFactoryContract?.getAllLBPairs(tokenIn, tokenOut);
    console.log(allSteps, tokenIn, tokenOut);
    
    const PATH = {
      pairBinSteps: [0],
      versions: [JoeVersion.V1],
      tokenPath: [tokenIn, tokenOut],
    }

    return PATH;
  }

  // const getLBPairInformation = async (tokenA: string, tokenB: string) => {
  //   if (!lbFactoryContract) throw new Error('No LBRouter initialized');
  //   console.log("SWAP NATIVE", tokenA, tokenB);
  //   console.log("Steps: ", (await lbFactoryContract.getAllBinSteps()).map(String));
  //   const allSteps = await lbFactoryContract.getAllLBPairs(tokenA, tokenB);
    
  //   const pair = await lbFactoryContract.getLBPairInformation(tokenA, tokenB, allSteps[0].binStep);
  //   console.log("LBPAIR: ", pair);

  //   return pair.LBPair;
  // };


  const getSwapOut = async (pair: string, amount: string, swapForY: boolean) : Promise<ISwapOut> => {
    try {
      if (!lbRouterContract) throw new Error('No LBRouter initialized');
      //const pair = await getLBPairInformation(tokenB, tokenA);

      console.log("SWAP_OUT", pair, amount, swapForY);
      
      const swap: Array<BigNumber> = await lbRouterContract.getSwapOut(pair, amount, swapForY);      
      
      return {
        amountInLeft: swap[0]?.toString() ?? "0",
        amountOut: swap[1]?.toString() ?? "0",
        fee: swap[2]?.toString() ?? "0",
        success: swap[0]?.toString() === "0" ? true : false,
      };
    } catch (error) {
      console.log("Error: ", error);

      return {
        amountInLeft: "0",
        amountOut: "0",
        fee: "0",
        success: false,
      };
    }
  }

  const swapExactTokensForNATIVE = async (tokenIn: string, amountIn: string, amountOut: string) => {
    try {
      if (!lbRouterContract) throw new Error('No LBRouter initialized');
      const PATH = await buildPath([tokenIn, WNATIVE]);
      await erc20Approve(tokenIn, amountIn);
      const deadline = getLastBlockTimestamp();
      const overrides = {
        gasLimit: 1000000,
      };
      const amountOutWithSlippage = ethers.BigNumber.from(amountOut).mul(0).div(100).toString();
      console.log("SWAP tokensForNative", amountIn, amountOut, amountOutWithSlippage);
      
      const amountOutReal = await lbRouterContract.swapExactTokensForTokens(
        amountIn,
        amountOutWithSlippage,
        PATH,
        address,
        deadline,
        overrides,
      );
      console.log("AMOUNTOUT: ", await amountOutReal.wait());
      
    } catch (error) {
      console.log("Error: ", error);
    }
    return;
  }

  const swapExactTokensForTokens = async (
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    amountOut: string
  ) => {
    try {
      if (!lbRouterContract) throw new Error('No LBRouter initialized');
      await erc20Approve(tokenIn, amountIn);
      const PATH = tokenIn === USDT ? {
        pairBinSteps: [15, 0],
        versions: [JoeVersion.V2_1, JoeVersion.V1],
        tokenPath: [tokenIn, WNATIVE, tokenOut],
      } : {
        pairBinSteps: [1],
        versions: [JoeVersion.V2_1],
        tokenPath: [tokenIn, tokenOut],
      }
      const deadline = getLastBlockTimestamp();
      const overrides = {
        gasLimit: 1000000,
      };
      const amountOutWithSlippage = ethers.BigNumber.from(amountOut).mul(0).div(100).toString();
      console.log("SWAP tokensForTokens", amountIn, amountOut, amountOutWithSlippage);
      
      const amountOutReal = await lbRouterContract.swapExactTokensForTokens(
        amountIn,
        amountOutWithSlippage,
        PATH,
        address,
        deadline,
        overrides
      );
      console.log("AMOUNTOUT: ", await amountOutReal.wait());
      
    } catch (error) {
      console.log("Error: ", error);
    }
    return;
  }

  const swapExactNATIVEForTokens = async (tokenOut: string, amountIn: string, amountOut: string) => {
    try {
      if (!lbRouterContract) throw new Error('No LBRouter initialized');
      const PATH = await buildPath([WNATIVE, tokenOut]);
      const deadline = getLastBlockTimestamp();
      const overrides = {
        gasLimit: 1000000,
        value: amountIn,
      };
      const amountOutWithSlippage = ethers.BigNumber.from(amountOut).mul(0).div(100).toString();
      console.log("SWAP NATIVE", amountIn, amountOut, amountOutWithSlippage);
      
      const amountOutReal = await lbRouterContract.swapExactNATIVEForTokens(
        amountOutWithSlippage,
        PATH,
        address,
        deadline,
        overrides
      );
      console.log("AMOUNTOUT: ", await amountOutReal.wait());
      
    } catch (error) {
      console.log("Error: ", error);
    }
    return;
  }

  return {
    WNATIVE,
    getSwapOut,
    swapExactNATIVEForTokens,
    swapExactTokensForNATIVE,
    swapExactTokensForTokens,
  };
};