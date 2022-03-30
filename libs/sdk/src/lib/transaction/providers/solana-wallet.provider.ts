import { CHAIN_NETWORKS, NgxWeb3WalletProviderInterface } from "@ngx-web3/core";
import { PublicKey, Connection, clusterApiUrl, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { fromUSDtoSOL, toLamports } from "../sdk-web3.utils";

type PhantomEvent = "disconnect" | "connect" | "accountChanged";

interface ConnectOpts {
    onlyIfTrusted: boolean;
}

interface PhantomProvider {
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: ()=>Promise<void>;
  request: (e: any)=>Promise<void>;
  on: (event: PhantomEvent, callback: (args:any)=>void) => void;
  signTransaction: (transaction: Transaction) => Promise<void>;
  sendRawTransaction: (raw: Buffer) => Promise<string>;
  isPhantom: boolean;
  isConnected: boolean;
}

export class SolanaWalletProvider implements NgxWeb3WalletProviderInterface {


  private _web3Provider!: PhantomProvider;
  private _walletProvider!: Connection;
  private _publicKey!: PublicKey|undefined;

  constructor(provider: PhantomProvider, context?: Window) {
    const co = new Connection(clusterApiUrl('testnet'));
    this._web3Provider = provider;
    this._walletProvider = co;
    this._listenEvents(context||window);
  }

  async isConnected(): Promise<boolean> {
    if (!this._web3Provider) {
      return false;
    }
    return this._web3Provider.isConnected;
  }

  async connect(): Promise<void> {
    await this._web3Provider.connect();
    await this.isConnected();
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
      throw new Error('Network is not correct. Switching to correct network');
    }    
  }

  async getAccounts(callback?: (error: Error, accounts: string[]) => void): Promise<string[]> {
    const key = this._publicKey;
    if (!key && this._web3Provider && this._web3Provider.isConnected !== true) {
      await this._web3Provider.connect();
    }
    if (!key && !this._web3Provider) {
      throw new Error('No Solana Wallet connection available');
    }
    if (!key) {
      throw new Error('No public key available');
    }
    const account = await this._walletProvider.getAccountInfo(key);
    console.log('[INFO] Solana Wallet account info:', account);
    
    return account ? [account?.owner?.toString()] : [];
  }

  async getBalance(address: string): Promise<string> {
    const bigNbr = await this._walletProvider.getBalance(new PublicKey(address));
    return bigNbr.toString();
  }

  async getChainId(): Promise<number> {
    throw new Error('getChainId() Not implemented');
  }

  async sendTransaction<T>(transactionConfig: any, callback?: (error: Error|null, hash: string) => void): Promise<any> {
    if (!this._publicKey) {
      throw new Error('No public key available');
    }
    const {blockhash: recentBlockhash = undefined} = await this._walletProvider.getRecentBlockhash();
    const tr = new Transaction({
      feePayer: this._publicKey,
      recentBlockhash
    });
    tr.add(
      SystemProgram.transfer({
        fromPubkey: this._publicKey,
        toPubkey: new PublicKey(transactionConfig.destAddr),
        lamports: toLamports(transactionConfig?.value?.toString())
      })
    );
    this._web3Provider.signTransaction(tr);
    const id = await this._walletProvider.sendRawTransaction(tr.serialize());
    console.log(`[INFO] Transaction ID: ${id}`);
    const receipt = await this._walletProvider.confirmTransaction(id);
    console.log(`[INFO] Confirmation slot: ${receipt.context.slot}`);
    console.log('[INFO] Transaction response:', tr);
    console.log('[INFO] Transaction receipt:', receipt);
    return receipt;
  }

  private _listenEvents(context: Window = window) {
    // Force page refreshes on network changes
    this._web3Provider.on("connect", (publicKey: PublicKey) => {
      this._publicKey = publicKey;
      console.log('[INFO] Web3 provider connected:', publicKey.toString());
    });
    this._web3Provider.on("disconnect", (publicKey: PublicKey) => {
      this._publicKey = undefined;
      console.log('[INFO] Web3 provider connected:', publicKey.toString());
    });
  }

}