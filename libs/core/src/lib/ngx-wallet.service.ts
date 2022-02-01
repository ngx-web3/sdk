
import { ethers } from "ethers";
import { Connection as solanaConnection, clusterApiUrl } from '@solana/web3.js';
import { NgxWeb3WalletProviderInterface } from "..";


export const CHAIN_NETWORKS = [
  {name: 'bsc', symbol: 'BNB', type: [
    {name: 'mainnet', id: 38},
    {name: 'testnet', id: 61},
  ]},
  {name: 'eth', symbol: 'ETH', type: [
    {name: 'mainnet', id: 1},
    {name: 'ropsten', id: 3},
    {name: 'rinkeby', id: 4},
  ]}
];

export class NgxWeb3WalletService {

  protected _provider!: NgxWeb3WalletProviderInterface;
  private _context!: Window;
  public get context(): any {
    return this._context;
  }

  constructor(provider: NgxWeb3WalletProviderInterface, context: Window = window) {
    if (!provider) {
      throw new Error('Web3 is not supported. Not provider provided');
    }
    if (!context) {
      throw new Error('Web3 is not supported. No context provided');
    };
    this._provider = provider;
    this._context = context;
  }

}
