import { EtherumWalletProvider, WalletService } from '@ngx-web3/sdk';
import { defineCustomElement } from '@ionic/core/components/ion-button';
import { initialize } from "@ionic/core/components";

const ATTR = ['amount', 'to', 'text', 'chainid', 'symbol', 'display-error', 'is-style-disabled'];

export class NgxWeb3UiPaymentButton extends HTMLElement {

  protected _amount = '1';
  protected _text = 'Pay with Metamask';
  protected _symbol = 'ETH';
  protected _chainid?: number;
  protected _to!: string;
  protected _displayAlert!: boolean;
  protected _isStyleDisabled!: boolean;
  private _web3Service!: WalletService;

  public static observedAttributes = ATTR;

  constructor() {
    super();
    defineCustomElement();
    initialize();
    this._initWeb3();
  }
  
  connectedCallback() {
    console.log('[INFO] Appended and connected to document');
    // render the UI only one time on first load
    this.render();
  }

  disconnectedCallback() {
    console.log('[INFO] Disconnected from document');
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
      if (name === 'text' && old !== value) {
        console.log('[INFO] Rendering UI');
        this.render();
      }
    } else {
      console.error('[ERROR] Unknown attribute: ', name);
    }
  }

  render() {
    console.log('[INFO] Rendering UI');
    this.innerHTML = `<ion-button>${this._text}</ion-button>`;
    this._addEvents();
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

  protected async _initWeb3() {
    // check if web3 is already injected and instantiated
    if ((window as any)._nxweb3) {
      this._web3Service = (window as any)._nxweb3;
      return;
    }
    console.log('[INFO] Initializing web3...');
    // choose and init provider
    const provider = new EtherumWalletProvider((window as any).ethereum);
    // init wallet service with provider
    const web3 = new WalletService(provider);
    // save web3 service to window to prevent multiple init
    this._web3Service = web3;
    (window as any)._nxweb3 = web3;
    console.log('[INFO] Web3 initialized');
  }
  
  protected async _requestPayment() {
    const tx = await this._web3Service.requestPayment({
      to: this._to,
      symbol: this._symbol,
      chainId: this._chainid,
      amount:this._amount
    })
    return tx;
  }

}

