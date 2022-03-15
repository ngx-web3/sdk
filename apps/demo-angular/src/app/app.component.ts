import { Component } from '@angular/core';
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
  symbol = 'BTC';

  async storeFile(input: HTMLInputElement) {
    const provider = new Web3StorageProvider(environment.web3Storage.token);
    const web3Storage = new StorageService(provider);
    // convert FileList to FileArray
    const files = Array.from(input.files||[]);
    const result = await web3Storage.save(files);
    console.log('stored files with cid:', result)
  }

  async findFile(value: string) {
    const provider = new Web3StorageProvider(environment.web3Storage.token);
    const web3Storage = new StorageService(provider);
    const result = await web3Storage.find(value);
    console.log('found files with cid:', result)
  }

}
