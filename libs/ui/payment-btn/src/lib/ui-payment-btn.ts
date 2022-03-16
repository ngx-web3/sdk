import { NgxWeb3WalletProviderInterface } from '@ngx-web3/core';
import { EtherumWalletProvider, SolanaWalletProvider, WalletService, CHAIN_NETWORKS } from '@ngx-web3/sdk';
import { defineCustomElement as defineIonButton} from '@ionic/core/components/ion-button';
import { defineCustomElement as defineIonItem} from '@ionic/core/components/ion-item';
import { defineCustomElement as defineIonLabel} from '@ionic/core/components/ion-label';
import { defineCustomElement as defineIonSkeleton} from '@ionic/core/components/ion-skeleton-text';
import { initialize } from "@ionic/core/components";
import { defineCustomElement as defineIonIcon } from 'ionicons/components/ion-icon';
import { logoBitcoin, closeCircle } from 'ionicons/icons';
import { addIcons } from 'ionicons/components';
import { generateQrCodeBase64 } from './qrcode-utils';
import { ATTR } from './attributes';
import { SVG } from './svg';


export class NgxWeb3UiPaymentButton extends HTMLElement {

  protected _amount!: string;
  protected _text!: string;
  protected _symbol!: string;
  protected _chainid?: number;
  protected _to!: string;
  protected _displayQrCode = true;
  protected _displayError!: boolean;
  protected _isStyleDisabled!: boolean;
  private _web3Service!: WalletService;
  private _selectedCryptoCurrency!: {displayName: string, name: string, symbol: string, type: {name: string, id: number, selected?: boolean}[]};

  public static observedAttributes = ATTR;
  public get buttonText() {
    return this._text || `Pay with ${this._selectedCryptoCurrency.displayName}`;
  }
  public get iconName() {
    return (this._selectedCryptoCurrency?.symbol||'').toLowerCase();
  }

  constructor() {
    super();
    defineIonButton();
    defineIonIcon();
    defineIonSkeleton();
    defineIonItem();
    defineIonLabel();
    addIcons({'logo-sol': SVG.SOL});
    addIcons({'logo-eth': SVG.ETH});
    addIcons({'logo-bnb': SVG.BNB});
    addIcons({'logo-btc': SVG.BTC});
    addIcons({'close-circle': closeCircle});
    addIcons({'logo-bitcoin': logoBitcoin});
    initialize();
  }
  
  connectedCallback() {
    console.log('[INFO] Appended and connected to document');
    this.innerHTML = `
      <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
    `;
  }

  disconnectedCallback() {
    console.log('[INFO] Disconnected from document');
    this.innerHTML = ``;
  }

  attributeChangedCallback(name: string, old: string, value: string) {
    // console.log(`Element's attribute ${name} was ${old} and is now ${value}`);
    // set correct value to the property
    if (ATTR.includes(name)) {
      // enforce type for chainid
      if (name === 'chainid'){
        (this as any)['_' + name] = Number(value);
      } 
      // enforce for display alert
      else if (name === 'display-error') {
        this._displayError = value === 'true'
          ? true
          : false;
      }
      // enforce type for is-style-disabled
      else if (name === 'is-style-disabled') {
        this._isStyleDisabled = true;
      } 
      // enforce type for display-qrcode
      else if (name === 'display-qrcode') {        
        this._displayQrCode = value === 'true'
          ? true
          : false;
      }
      // and for others
      else {
        (this as any)['_' + name] = value;
      }
      // re-render the UI only if symbol, display-qrcode or chainid change
      // init web3 service if not already done 
      // and atribute firstime change name is `symbol`
      if (name === 'symbol' || (name === 'chainid' && this._symbol)) {
        const isChainChange =  !this._web3Service && old === null ? false : true;
        this._initComponent(isChainChange)
            .then((res) =>  (this.render(), this._addStyle()))
            .catch(err => {
              // clean DOM
              this.innerHTML = ``;
              this._handleError(err, true, true);
            });
      }
      if (name === 'amount' && old !== null && this._displayQrCode === true) {
        this._rerenderQrCode();
      }
      if (name === 'to' && old !== null && this._displayQrCode === true) {
        this._rerenderQrCode();
      } 
      if (name === 'display-qrcode' && old !== null) {
        this.render();
      }

    } else {
      console.error('[ERROR] Unknown attribute: ', name);
    }
  }

