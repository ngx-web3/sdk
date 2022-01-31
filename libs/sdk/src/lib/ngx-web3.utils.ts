import { ethers } from "ethers";

export const toWei = (val: string, unit?: string): ethers.BigNumber => {
  const result = ethers.utils.parseUnits(val, unit);
  return result;
}
