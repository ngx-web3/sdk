export abstract class NgxWeb3StorageCore {
  protected abstract _storeFiles(files: File[]): Promise<string>;
  protected abstract _findFile(cid: string): Promise<Partial<File & {
    ipfsPath: string;
  }>[]>;
}

export interface NgxWeb3StorageProviderInterface {

  storeFiles<T>(files: File[], opts?: T): Promise<string>;
  findFile(cid: string): Promise<Partial<File & {ipfsPath: string}>[]>;

}


interface EtherumWeb3Interface {
  isMetaMask?: boolean;
  isStatus?: boolean;
  host?: string;
  path?: string;
  sendAsync?: (request: { method: string, params?: Array<any> }, callback: (error: any, response: any) => void) => void
  send?: (request: { method: string, params?: Array<any> }, callback: (error: any, response: any) => void) => void
  request?: (request: { method: string, params?: Array<any> }) => Promise<any>

}
export interface NgxWeb3ProviderInterface extends EtherumWeb3Interface {
  isWeb3enabled?: boolean;
}

export interface NgxWeb3WalletProviderInterface {

  isConnected(): Promise<boolean>;

  connect(): Promise<void>;

  getChainId(
    callback?: ((error: Error, version: number) => void) | undefined
  ): Promise<number>;
  
  getAccounts(
    callback?: ((error: Error, accounts: string[]) => void) | undefined
  ): Promise<string[]>;

  getBalance(address: string): Promise<string>;

  sendTransaction<T>(
    transactionConfig: T, 
    callback?: ((error: Error|null, hash: string) => void) | undefined
  ): Promise<any>;

  checkNetwork(symbol?: string, chainid?: number): Promise<void>;

}

