import { NgxWeb3File } from "@ngx-web3/core";

export interface NgxWeb3StorageInterface {

  save(data?: File[] | undefined): Promise<string>;
  find(cid: string): Promise<NgxWeb3File[]>;

}
