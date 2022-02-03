if (window && (window as any).global === undefined) {
  console.log('window.global is undefined');
  (window as any).global = window;
  global.process = {
      env: { DEBUG: undefined }
  } as any;
}