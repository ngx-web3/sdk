import { ethers } from "ethers";
import { NgxWeb3CoreService } from "@ngx-web3/core";

import { NgxWeb3RequestPayment, toWei } from "..";

export class NgxWeb3Service extends NgxWeb3CoreService implements NgxWeb3RequestPayment {

  constructor(eth: ethers.providers.ExternalProvider, context: Window = window) {
    super(eth, context);
  }
  
  async requestPayment({to, symbol, chainId, amount}: {
    to: string, 
    symbol: string, 
    amount: string
    chainId?: number, 
  }) {
    if (!to) {
      throw new Error('No payment destination address provided');
    }
    // switch correct network
    await this._checkNetwork(symbol, chainId);
    // check if user is logged in to MetaMask
    const accounts =  await this._getAccounts();
    if (!accounts || !accounts.length) {
      throw new Error('User is not logged in to MetaMask');
    }
    // check if same from and destination address
    if (accounts[0] === to) {
      throw new Error('Payment address must be different to destination address');
    }
    // check if user has enough funds
    const balance = await this._getBalance(accounts[0]);
    if (balance && parseFloat(balance) < parseFloat(amount)) {
      throw new Error('User does not have enough funds');
    }
    // send the payment transaction
    const data = {
      from: accounts[0],
      to,
      value: toWei(amount, 'ether'),
      chainId
    }
    console.log('[INFO] Sending payment transaction...', data);
    const tx = await this._sendTransaction(data);
    // show transaction hash
    return tx;
  }

}
