export * from './lib/ui-upload-btn';
import { NgxWeb3UiUploadButton } from './lib/ui-upload-btn';

if (!customElements.get('ngxweb3-upload-btn')) {
  window.customElements.define('ngxweb3-upload-btn', NgxWeb3UiUploadButton);
}