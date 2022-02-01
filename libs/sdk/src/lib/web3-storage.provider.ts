import { Web3Storage } from 'web3.storage';
import { NgxWeb3StorageProviderInterface } from '@ngx-web3/core';

export class Web3StorageProvider implements NgxWeb3StorageProviderInterface {

  private _service!: Web3Storage;

  constructor(token: string) {
    this._service = new Web3Storage({token});
  }

  async storeFiles(files: File[], opts?: any) {

    // show the root cid as soon as it's ready
    const onRootCidReady = (cid: any) => {
      console.log('uploading files with cid:', cid)
    }

    // when each chunk is stored, update the percentage complete and display
    const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
    let uploaded = 0

    const onStoredChunk = (size: number) => {
      uploaded += size
      const pct = totalSize / uploaded
      console.log(`Uploading... ${pct.toFixed(2)}% complete`)
    }

    return this._service.put(
      files,
      {
        onRootCidReady, 
        onStoredChunk, 
        wrapWithDirectory: true,
        maxRetries: 3,
        ...opts
      }
    );
  }

  async findFile(cid: string): Promise<Partial<File & {ipfsPath: string}>[]> {
    const res = await this._service.get(cid);
    if (!res) {
      throw new Error('File not found')
    }
    // console.log(`Got a response! [${res.status}] ${res.statusText}`)
    if (!res.ok) {
      throw new Error(`failed to get ${cid}`)
    }
    // request succeeded! 
    // unpack File objects from the response
    const files = await res.files();
    for (const file of files) {
      // console.log(`${file.cid} -- ${file.webkitRelativePath} -- ${file.size}`);
      // add custom properties to the File object
      (file as any).ipfsPath = `https://ipfs.io/ipfs/${cid}/${file.name}`;
      (file as any).ipfsFilePath = `https://ipfs.io/ipfs/${file.cid}`;
    }
    return files;
  }

}