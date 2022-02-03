import './app.element.scss';
import '@ngx-web3/ui-payment-btn';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  connectedCallback() {
    const title = 'demo-web';
    const amount = 250;
    this.innerHTML = `
    <p>Price: $ ${amount} USD</p>
    <ngxweb3-payment-btn
        chainid="61"
        symbol="BNB"
        to="0x..."
        amount="${amount}"></ngxweb3-payment-btn>
      `;
  }
}
customElements.define('ngx-web3-root', AppElement);
