import { CHAIN_NETWORKS, NgxWeb3WalletProviderInterface } from "@ngx-web3/core";
import { ethers } from "ethers";
import { toWei } from "../sdk-web3.utils";

export class EtherumWalletProvider implements NgxWeb3WalletProviderInterface {

  private _walletProvider!: ethers.providers.Web3Provider;
  private _web3Provider!: ethers.providers.ExternalProvider;
  
  constructor(public readonly provider: ethers.providers.ExternalProvider, context?: Window) {
    this._web3Provider = provider;
    this._walletProvider = new ethers.providers.Web3Provider(provider, 'any');
    this._listenEvents(context||window);
  }

  async isConnected(): Promise<boolean> {
    if (!this._walletProvider?.send) {
      return false;
    }
    return this._walletProvider
      .listAccounts()
      .then((res) => res.length > 0 
        ? true 
        : false
      )
      .catch(() => false);
      // .send("eth_accounts", [])
      // .then(() => true)
      // .catch(() => false);
  }

  async connect(): Promise<void> {
    if (await this.isConnected()) {
      return;
    }
    try {
      await this._walletProvider
          ?.send("eth_requestAccounts", [])
          ?.then(() => true)
          ?.catch(() => false);
      console.log('[INFO] Wallet provider connected');
      await this.isConnected();
    } catch (error) {
      throw new Error('Wallet provider not connected');
    }
  }

  async checkNetwork(symbol?: string, chainid?: number): Promise<void> {
    // extract chain object from CHAIN_IDS array object
    const chain = CHAIN_NETWORKS.find(c => c.symbol === symbol);
    if (!chain) {
      throw new Error('Unknown chain network');
    }
    // extract network object from chain object if chainid
    // use ETH mainnet as default if no chainid is provided
    const {id = null} = chain.type.find(n => n.id === chainid) 
      || chain.type.find(n => n.name.includes('mainnet'))
      || {};
    // handle unexisting listed network
    if (!id) {
      throw new Error('Unknown network')
    }    
    // set chainid for transaction object request
    chainid = id;
    // get current network
    const currentChainid = await this.getChainId();

    // check if network is correct
    if (currentChainid !== chainid && this._web3Provider?.request) {
      // try switch network to correct one
      try {    
        await this._web3Provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainid}` }], // chainId must be in hexadecimal numbers
        });
      } catch (error: any) {
        const msg = error.message.includes('Unrecognized chain ID')
          ? `${chain.name.toUpperCase()} network not configured. Please install network and configure your wallet before try again.`
          : error?.message||'Unknown error';
        throw new Error(msg);
      }
        
    }

  }

  async getAccounts(callback?: (error: Error, accounts: string[]) => void): Promise<string[]> {
      return this._walletProvider.listAccounts()
  }

  async getBalance(address: string): Promise<string> {
    const bigNbr = await this._walletProvider.getBalance(address);
    return bigNbr.toString();
  }

  async getChainId(): Promise<number> {
    const  network = await this._walletProvider.getNetwork();
    return network.chainId;
  }

  async sendTransaction<T>(transactionConfig: ethers.utils.Deferrable<ethers.providers.TransactionRequest>, callback?: (error: Error|null, hash: string) => void): Promise<any> {
    if (!transactionConfig.value) {
      throw new Error('No value provided');
    }
    const signer = this._walletProvider.getSigner();
    const tx = await signer.sendTransaction({
      ...transactionConfig,
      value: toWei(transactionConfig.value?.toString(), 'ether'),
    });
    if (callback) {
        callback(null, tx.hash);
    }
    console.log('[INFO] Transaction response:', tx);
    const receipt: ethers.providers.TransactionReceipt = await tx.wait();
    console.log('[INFO] Transaction receipt:', receipt);
    return receipt;
  }

  private _listenEvents(context: Window = window) {
    // Force page refreshes on network changes
    this._walletProvider.on("network", (newNetwork, oldNetwork) => {
      console.log("[INFO] Network changed:", newNetwork, oldNetwork);
      // When a Provider makes its initial connection, it emits a "network"
      // event with a null oldNetwork along with the newNetwork. So, if the
      // oldNetwork exists, it represents a changing network
      // if (oldNetwork) {
      //     context.location.reload();
      // }
    });
  }

}