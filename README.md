# NgxWeb3

> Blockchain tools for web developpement

## 👀 Overview

NgxWeb3 provide a collection of packages to simplify development of your dapps in Typescript, Angular, React and WebComponent.

## 🚀 Features

- ✅ [@ngx-web3/ui-payment-btn](./libs/ui/payment-btn/README.md) - Is a HTML UI Crypto Payment Button Component that allows your to provide a simple button to make USD transaction payment with Ethereum (ETH), Binance (BNB) or Solana (SOL) token. It includes real-time currency conversion from USD to selected token using Coingecko API. It also includes an optiionnal UI to display the transaction status. This HTML component is a great way to provide a crypto payment button to your application or website without centralized payment provider.


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



