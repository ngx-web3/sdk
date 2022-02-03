import { NgxWeb3WalletProviderInterface, NgxWeb3WalletService } from "@ngx-web3/core";
import { fromUSDtoBNB, fromUSDtoEther, fromUSDtoSOL } from "./sdk-web3.utils";
import { NgxWeb3RequestPayment } from "./sdk-web3.interface";

export class WalletService extends NgxWeb3WalletService implements NgxWeb3RequestPayment {

  constructor(provider: NgxWeb3WalletProviderInterface) {
    super(provider);
  }
  
  async requestPayment(param: {to: string, symbol: string, amount: string, chainId?: number}) {
    const {to, symbol, chainId, amount} = param;
    // validate account and get from address
    const from = await this._accountValidation(to, symbol, amount, chainId);
    // convert amount to correct currenncy
    const value = await this._getAmoountWithCurrencyConversion(amount, symbol);
    // send the payment transaction
    const data = { from, to, value, chainId };
    console.log('[INFO] Sending payment transaction...', data);
    const tx = await this._provider.sendTransaction(data);
    // show transaction hash
    return tx;
  }

  private async _accountValidation(to: string, symbol: string, amount: string, chainId?: number) {
    if (!to) {
      throw new Error('No payment destination address provided');
    }
    // switch correct network if needed
    await this._provider.checkNetwork(symbol, chainId);
    // check if user is logged with Crypto Wallet 
    // and request authentication if needed to extract account data
    const accounts =  await this._provider.getAccounts();
    if (!accounts || !accounts.length) {
      throw new Error('User is not logged in to Crypto Wallet');
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
    // validations passed, return from address
    return accounts[0];
  }

  private async _getAmoountWithCurrencyConversion(amount: string, symbol: string) {
    let value;
    switch (true) {
      case symbol === 'ETH':
        value = await fromUSDtoEther(amount.toString());
        break;
      case symbol === 'BNB':
        value = await fromUSDtoBNB(amount?.toString());
        break;
      case symbol === 'SOL':
        value = await fromUSDtoSOL(amount?.toString());
        break;
    }
    return value;
  }

}