  protected async _initComponent(force?: boolean): Promise<boolean> {
    // get network data using symbol
    const chain = CHAIN_NETWORKS.find(n => n.symbol === this._symbol);
    if (!chain) {
      throw new Error(`[ERROR] Unknown network chain: ${this._symbol}`);
    }
    // extract network object from chain object if chainid
    // use ETH mainnet as default if no chainid is provided
    const network: {
      name: string;
      id: number;
      selected?: boolean;
    }|undefined = chain.type.find(n => n.id === this._chainid) // find by chainid
      || chain.type.find(n => n.name.includes('mainnet')) // find by mainnet
      || undefined; // use default undefined
    // set selected network if found
    if (network?.name) {
      network.selected = true;
      chain.type = [
        ...chain.type.filter(n => n.id !== network.id),
        network,
      ];
    }
    // set selected crypto currency
    this._selectedCryptoCurrency = chain;
    return await this._initWeb3(force);
  }

  async render() {
    console.log('[INFO] Rendering UI');
    let qrCode = '';
    if (this._displayQrCode) {
      const qrCodeSrc = await generateQrCodeBase64({
        address: this._to, 
        value: this._amount, 
        networkName: this._selectedCryptoCurrency.displayName,
        chainid: this._chainid
      }).catch(err => {
        this._handleError(err, false, true);
      });
      qrCode = (qrCodeSrc)
        ? `<img src="${qrCodeSrc}"/>`
        : `<i>QrCode not available for ${this._symbol}.</i><br/>`;
    }
    let btn = (this._selectedCryptoCurrency)
      ? `<ion-button>
          <ion-icon slot="start" name="logo-${this.iconName}"></ion-icon>
          ${this.buttonText}
        </ion-button>`
      : ``;
    // if no web3 provider is selected. Allow display QrCode with description text only
    if (!this._web3Service) {
      btn = this._text 
        ? `
            <br/>
            <p>
              <ion-icon slot="start" name="logo-${this.iconName}"></ion-icon>
              ${this.buttonText}
            </p>
          `
        : `
          <br/>
          <p>
            <ion-icon slot="start" name="logo-${this.iconName}"></ion-icon>
            ${this.buttonText} by scanning this qrcode with your mobile wallet
          </p>
        `
    }
    // update the UI
    this.innerHTML = `
      <div>${qrCode + btn}</div>
    `;
    if (this._selectedCryptoCurrency) {
      this._addEvents();
    }
    // add style
    this._addStyle();
  }

  protected _addStyle() {
    if (this._isStyleDisabled === true) {
      return;
    }
    // check if style is already added
    if (this.querySelector('#ngxweb3-payment-btn')) {
      return;
    }
    // add style
    const style = document.createElement('style');
    style.id = 'ngxweb3-payment-btn';
    const rules = `
      ion-item {
        --color: #eb445a;
        --background: transparent;
        --padding-start: 0;
      }
      ion-label {
        padding-left: 6px;
      }
      div > img {
        max-width: 80px;
        vertical-align: -webkit-baseline-middle;
        margin-right: 10px;
      }
      p ion-icon {
        vertical-align: -webkit-baseline-middle;
        vertical-align: middle;
        margin-right: 5px;
      }
    `;
    style.innerHTML = rules;
    this.appendChild(style);
  }

