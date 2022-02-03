
import { NgxWeb3WalletProviderInterface } from "..";


export const CHAIN_NETWORKS = [
  {
    name: 'bsc', 
    displayName: 'BNB',
    symbol: 'BNB', 
    type: [
      {name: 'mainnet', id: 38},
      {name: 'testnet', id: 61},
    ]
  },
  {
    name: 'eth', 
    symbol: 'ETH', 
    displayName: 'Ethereum',
    type: [
      {name: 'mainnet', id: 1},
      {name: 'ropsten', id: 3},
      {name: 'rinkeby', id: 4},
    ]
  },
  {
    name: 'solana', 
    symbol: 'SOL', 
    displayName: 'Solana',
    type: [
      {name: 'mainnet-beta', id: 1},
      {name: 'testnet', id: 2},
      {name: 'devnet', id: 3},
    ]
  }

];

export class NgxWeb3WalletService {

  protected _provider!: NgxWeb3WalletProviderInterface;

  constructor(provider: NgxWeb3WalletProviderInterface) {
    if (!provider) {
      throw new Error('Web3 is not supported. Not provider provided');
    }
    this._provider = provider;
  }

  async isConnected() {
    const isConnected = this._provider?.isConnected() ?? false;
    return isConnected;
  }

  async connect() {
    await this._provider?.connect();
  }

}
