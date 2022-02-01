import { NgxWeb3WalletProviderInterface, NgxWeb3WalletService } from "@ngx-web3/core";
import { NgxWeb3RequestPayment } from "./sdk-web3.interface";
import { toWei } from "./sdk-web3.utils";

export class WalletService extends NgxWeb3WalletService implements NgxWeb3RequestPayment {

  constructor(provider: NgxWeb3WalletProviderInterface, context: Window = window) {
    super(provider, context);
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
    await this._provider.checkNetwork(symbol, chainId);
    // check if user is logged in to MetaMask
    const accounts =  await this._provider.getAccounts();
    if (!accounts || !accounts.length) {
      throw new Error('User is not logged in to MetaMask');
    }
    // check if same from and destination address
    if (accounts[0] === to) {
      throw new Error('Payment address must be different to destination address');
    }
    // check if user has enough funds
    const balance = await this._provider.getBalance(accounts[0]);
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
    const tx = await this._provider.sendTransaction(data);
    // show transaction hash
    return tx;
  }

}
