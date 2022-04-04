import { NgxWeb3File, NgxWeb3StorageProviderInterface } from '@ngx-web3/core';
import { create } from 'ipfs-http-client';


export class IpfsStorageProvider implements NgxWeb3StorageProviderInterface {

  constructor() {
    console.warn('[WARN] IpfsStorageProvider is not implemented yet. Please use another storage provider.');
  }

  async findFile(cid: string): Promise<NgxWeb3File[]> {
      return [];
  }

  async storeFiles(files: File[], opts?: any): Promise<string> {
    const ipfs = create();
    const filesToStore = files.map(file => ({
      path: file.name,
      content: file
    }));
    const result = [];
    for await (const file of ipfs.addAll(filesToStore)) {
      result.push(file);
    }
    return result[0].cid.toString();
  }
}
