/**
 * Polyfill stable language features. These imports will be optimized by `@babel/preset-env`.
 *
 * See: https://github.com/zloirock/core-js#babel
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// allow node crypto library to be used in browser
if (window && (window as any).global === undefined) {
  console.log('window.global is undefined');
  (window as any).global = window;
  global.process = {
    env: { DEBUG: undefined }
  } as any;
}

// allow Safari <=14 use BigInt
// see: https://caniuse.com/bigint
if (typeof BigInt === 'undefined') global.BigInt = require('big-integer')
