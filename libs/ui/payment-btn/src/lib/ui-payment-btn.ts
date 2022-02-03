import { EtherumWalletProvider, SolanaWalletProvider, WalletService, CHAIN_NETWORKS } from '@ngx-web3/sdk';
import { defineCustomElement as defineIonButton} from '@ionic/core/components/ion-button';
import { defineCustomElement as defineIonSkeleton} from '@ionic/core/components/ion-skeleton-text';
import { defineCustomElement as defineIonIcon } from 'ionicons/components/ion-icon';
import { logoBitcoin } from 'ionicons/icons';
import { addIcons } from 'ionicons/components';
import { initialize } from "@ionic/core/components";
import { NgxWeb3WalletProviderInterface } from '@ngx-web3/core';
// here import svg from noode_modules/cryptocurrency-icons/svg/white/bnb.svg

const SVG = {
  SOL: `./assets/payment-btn/sol.svg`,
  ETH: `./assets/payment-btn/eth.svg`,
  BNB: `./assets/payment-btn/bnb.svg`
}

const ATTR = ['amount', 'to', 'text', 'chainid', 'symbol', 'display-error', 'is-style-disabled'];

export class NgxWeb3UiPaymentButton extends HTMLElement {

  protected _amount!: string;
  protected _text!: string;
  protected _symbol!: string;
  protected _chainid?: number;
  protected _to!: string;
  protected _displayAlert!: boolean;
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
    addIcons({'logo-sol': SVG.SOL});
    addIcons({'logo-eth': SVG.ETH});
    addIcons({'logo-bnb': SVG.BNB});
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
        this._displayAlert = true;
      } 
      // enforce type for is-style-disabled
      else if (name === 'is-style-disabled') {
        this._isStyleDisabled = true;
      } 
      // and for others
      else {
        (this as any)['_' + name] = value;
      }
      // re-render the UI only if text change
      // init web3 service if not already done 
      // and atribute firstime change name is `symbol`
      if (!this._web3Service && name === 'symbol' && old === null) {
        this._initComponent()
            .then(() => this.render())
            .catch(err => {
              this._handleError(err, true, true);
              // clean DOM
              this.innerHTML = ``;
            });
      }      
    } else {
      console.error('[ERROR] Unknown attribute: ', name);
    }
  }

  protected async _initComponent(): Promise<void> {
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
    await this._initWeb3();
  }

  render() {
    console.log('[INFO] Rendering UI');
    const html = (this._selectedCryptoCurrency)
      ? `<ion-button>
          <ion-icon slot="start" name="logo-${this.iconName}"></ion-icon>
          ${this.buttonText}
        </ion-button>`
      : ``;
    // update the UI
    this.innerHTML = html;
    if (this._selectedCryptoCurrency) {
      this._addEvents();
    }
  }

  protected _addEvents() {
    const button = this.querySelector('ion-button');
    if (!button) {
      return;
    }
    button.addEventListener('click', async (e) => {
      e.preventDefault();
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

  protected _dispatchEvent(type: string, action: any) {
    const customEvent = new CustomEvent(type, {
      detail: {
        ...action,
      },
    });
    this.dispatchEvent(customEvent);
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
    // display native alert
    if (this._displayAlert) {
      alert(err.message);
    }

  }

  protected async _initWeb3(): Promise<void> {
    // init web3 service if have exsting browser provider and 
    // if is not already done
    if ((window as any)._nxweb3) {
      this._web3Service = (window as any)._nxweb3;
      return;
    }
    console.log('[INFO] Initializing web3 on network: ', this._selectedCryptoCurrency);
    // chose and init provider by checking Symbol attribute
    const provider = await this._getProvider();
    if (!provider) {
      return;
    }
    // init wallet service with provider
    const web3 = new WalletService(provider);
    // save web3 service to window to prevent multiple init
    this._web3Service = web3;
    (window as any)._nxweb3 = web3;
    console.log('[INFO] Web3 initialized');
    console.log('[INFO] Wallet connected status: ',  await this._web3Service.isConnected());
  }
  
  private async _getProvider(): Promise<NgxWeb3WalletProviderInterface> {
    // get provider from network
    let p: NgxWeb3WalletProviderInterface|undefined = undefined;
    
    switch (true) {

      case this._symbol === 'ETH':
      case this._symbol === 'BNB':
        p = new EtherumWalletProvider((window as any)?.ethereum);
        break;

      case this._symbol === 'SOL':
        p = new SolanaWalletProvider((window as any)?.solana);
        break;
    }
    if (!p) {
      throw new Error(`[ERROR] No Web3 provider available. Unknown currency symbol: ${this._symbol}`);
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

