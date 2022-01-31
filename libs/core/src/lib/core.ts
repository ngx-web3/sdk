
import { ethers } from "ethers";
import { NgxWeb3CoreInterface } from "./core.interface";

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


export class NgxWeb3CoreService implements NgxWeb3CoreInterface {

  protected _provider!: ethers.providers.Web3Provider;

  constructor(eth: ethers.providers.ExternalProvider, context: Window = window) {
    // set Web3 provider
    this._provider = new ethers.providers.Web3Provider(eth);
    // Force page refreshes on network changes
    this._provider.on("network", (newNetwork, oldNetwork) => {
      // When a Provider makes its initial connection, it emits a "network"
      // event with a null oldNetwork along with the newNetwork. So, if the
      // oldNetwork exists, it represents a changing network
      if (oldNetwork) {
          context.location.reload();
      }
  });
  }

  _getAccounts(callback?: (error: Error, accounts: string[]) => void): Promise<string[]> {
      return this._provider.listAccounts()
  }

  async _getBalance(address: string): Promise<string> {
    const bigNbr = await this._provider.getBalance(address);
    return bigNbr.toString();
  }

  async _getChainId(): Promise<number> {
      const  network = await this._provider.getNetwork();
      return network.chainId;
  }

  async _sendTransaction<T>(transactionConfig: T, callback?: (error: Error|null, hash: string) => void): Promise<any> {
    const signer = this._provider.getSigner();
    const tx = await signer.sendTransaction(transactionConfig);
    if (callback) {
        callback(null, tx.hash);
    }
    console.log('[INFO] Transaction response:', tx);
    const receipt = await tx.wait();
    console.log('[INFO] Transaction receipt:', receipt);
    return receipt;
  }

  async _checkNetwork(symbol: string, chainid?: number): Promise<void> {
    // extract chain object from CHAIN_IDS array object
    const chain = CHAIN_NETWORKS.find(c => c.symbol === symbol);
    if (!chain) {
      throw new Error('Unknown chain network');
    }
    // extract network object from chain object if chainid
    // use ETH mainnet as default if no chainid is provided
    const {id = null} = chain.type.find(n => n.id === chainid) 
      || chain.type.find(n => n.name === 'mainnet')
      ||{};
    // handle unexisting listed network
    if (!id) {
      throw new Error('Unknown network')
    }    
    // set chainid for transaction object request
    chainid = id;
    // get current network
    const currentChainid = await this._getChainId();
    // check if network is correct
    if (currentChainid !== chainid) {
      // switch network to correct one
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainid}` }], // chainId must be in hexadecimal numbers
      });
    }
  }

}
