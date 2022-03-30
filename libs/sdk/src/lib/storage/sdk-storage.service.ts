import { NgxWeb3StorageService, NgxWeb3StorageProviderInterface } from "@ngx-web3/core";
import { NgxWeb3StorageInterface } from "./storage.interface";

export class StorageService extends NgxWeb3StorageService implements NgxWeb3StorageInterface {
  
  constructor(provider: NgxWeb3StorageProviderInterface) {
    super(provider);
  }

  async save(data: File[]) {
    const cid = await this._storeFiles(data);
    return cid
  }

  async find(cid: string) {
    return await this._findFile(cid);
  }

}