<center>
<h1>@ngx-web3/ui-payment-btn</h1>

> Web Component Crypto Payment Button for Web3 Applications
</center>


## 👀 Overview
Simple HTML UI Crypto Payment Button Component that allows your to provide decentralized USD transaction payment solution with [Ethereum (ETH)](https://ethereum.org), [Binance (BNB)](https://www.binance.com) or [Solana (SOL)](https://solana.com) token. It includes real-time currency conversion from USD to selected token using [Coingecko API](https://www.coingecko.com/en/api). It also includes an optiionnal UI to display the transaction status. This HTML component is a great way to provide a crypto payment button to your application or website without centralized payment provider. 


## ⚙️ Install

- Run `npm install @ngx-web3/ui-payment-btn`

## 📝 Usage

**Angular >=13**

```typescript
  import { Component } from '@angular/core';
  import '@ngx-web3/ui-payment-btn';
  
  @Component({
    selector: 'app-root',
    template: `
      <p>Price: $ {{amount}} USD</p>
      <ngxweb3-payment-btn
          to="0x..."
          symbol="BNB"
          displayError="true"
          [attr.amount]="amount"></ngxweb3-payment-btn>
    `
  })
  export class AppComponent {
    public amount: number = 100;
  }
  ```

```typescript
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
```
```json
// angular.json

    "assets": [
      "src/favicon.ico",
      "src/assets",
      {
        "input": "node_modules/@ngx-web3/ui-payment-btn/assets/payment-btn",
        "glob": "**/*",
        "output": "assets/payment-btn"
      }
    ],
    "allowedCommonJsDependencies": [
      "@solana/buffer-layout",
      "bl/BufferList.js",
      "blob-to-it",
      "borsh",
      "bs58",
      "buffer",
      "hamt-sharding",
      "hash.js",
      "it-parallel-batch",
      "jayson/lib/client/browser",
      "p-retry",
      "parse-link-header",
      "rabin-wasm",
      "rpc-websockets",
      "secp256k1",
      "tweetnacl",
      "varint"
    ]
```
<!-- 
**React**
  ```tsx
import '@ngx-web3/ui-payment-btn';

export function App() {
  const amount = 250;
  return (
    <>
      <p>Price: $ {amount} USD</p>
      <ngxweb3-payment-btn
          symbol="BNB"
          to="Ox..."
          display-error={true}
          amount={amount}></ngxweb3-payment-btn>
      <div />
    </>
  );
}

export default App;
```

**WebComponent**
```ts
import '@ngx-web3/ui-payment-btn';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  connectedCallback() {
    const amount = 100;
    this.innerHTML = `
    <p>Price: $ ${amount} USD</p>
    <ngxweb3-payment-btn
        to="0x..."
        symbol="BNB"
        amount="${amount}"></ngxweb3-payment-btn>
    `;
  }
}
customElements.define('ngx-web3-root', AppElement);
```

**html**
```html
<script src="https://unpkg.com/@ngx-web3/ui-payment-btn" async></script>
<ngxweb3-payment-btn
    to="0x..."
    symbol="BNB"
    amount="100"></ngxweb3-payment-btn>
``` -->


**Polyfill**
```ts
// allow node crypto library to be used in browser
if (window && (window as any).global === undefined) {
  console.log('window.global is undefined');
  (window as any).global = window;
  (window as any).global.process = {
    env: { DEBUG: undefined }
  } as any;
}
```

## 🔍 Exemples

Real project demo:
- Angular: https://github.com/ngx-web3/payment-btn-angular-demo


## Network & ChainId configuration options

| **Networks** | chainid |
|--------------|----|
| **BNB**      |    |
| mainnet      | 38 |
| testnet      | 61 |
| **ETH**      |    |
| mainnet      | 1  |
| ropsten      | 3  |
| rinkeby      | 4  |
| **SOL**      |    |
| mainnet-beta | 55 |
| testnet      | 56 |
| devnet       | 57 |

<hr/>


*Note: User must have an Web3 Wallet provider like `metamask` or `phantom` to use this component.*
