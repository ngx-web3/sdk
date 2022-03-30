import { CHAIN_NETWORKS, NgxWeb3WalletProviderInterface } from "@ngx-web3/core";
import { WsProvider, ApiPromise, Keyring } from "@polkadot/api";


export class PolkadotWalletProvider implements NgxWeb3WalletProviderInterface {

  private _walletProvider!: ApiPromise;
  private _web3Provider!: WsProvider;
  
  constructor(public readonly providerAdrerss: string, context?: Window) {
    this._web3Provider = new WsProvider('wss://rpc.polkadot.io');
    ApiPromise
      .create({ provider: this._web3Provider })
      .then(async(api) => {
        // Wait until we are ready and connected
        await api.isReady;
        this._walletProvider = api;
        this._listenEvents(context);
      });
  }

  async isConnected(): Promise<boolean> {
    if (!this._walletProvider?.isConnected) {
      return false;
    }
    return this._walletProvider.isConnected;
  }

  async connect(): Promise<void> {
    if (await this.isConnected()) {
      return;
    }
    try {
      await this._walletProvider.connect();
      console.log('[INFO] Wallet provider connected');
      await this.isConnected();
    } catch (error) {
      throw new Error('Wallet provider not connected');
    }
  }

  async checkNetwork(symbol?: string, chainid?: number): Promise<void> {
    // throw new Error('Method not implemented.');

  }

  async getAccounts(callback?: (error: Error, accounts: string[]) => void): Promise<string[]> {
    // TODO: Method to implement
    return [];
  }

  async getBalance(address: string): Promise<string> {
    const { nonce, data: balance } = await this._walletProvider.query['system']['account'](address) as any;
    return balance?.free;
  }

  async getChainId(): Promise<number> {
    // TODO: check rersult
    const  network = await this._walletProvider.rpc['system']['chain']();
    const chain = CHAIN_NETWORKS.find(c => c.name.toLocaleLowerCase() === network.toString().toLocaleLowerCase());
    return chain?.type[0].id || 0;
  }

  async sendTransaction<T>(transactionConfig: any, callback?: (error: Error|null, hash: string) => void): Promise<any> {
    if (!transactionConfig.value) {
      throw new Error('No value provided');
    }
    const keyring = new Keyring({ type: 'sr25519' });
    const from = keyring.addFromUri(transactionConfig?.from)
    const to =  keyring.addFromUri(transactionConfig?.to)
    // Sign and send a transfer from Alice to Bob
    const tx = await this._walletProvider
      .tx['balances']['transfer'](to, transactionConfig?.value)
      .signAndSend(from);
    if (callback) {
        callback(null, tx.hash.toString());
    }
    return tx;
  }

  private _listenEvents(context: Window = window) {
    // Force page refreshes on network changes
    this._walletProvider.on("disconnected", (args) => {
      console.log('[INFO] Wallet provider disconnected:', args);
    });
  }

}