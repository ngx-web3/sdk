import { Web3Storage } from 'web3.storage';
import { NgxWeb3File, NgxWeb3StorageProviderInterface } from '@ngx-web3/core';

/**
 * @deprecated 
 * Use `Web3Storage` instead
 * 
 * @param {string} token 
 */
const apiService = (token: string) => ({
  get: async (cid: string): Promise<Response> => {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    const res = await fetch(`https://api.web3.storage/car/${cid}`, { headers });
    return res
  },
  put: async (files: File[], opts?: any) => {
    // multiple files, as FormData with Content-Disposition headers for each part to specify filenames and the request header Content-Type: multipart/form-data
    // You can also provide a name for the file using the header X-NAME, but be sure to encode the filename first. For example LICENSE–MIT should be sent as LICENSE%E2%80%93MIT.
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    headers.append('x-name', files[0].name);
    const formData = new FormData();
    for (const file of files) {
      const blob = new Blob([file], { type: file.type });
      formData.append(file.name, blob, file.name);
    }
    const res = await fetch(`https://api.web3.storage/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
    return await res.json();
  }
});

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

  async findFile(cid: string): Promise<NgxWeb3File[]> {
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
    const ngxWeb3File: NgxWeb3File[] = [];
    const files = await res.files();
    for (const file of files) {
      // console.log(`${file.cid} -- ${file.webkitRelativePath} -- ${file.size}`);
      // add custom properties to the File object
      (file as any).ipfsFileCidPath = `https://ipfs.io/ipfs/${file.cid}`;
      (file as any).ipfsFileNamePath = `https://ipfs.io/ipfs/${cid}/${file.name}`;
      ngxWeb3File.push(file as any);
    }
    return ngxWeb3File;
  }

}