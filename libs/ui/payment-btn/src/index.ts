import { NgxWeb3UiPaymentButton } from './lib/ui-payment-btn';

if (!customElements.get('ngxweb3-payment-btn')) {
  window.customElements.define('ngxweb3-payment-btn', NgxWeb3UiPaymentButton);
}