  protected _addEvents() {
    const button = this.querySelector('ion-button');
    if (!button) {
      return;
    }
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      // remove error message if any
      this.querySelector('#ngxweb3-error')?.remove();
      // disable btn
      button.setAttribute('disabled', 'true');
      // request service
      const tx = await this._requestPayment().catch(err => this._handleError(err, false, true));
      // enable btn
      button.removeAttribute('disabled');
      // dispatch event with transaction object
      if (tx) {
        this._dispatchEvent('success', {tx});
      }
    });
  }

  protected async _rerenderQrCode() {
    const el = this.querySelector('img');
    if (!el) {
      return;
    }
    console.log('[INFO] Re-rendering QR code');
    // generate new qr code
    const imgUrl = await generateQrCodeBase64({
      address: this._to, 
      value: this._amount, 
      networkName: this._selectedCryptoCurrency.displayName,
      chainid: this._chainid
    });
    if (!imgUrl) {
      return;
    }
    // update qr code
    el.setAttribute('src', imgUrl);
  }

  protected _dispatchEvent(type: string, action: any) {
    const customEvent = new CustomEvent(type, {
      detail: {
        ...action,
      },
    });
    this.dispatchEvent(customEvent);
  }

  protected _renderError(errorMessage: string) {
    let elementHTML = this.querySelector('#ngxweb3-error');
    // if not found, create it
    if (!elementHTML) {
      const ionButton = this.querySelector('ion-button');
      ionButton?.insertAdjacentHTML('afterend', `<div id="ngxweb3-error"></div>`);
      elementHTML = this.querySelector('#ngxweb3-error');
    }
    // display error 
    (elementHTML||this).innerHTML = `
      <ion-item lines="none" color="danger">
      <ion-icon size="small" name="close-circle"></ion-icon>
       <ion-label color="danger">
        <small>${errorMessage}</small>
       </ion-label>
      </ion-item>
    `;
  }

  protected _handleError(err: Error, preventDispatch = false, preventThrow = false) {
    // always display error in console
    console.error(err);
    if (!preventDispatch) {
      this._dispatchEvent('error', {error: err});
    }
    // throw native error if not prevented
    if (!preventThrow) {
      throw err;
    }
    // display native message
    if (this._displayError) {
      this._renderError(err.message);
    }

  }

  protected async _initWeb3(force?: boolean): Promise<boolean> {
    // init web3 service if have exsting browser provider and 
    // if is not already done
    if ((window as any)._nxweb3 && !force) {
      this._web3Service = (window as any)._nxweb3;
      return true;
    }
    console.log('[INFO] Initializing web3 on network: ', this._selectedCryptoCurrency);
    // chose and init provider by checking Symbol attribute
    const provider = await this._getProvider();
    if (!provider) {
      return false;
    }
    // init wallet service with provider
    const web3 = new WalletService(provider);
    // save web3 service to window to prevent multiple init
    this._web3Service = web3;
    (window as any)._nxweb3 = web3;
    console.log('[INFO] Web3 initialized');
    console.log('[INFO] Wallet connected status: ',  await this._web3Service.isConnected());
    return true;
  }
  
  private async _getProvider(): Promise<NgxWeb3WalletProviderInterface|undefined> {
    // get provider from network
    let p: NgxWeb3WalletProviderInterface|undefined = undefined;
    const { ethereum = undefined, solana = undefined } = (window as any);
    
    switch (true) {

      case this._symbol === 'BTC':
        break;
      
      case this._symbol === 'ETH':
      case this._symbol === 'BNB':
        if (!ethereum) {
          this._handleError(new Error(`[ERROR] Ethereum provider not found`), true, true);
          break;
        }
        p = new EtherumWalletProvider((window as any)?.ethereum);
        break;

      case this._symbol === 'SOL':
        if  (!solana) {
          this._handleError(new Error(`[ERROR] Solana provider not found`), true, true);
          break;
        }
        p = new SolanaWalletProvider((window as any)?.solana);
        break;

      default:
        this._handleError(new Error(`[ERROR] Unknown provider`), true, true);
    }    
    return p;
  }

  protected async _requestPayment() {
    const tx = await this._web3Service.requestPayment({
      to: this._to,
      amount: this._amount,
      symbol: this._selectedCryptoCurrency.symbol,
      chainId: this._selectedCryptoCurrency.type.find(n => n.selected)?.id||this._chainid,
    })
    return tx;
  }

}

