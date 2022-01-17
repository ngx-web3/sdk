import Web3 from 'web3';

export const ATTR = ['amount', 'to', 'text', 'chainid', 'symbol', 'display-error'];
export const CHAIN_NETWORKS = [
  {name: 'bsc', symbol: 'BNB', type: [
    {name: 'mainnet', id: 38},
    {name: 'testnet', id: 61},
  ]},
  {name: 'eth', symbol: 'ETH', type: [
    {name: 'mainnet', id: 1},
    {name: 'ropsten', id: 3},
    {name: 'rinkeby', id: 4},
  ]}
];

export class NgxWeb3UiPaymentButton extends HTMLElement {

  protected _amount = '1';
  protected _text = 'Pay with Metamask';
  protected _symbol = 'ETH';
  protected _chainid?: number;
  protected _to!: string;
  protected _displayAlert!: boolean;
  private _web3!: Web3;
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
    button.addEventListener('click', (e) => {
      e.preventDefault();
      this._requestPayment().catch(err => this._handleError(err, false, true));
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
      this._web3 = (window as any)._nxweb3;
      return;
    }
    console.log('[INFO] Initializing web3...');
    const web3 = new Web3();
    web3.setProvider((window as any).ethereum);
    this._web3 = web3;
    (window as any)._nxweb3 = web3;
    console.log('[INFO] Web3 initialized');
  }

  protected async _checkNetwork(): Promise<void> {
    // extract chain object from CHAIN_IDS array object $
    const chain = CHAIN_NETWORKS.find(c => c.symbol === this._symbol);
    if (!chain) {
      this._handleError(new Error('Unknown chain network'), false, true);
      return;
    }
    // extract network object from chain object if chainid
    // use ETH mainnet as default if no chainid is provided
    const {id = null} = chain.type.find(n => n.id === this._chainid) 
      || chain.type.find(n => n.name === 'mainnet')
      ||{};
    // handle unexisting listed network
    if (!id) {
      this._handleError(new Error('Unknown network'), false, true);
      return;
    }    
    // set chainid for transaction object request
    this._chainid = id;
    // get current network
    const chainid = await this._web3.eth.getChainId();
    // check if network is correct
    if (chainid !== this._chainid) {
      // switch network to correct one
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${this._chainid}` }], // chainId must be in hexadecimal numbers
      });
    }
  }

  protected async _requestPayment() {
    console.log('[INFO] Making payment...');
    if (!this._to) {
      alert('No payment destination address provided');
      this._handleError(new Error('No payment destination address provided'), false, true);
      return;
    }
    if (!this._web3) {
      this._handleError(new Error('Web3 is not initialized'), false, true);
      return;
    }
    // switch correct network
    const error: Error = await this._checkNetwork().catch(err => err);
    if (error) {
      this._handleError(error, false, true);
      return;
    }
    // check if user is logged in to MetaMask
    const accounts =  await this._web3.eth.getAccounts();
    if (!accounts || !accounts.length) {
      this._handleError(new Error('User is not logged in to MetaMask'), false, true);
      return;
    }
    // check if same from and destination address
    if (accounts[0] === this._to) {
      this._handleError(new Error('Payment address must be different to destination address'));
      return;
    }
    // check if user has enough funds
    const balance = await this._web3.eth.getBalance(accounts[0]);
    if (balance && parseFloat(balance) < parseFloat(this._amount)) {
      this._handleError(new Error('User does not have enough funds'), false, true);
      return;
    }
    // send the payment transaction
    const tx = await this._web3.eth.sendTransaction({
      from: accounts[0],
      to: this._to,
      value: this._web3.utils.toWei(this._amount, 'ether'),
      chainId: this._chainid
    });
    // show transaction hash
    console.log('Transaction sent: ', tx);
    return tx;
  }

}

