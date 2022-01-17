/**
 * Polyfill stable language features. These imports will be optimized by `@babel/preset-env`.
 *
 * See: https://github.com/zloirock/core-js#babel
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { Buffer } from 'buffer';

if ((window as any).global === undefined) {
  console.log('window.global is undefined');
  
  (window as any).global = window;
  global.Buffer = Buffer;
  global.process = {
      env: { DEBUG: undefined },
      version: '',
      nextTick: require('next-tick')
  } as any;
}
