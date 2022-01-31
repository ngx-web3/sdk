
export interface NgxWeb3CoreInterface {

  _getChainId(
    callback?: ((error: Error, version: number) => void) | undefined
  ): Promise<number>;
  
  _getAccounts(
    callback?: ((error: Error, accounts: string[]) => void) | undefined
  ): Promise<string[]>;

  _getBalance(address: string): Promise<string>;

  _sendTransaction<T>(
    transactionConfig: T, 
    callback?: ((error: Error|null, hash: string) => void) | undefined
  ): Promise<any>;

  _checkNetwork(symbol?: string, chainid?: number): Promise<void>;

}
