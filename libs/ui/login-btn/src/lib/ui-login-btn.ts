import { EtherumWalletProvider, WalletService } from '@ngx-web3/sdk';
import { defineCustomElement as defineIonModal } from '@ionic/core/components/ion-modal';
import { initialize as initIonicComponents } from "@ionic/core/components";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { CLIENT_EVENTS } from "@walletconnect/client";
import { PairingTypes, SessionTypes } from "@walletconnect/types";


export class NgxWeb3UiLoginButton extends HTMLElement {

  public projectid!: string;
  public relayurl!: string;

  private _client!: {
    connect: (options: any) => Promise<any>;
    disconnect: (options: any) => Promise<void>;
  }
  private readonly _template: string = `
    <style>
    :host, :host *, :host *::before, :host *::after {
      box-sizing: border-box;
    }
    :host {
      display: block;
      position: relative;
    }
    </style>
    <button>Connect</button>
  `;
  public static observedAttributes = ['projectid', 'relayurl'];

  constructor() {
    super();
    defineIonModal();
    initIonicComponents();
    this.attachShadow({ mode: 'open' });
    if (!this.shadowRoot) {
      throw new Error('Shadow DOM not supported');
    }
  }
  
  connectedCallback() {
    if (!this.shadowRoot) {
      return;
    }
    // check if allready have an styleing element in the DOM
    const styleElement = document.querySelector('#ngxweb3-login-modal-wrapper-style');
    if (!styleElement) {
      document.body.insertAdjacentHTML('afterbegin', `
        <style id="ngxweb3-login-modal-wrapper-style">
        .ngxweb3-login-modal-wrapper {
          --height: auto;
        }
        </style>
      `);
    }
    this.shadowRoot.innerHTML = this._template;
    this.shadowRoot.querySelector('button')?.addEventListener('click', ($event) => this.onClick($event));
    this._presentModal();
  }

  attributeChangedCallback(name: string, old: string, value: string) {
    // console.log(`Element's attribute ${name} was ${old} and is now ${value}`);
    // set correct value to the property
    if (name === 'projectid') {
      this.projectid = value;
    }
    if (name === 'relayurl') {
      this.relayurl = value;
    }
  }

  onClick($event: MouseEvent) {
    console.log('[INFO] Login button clicked');
    if (this._client) {
      this._client.disconnect({
        topic: "walletconnect",
        reason: {
          code: 1,
          message: 'string'
        },
      });
      this.dispatchEvent(new CustomEvent('click', {
        detail: {
          message: 'Logout button clicked'
        }
      }));
    } else {
      this._presentModal()
      this.dispatchEvent(new CustomEvent('click', {
        detail: {
          message: 'Login button clicked'
        }
      }));
    }
  }

  private async _presentModal() {
    if (!this.shadowRoot) {
      return;
    }
    // create the modal with the `modal-page` component
    const modalElement = document.createElement('ion-modal');
    modalElement.component = 'ngxweb3-login-modal';
    modalElement.cssClass = 'ngxweb3-login-modal-wrapper';
    // present the modal
    this.shadowRoot.appendChild(modalElement);
    modalElement.present();
    const { data } = await modalElement.onWillDismiss();
    let isConnected = false;
    if (data === 'walletconnect') {
      isConnected= await this._walletConnectConnect();
    }
    if (data === 'metamask') {
      isConnected = await this._metamaskConnect();
    }
    console.log('[INFO] isConnected ', isConnected);
    
  }

  private async _walletConnectConnect() {
    const client = await WalletConnect.init({
      projectId: this.projectid || '',
      relayUrl: this.relayurl || "wss://relay.walletconnect.com",
      // metadata: {
      //   name: "Example Dapp",
      //   description: "Example Dapp",
      //   url: "#",
      //   icons: ["https://walletconnect.com/walletconnect-logo.png"],
      // },
    });
    client.on(
      CLIENT_EVENTS.pairing.proposal,
      async (proposal: PairingTypes.Proposal) => {
        // uri should be shared with the Wallet either through QR Code scanning or mobile deep linking
        // Display the QRCode modal on a new pairing request.
        const { uri } = proposal.signal.params;
        console.log("EVENT", "QR Code Modal opened");
    
        QRCodeModal.open(uri, () => {
          console.log("EVENT", "QR Code Modal closed");
        });
      }
    );
    // detect user connected and display the address
    client.on(
      CLIENT_EVENTS.session.created,
      async (session: SessionTypes.Created) => {
        console.log("EVENT", "Session created");
        console.log("EVENT", session);
      }
    );
       
    const session = await client.connect({
      permissions: {
        blockchain: {
          chains: [
            "eip155:1",
            "eip155:2",
            "eip155:3",
            "eip155:4",
          ],
        },
        jsonrpc: {
          methods: [
            "eth_sendTransaction", 
            "personal_sign", 
            "eth_signTypedData",
            "eth_sign",
            "eth_signTransaction"
          ],
        },
      },
    });
    this._client = client;
    console.log("EVENT", "Connected to WalletConnect", session);
    return Boolean(session.state.accounts.length);
  }

  private async _metamaskConnect() {
    const provider = new EtherumWalletProvider((window as any)?.ethereum);
    const walletService = new WalletService(provider);
    await walletService.connect();
    console.log('[INFO] Metamask connected ', await walletService.isConnected());
    // get connect btn and disable it
    const connectBtn = this.shadowRoot?.querySelector('button');
    if (connectBtn) {
      connectBtn.disabled = true;
    }
    return await walletService.isConnected()
  }

}
