import { NgxWeb3File, NgxWeb3StorageProviderInterface } from '@ngx-web3/core';
import { StorageService, StorjStorageProvider, Web3StorageProvider} from '@ngx-web3/sdk';
import { defineCustomElement as defineIonSpinner } from '@ionic/core/components/ion-spinner';
import { initialize as initIonicUIElements } from '@ionic/core';

const STORAGE_PROVIDER_TYPE = ['filcoin', 'ipfs', 'storj'];
export class NgxWeb3UiUploadButton extends HTMLElement {

  public token!: string;
  public providerType!:  'filcoin' | 'ipfs' | 'storj' | string;
  // optionnal attributes
  public bucket?: string;
  public accesskey?: string;
  public secretkey?: string;
  public endpoint?: string;

  // static observed Attributes  
  public static observedAttributes = ['token', 'provider', 'bucket', 'accesskey', 'secretkey', 'endpoint'];

  constructor() {
      super();
      defineIonSpinner();
      initIonicUIElements();
      this.attachShadow({ mode: 'open' });
      if (!this.shadowRoot) {
        return;
      }
      this.render();
      this.addEvents();      
  }
  
  connectedCallback() {
    console.log('[INFO] Appended and connected to document');
  }

  disconnectedCallback() {
    console.log('[INFO] Disconnected from document');
    this.innerHTML = ``;
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = ``;
    }
  }

  attributeChangedCallback(name: string, old: string, value: string) {
    // console.log(`Element's attribute ${name} was ${old} and is now ${value}`);
    // set correct value to the property
    if (name === 'token') {
      this.token = value;
    }
    if (name === 'provider' && STORAGE_PROVIDER_TYPE.includes(value) ) {
      this.providerType = value
    }
    if (name === 'bucket') {
      this.bucket = value;
    }
    if (name === 'accesskey') {
      this.accesskey = value;
    }
    if (name === 'secretkey') {
      this.secretkey = value;
    }
    if (name === 'endpoint') {
      this.endpoint = value;
    }
  }

  render() {
    if (!this.shadowRoot) {
      return;
    }
    this.shadowRoot.innerHTML = `
      <style>
          :host {
              display: inline;
              position: relative;
              width: 100%;
              height: 100%;
              overflow: hidden;
  
          }
          button {
              position: relative;
              display: inline;
              cursor: pointer;
              z-index: 1;
              min-height: 18px;
          }
          #ngxweb3-result-cid {
            display: none;
          }
          ion-spinner {
            width: 14px;
            height: 14px;
            vertical-align: middle;
            display: none;
          }
      </style> 
      <button part="btn">
          <slot>default</slot>
      </button>
      <ion-spinner></ion-spinner>
      <p part="ngxweb3-result-cid" id="ngxweb3-result-cid"></p>
      <input type="file" accept="image/*" style="display: none;" />
    `;
  }

  addEvents() {
    if (!this.shadowRoot) {
      return;
    }
    this.shadowRoot.querySelector('button')?.addEventListener('click', () => {
      // clean result zone
      const el = this.shadowRoot?.querySelector('#ngxweb3-result-cid') as any;
      if (el) {
        el.innerHTML = '';
        el.style.display = 'none';
      }
      // trigger input click
      this.shadowRoot?.querySelector('input')?.click();
    });
    this.shadowRoot?.querySelector('input')?.addEventListener('change', async (e) => {
      const btn = this.shadowRoot?.querySelector('button');
      const files = (e?.target as any)?.files;
      // only if have files
      if (files && files.length > 0) {
        const spinner = this.shadowRoot?.querySelector('ion-spinner');
        console.log('spinner', spinner);
        // ui management
        if (spinner) {
          spinner.style.display = 'inline-block';
        }
        if (btn) {
          btn.disabled = true;
        }
        // init service
        const provider = await this._getStorageProvider();
        const storage = new StorageService(provider);
        // upload files
        const cid = await storage.save(Array.from(files));
        // find storage URL using cid
        const storedFiles = await storage.find(cid);
        // display result storage files
        await this.displayResult(storedFiles);
        // ui management
        if (spinner) {
          spinner.style.display = 'none';
        }
        if (btn) {
          btn.disabled = false;
        }
        // dispatch event
        this.dispatchEvent(new CustomEvent('upload', { detail: cid }));
      }
    })
  }

  async displayResult(files: NgxWeb3File[]) {
    const el = this.shadowRoot?.querySelector('#ngxweb3-result-cid') as any;
    if (el) {
      el.innerHTML = files.map(f => `<a href="${f.ipfsFileNamePath}">${f.ipfsFileNamePath}</a>`).join('<br>');
      el.style.display = 'block';
    }
  }

  private async _getStorageProvider(): Promise<NgxWeb3StorageProviderInterface> {
    if (!this.providerType) {
      throw new Error('[ERROR] provider type is not defined');
    }
    switch (this.providerType) {
      case 'filcoin':
        if (!this.token) {
          throw new Error('[ERROR] Missing token attribute');
        }
        return new Web3StorageProvider(this.token||'');
      case 'storj':
        if (!this.bucket || !this.accesskey || !this.secretkey || !this.endpoint) {
          console.log(this.bucket, this.accesskey, this.secretkey, this.endpoint);
          
          throw new Error('[ERROR] Missing bucket, accessKeyId, secretAccessKey or endpoint attributes');
        }
        return new StorjStorageProvider({
          bucket: this.bucket,
          accessKeyId: this.accesskey,
          secretAccessKey: this.secretkey,
          endpoint: this.endpoint,
        });
      default:
        throw new Error('[ERROR] provider type is not supported');
    }
  }
}
