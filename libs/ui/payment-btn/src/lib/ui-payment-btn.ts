import { NgxWeb3Service } from '@ngx-web3/sdk';

const ATTR = ['amount', 'to', 'text', 'chainid', 'symbol', 'display-error'];

export class NgxWeb3UiPaymentButton extends HTMLElement {

  protected _amount = '1';
  protected _text = 'Pay with Metamask';
  protected _symbol = 'ETH';
  protected _chainid?: number;
  protected _to!: string;
  protected _displayAlert!: boolean;
  private _web3Service!: NgxWeb3Service;

  public static observedAttributes = ATTR;

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this._addStyle();
    this.render();
    this._initWeb3();
  }
  
  connectedCallback() {
    console.log('[INFO] Appended and connected to document');
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
      // and for others
      else {
        (this as any)['_' + name] = value;
      }
      // re-render the UI
      this.render();
    } else {
      console.error('[ERROR] Unknown attribute: ', name);
    }
  }

  render() {
    if (!this.shadowRoot) {
      return;
    }
    // update the UI
    this.shadowRoot.innerHTML = `
      <button>${this._text}</button>
    `;
    this._addEvents();
  }

  protected _addEvents() {
    if (!this.shadowRoot) {
      return;
    }
    const button = this.shadowRoot.querySelector('button');
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

  protected _addStyle() {
    if (!this.shadowRoot) {
      return;
    }
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        position: inline-block;
      }
    `;
    this.shadowRoot.appendChild(style);
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
    if (!(window as any).ethereum) {
      this._dispatchEvent('error', {error: new Error('Ethereum is not supported')});
      this._handleError(Error('Ethereum is not supported'), false, true);
    }
    if ((window as any)._nxweb3) {
      this._web3Service = (window as any)._nxweb3;
      return;
    }
    console.log('[INFO] Initializing web3...');
    const web3 = new NgxWeb3Service((window as any).ethereum);
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

