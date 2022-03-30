import { NgxWeb3File } from "@ngx-web3/core";

export interface NgxWeb3RequestPayment {

  requestPayment({ to, symbol, chainId, amount }: {
    to: string;
    symbol: string;
    amount: string;
    chainId?: number;
  }): Promise<any>;

}

export interface NgxWeb3StorageInterface {

  save(data?: File[] | undefined): Promise<string>;
  find(cid: string): Promise<NgxWeb3File[]>;

}
