
export interface NgxWeb3RequestPayment {

  requestPayment({ to, symbol, chainId, amount }: {
    to: string;
    symbol: string;
    amount: string;
    chainId?: number;
  }): Promise<any>;

}
