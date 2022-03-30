import { ethers } from "ethers";
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const toWei = (val: string, unit?: string): ethers.BigNumber => {
  const result = ethers.utils.parseUnits(val, unit);
  return result;
}

// function to convert sol to lamports usiing LAMPORTS_PER_SOL utility
// (There are 1-billion lamports in one SOL)
export const toLamports = (val: string): number => {
  const result = parseFloat(val) * LAMPORTS_PER_SOL;
  return result;
}

// request api to conver USD to Ether
export const fromUSDtoEther = async (val: string): Promise<string> => {
  const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`);
  const data = await response.json();
  const result = parseFloat(val) / data.ethereum.usd;
  return result.toString();
}

// request api to conver USD to SOL
export const fromUSDtoSOL = async (val: string): Promise<string> => {
  const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd`);
  const data = await response.json();
  const result = parseFloat(val) / data.solana.usd;
  return result.toString();
}

// request api to conver usd to bnb
export const fromUSDtoBNB = async (val: string): Promise<string> => {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd`;
  const response = await fetch(url);
  const data = await response.json();
  const result = parseFloat(val) / data.binancecoin.usd;
  return result.toString();
}

// request api to conver usd to btc
export const fromUSDtoBTC = async (val: string): Promise<string> => {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`;
  const response = await fetch(url);
  const data = await response.json();
  const result = parseFloat(val) / data.bitcoin.usd;
  return result.toString();
}

// request api to conver usd to wei
export const fromUSDtoWEI = async (val: string): Promise<string> => {
  const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`);
  const data = await response.json();
  const result = (parseFloat(val) / data.ethereum.usd);
  // split the result to get 18 length string
  const value = result.toString().slice(0, 18);
  return toWei(value, 'ether').toString();
}