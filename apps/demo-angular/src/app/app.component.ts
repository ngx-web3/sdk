import { Component, OnInit } from '@angular/core';
import { NgxWeb3File } from '@ngx-web3/core';
import { StorageService, Web3StorageProvider, StorjStorageProvider } from '@ngx-web3/sdk';
import { environment } from '../environments/environment';
// import WalletConnect from "@walletconnect/client";
// import QRCodeModal from "@walletconnect/qrcode-modal";
// import { CLIENT_EVENTS } from "@walletconnect/client";
// import { PairingTypes } from "@walletconnect/types";
// import { ethers } from "ethers";
// import Web3Modal from "web3modal";  
// import WalletConnectProvider from "@walletconnect/web3-provider";


@Component({
  selector: 'ngx-web3-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'demo-angular';
  amount = 250;
  symbol = 'BNB';
  displayQrCode = !true;
  storageResult!: string;
  findResult!: NgxWeb3File[];
  web3StorageToken = environment.web3Storage.token;
  wallectConnectProjectId = environment.walletconnect.projectid;

  ngOnInit() {
    console.log('init...');
    
    // this.initWCv2();
  }

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

  // async initWC() {
  //   const providerOptions = {
  //     // walletconnect: {
  //     //   package: WalletConnectProvider, // required
  //     //   options: {
  //     //     infuraId: "INFURA_ID" // required
  //     //   }
  //     // }
  //   };
    
  //   const web3Modal = new Web3Modal({
  //     network: "mainnet", // optional
  //     // cacheProvider: true, // optional
  //     providerOptions, // required
  //     theme: "dark" // optional
  //   });
    
  //   const instance = await web3Modal.connect()
  //   .catch((err) => {
  //     if (err.code === 4001) {
  //       // EIP-1193 userRejectedRequest error
  //       // If this happens, the user rejected the connection request.
  //       console.log('Please connect to MetaMask.');
  //     } else {
  //       console.error(err);
  //     }
  //   });
  //   const provider = new ethers.providers.Web3Provider(instance);
  //   const signer = provider.getSigner();
  //   const getAddress = await signer.getAddress();
  //   console.log(getAddress);
    
  // }
  // async initWCv2() {
  //   const client = await WalletConnect.init({
  //     projectId: "0f0b05cfec3d67bedbda12d2eace2422",
  //     relayUrl: "wss://relay.walletconnect.com",
  //     metadata: {
  //       name: "Example Dapp",
  //       description: "Example Dapp",
  //       url: "#",
  //       icons: ["https://walletconnect.com/walletconnect-logo.png"],
  //     },
  //   });

  //   client.on(
  //     CLIENT_EVENTS.pairing.proposal,
  //     async (proposal: PairingTypes.Proposal) => {
  //       // uri should be shared with the Wallet either through QR Code scanning or mobile deep linking
  //       // Display the QRCode modal on a new pairing request.
  //       const { uri } = proposal.signal.params;
  //       console.log("EVENT", "QR Code Modal opened");
   
  //       QRCodeModal.open(uri, () => {
  //         console.log("EVENT", "QR Code Modal closed");
  //       });
  //     }
  //   );
    
  //   const session = await client.connect({
  //     permissions: {
  //       blockchain: {
  //         chains: ["eip155:1"],
  //       },
  //       jsonrpc: {
  //         methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData"],
  //       },
  //     },
  //   });
  // }

  // async initWCv1() {
  //   const client = await WalletConnect.init({
  //     projectId: "c4f79cc821944d9680842e34466bfbd",
  //   });
    
  //   // Create a connector
  //   const connector = new WalletConnect({
  //     bridge: "https://bridge.walletconnect.org", // Required
  //     qrcodeModal: QRCodeModal,
  //   });

  //   // Check if connection is already established
  //   if (!connector.connected) {
  //     // create new session
  //     connector.createSession();
  //   }

  //   // Subscribe to connection events
  //   connector.on("connect", (error, payload) => {
  //     if (error) {
  //       throw error;
  //     }

  //     // Get provided accounts and chainId
  //     const { accounts, chainId } = payload.params[0];
  //     console.log("Connected with accounts:", accounts, "and chainId:", chainId);
      
  //   });

  //   connector.on("session_update", (error, payload) => {
  //     if (error) {
  //       throw error;
  //     }

  //     // Get updated accounts and chainId
  //     const { accounts, chainId } = payload.params[0];
  //     console.log("Session updated with accounts:", accounts, "and chainId:", chainId);
  //   });

  //   connector.on("disconnect", (error, payload) => {
  //     if (error) {
  //       throw error;
  //     }
  //     // Delete connector
  //     connector.killSession();
  //   });
  // }
}
