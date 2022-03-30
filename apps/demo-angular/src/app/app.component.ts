import { Component } from '@angular/core';
import { NgxWeb3File } from '@ngx-web3/core';
import { StorageService, Web3StorageProvider } from '@ngx-web3/sdk';
import { environment } from '../environments/environment';

@Component({
  selector: 'ngx-web3-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'demo-angular';
  amount = 250;
  symbol = 'BNB';
  displayQrCode = true;
  storageResult!: string;
  findResult!: NgxWeb3File[];
  web3StorageToken = environment.web3Storage.token;

  async storeFile(input: HTMLInputElement) {
    // init selected storage provider
    const provider = new Web3StorageProvider(environment.web3Storage.token);
    // init storage service with the provider
    const web3Storage = new StorageService(provider);
    // convert FileList to FileArray
    const files = Array.from(input.files||[]);
    // request save() with the FileArray
    const result = await web3Storage.save(files);
    console.log('stored files with cid:', result)
    // assign the result to the component property
    this.storageResult = result;
  }

  async findFile(el: HTMLInputElement) {
    // get the cid from the input
    const value = el.value;
    // init selected storage provider
    const provider = new Web3StorageProvider(environment.web3Storage.token);
    // init storage service with the provider
    const web3Storage = new StorageService(provider);
    // clean input value (ux)
    el.value = '';
    // request find() with the cid
    const result = await web3Storage.find(value);
    console.log('found files with cid:', result);
    // assign the result to the component property
    this.findResult = result;
  }

}
