# @ngx-web3/ui-payment-btn

Simple HTML UI Crypto Payment Button Component that allows your to provide a button to make USD transaction payment with Ethereum (ETH), Binance (BNB) or Solana (SOL) token. It includes real-time currency conversion from USD to selected token using Coingecko API. It also includes an optiionnal UI to display the transaction status. This HTML component is a great way to provide a crypto payment button to your application or website without centralized payment provider. 

## Install

- Run `npm install @ngx-web3/ui-payment-btn`

## Usage

**Angular**

```typescript
  import '@ngx-web3/ui-payment-btn';
  ...
  @Component({
    selector: 'app-root',
    template: `
      <p>Price: $ {{amount}} USD</p>
      <ngxweb3-payment-btn
          to="0x..."
          symbol="BNB"
          [attr.amount]="amount"></ngxweb3-payment-btn>
    `
  })
  export class AppComponent {
    public amount: number = 100;
  }
  ```

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
```

**Webpack config**
```js
// add assets to the bundle
```

**Polyfill**
```ts
  import '@ngx-web3/ui-payment-btn/polyfill';
```


## Network & ChainId configuration options

**BNB**
- mainnet: 38
- testnet: 61

**ETH**
- mainnet: 1
- ropsten: 3
- rinkeby: 4

**SOL**
- mainnet-beta: 55
- testnet: 56
- devnet: 57

<hr/>


*Note: User must have an Web3 Wallet provider like `metamask` or `phantom` to use this component.*
