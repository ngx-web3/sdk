import { NgxWeb3LoginModalContent } from './lib/modal.component';
import { NgxWeb3UiLoginButton } from './lib/ui-login-btn';

if (!customElements.get('ngxweb3-login-btn')) {
  window.customElements.define(
    'ngxweb3-login-btn', 
    NgxWeb3UiLoginButton
  );
}

if (!customElements.get('ngxweb3-login-modal')) {
  customElements.define(
    'ngxweb3-login-modal',
    NgxWeb3LoginModalContent
  );
}

// add polyfill for web3
if (!(window as any).Buffer) {
  import('buffer')
  .then(lib => {
    (window as any).Buffer = lib.Buffer;
  })
  .catch(err => {
    console.error('[ERROR]', err);
  });
}