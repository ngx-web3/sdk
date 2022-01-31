# NgxWeb3

> Blockchain tools for web developpement

## 👀 Overview

NgxWeb3 provide a collection of packages based on `web3.js` to simplify development of your dapps in Typescript, Angular, React and WebComponent.

## 🚀 Features

- ✅ [@ngx-web3/ui-payment-btn]() - Is a UI Payment Button Component that allows your to provide a simple button to your application or website to make transaction payment with Ethereum and other ERC20 tokens. 
- ☑️ [@ngx-web3/ui-payment-modal]() - Is a UI Payment Modal Component that allows yous to provide a modal to your application or website, with many options and configurations to make transaction payment with Ethereum and other ERC20 tokens.

## ⚙️ Install

- Install desired package by run corresponding command like: `npm install @ngx-web3/ui-payment-btn` to install your package
- Add polyfill to your project as described in exemple application in `./apps/**/*` folder
- Import web component in your project: `import '@ngx-web3/ui-payment-btn';`
- Use web component in your project as described in exemple application in `./apps/**/*` folder

> Check exemple installation for `Angular`, `React` and `WebComponent` in `./apps/` folder.


*Note: After that you need to create a web3 instance and set a provider. Ethereum supported Browsers like `Mist` or `MetaMask` will have a ethereumProvider or `web3.currentProvider` available. For NgxWeb3, check `Web3.givenProvider`. If this property is `null` you should connect to a remote/local node.*


## 💻 Contributing to `NgxWeb3`

Thanks for taking the time to help out and improve NgxWeb3! 🎉

The following is a set of guidelines for NgxWeb3 contributions and may change over time. Feel free to suggest improvements to this document in a pull request!

See [CONTRIBUTING.md](CONTRIBUTING.md)

## 📃 License

See [LICENSE](LICENSE)



