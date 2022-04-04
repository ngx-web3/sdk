<center>
<h1>@ngx-web3/ui-upload-btn</h1>

> Web Component - Upload Files Button for Web3 Applications
</center>


## 👀 Overview
Simple HTML UI Upload Files Button Component that allows your to provide 100% decentralized storage solution with [Filcoin (fil)](https://filecoin.io/) using [Web3Storage SKD](https://web3.storage/) or [Storj](https://www.storj.io/) using [AWS S3 SDK](https://aws.amazon.com/fr/s3/). It includes an optionnal UI parametter to display spiinner and result storage URL. This HTML component is a great way to provide a upload files button to your application or website without centralized storage provider. 


## ⚙️ Install

- Run `npm install @ngx-web3/ui-upload-btn`

## 📚 Usage

- Import the component in your application or website:

```typescript
import '@ngx-web3/ui-upload-btn';
```

**With Storj provider:** .

```html
  <ngxweb3-upload-btn 
      accesskey="<YOUR_STORJ_ACCESS_KEY_ID>"
      secretkey="<YOUR_STORJ_SECRET_ACCESS_KEY>"
      endpoint="<YOUR_STORJ_SHARE_ENDPOINT>"
      bucket="<YOUR_STORJ_BUCKET_NAME>"
      provider="storj">
    upload files
  </ngxweb3-upload-btn>
```

**With Filcoin provider:** .

```html
  <ngxweb3-upload-btn 
      token="<YOUR_WEB3STORAGE_TOKEN>"
      provider="filcoin">
    upload files
  </ngxweb3-upload-btn>
```
