import { NgxWeb3StorageProviderInterface } from './core.interface';

export abstract class NgxWeb3StorageService {

  constructor(private readonly _provider: NgxWeb3StorageProviderInterface) {
    this._provider = _provider;
  }

  private _makeFileObjects() {
    // You can create File objects from a Blob of binary data
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
    // Here we're just storing a JSON object, but you can store images,
    // audio, or whatever you want!
    const obj = { hello: 'world' }
    const blob = new Blob([JSON.stringify(obj)], {type : 'application/json'})
  
    const files = [
      new File(['contents-of-file-1'], 'plain-utf8.txt'),
      new File([blob], 'hello.json')
    ]
    return files
  }

  protected  async _storeFiles(files: File[]) {
    
    // normalize file names to remove all special characters and spaces
    files = files.map(f => {
      const name = f.name.replace(/[^a-zA-Z0-9]/g, '_');
      return new File([f], name);
    })

    // rerquest upload with client
    const cid = await this._provider.storeFiles(files);
    console.log('stored files with cid:', cid)
    return cid;
  }

  protected async _findFile(cid: string) {
    const result = await this._provider.findFile(cid);
    return result;
  }
  
}