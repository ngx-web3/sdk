import { StorageService, Web3StorageProvider} from '@ngx-web3/sdk';
import { defineCustomElement as defineIonSpinner } from '@ionic/core/components/ion-spinner';
import { initialize as initIonicUIElements } from '@ionic/core';
import { NgxWeb3File } from '@ngx-web3/core';

export class NgxWeb3UiUploadButton extends HTMLElement {

  public token!: string;
  public static observedAttributes = ['token'];

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
        const provider = new Web3StorageProvider(this.token||'');
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
}
