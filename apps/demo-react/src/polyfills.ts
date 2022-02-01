/**
 * Polyfill stable language features. These imports will be optimized by `@babel/preset-env`.
 *
 * See: https://github.com/zloirock/core-js#babel
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (window && (window as any).global === undefined) {
  console.log('window.global is undefined');
  (window as any).global = window;
  global.process = {
      env: { DEBUG: undefined },
      version: '',
  } as any;
}
