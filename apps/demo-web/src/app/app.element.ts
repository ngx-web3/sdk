import './app.element.scss';
import '@ngx-web3/ui-payment-btn';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  connectedCallback() {
    const title = 'demo-web';
    this.innerHTML = `
    <p>Price: 0.01 BNB</p>
    <ngxweb3-payment-btn
        symbol="BNB"
        chainid="61"
        to="0x..."
        amount="0.01"></ngxweb3-payment-btn>
      `;
  }
}
customElements.define('ngx-web3-root', AppElement);
