
import { toDataURL, QRCodeToDataURLOptions } from 'qrcode';

interface QrCodeOptions {
  address: string;
  networkName: string;
  value: string;
  chainid?: number;
}

const generateQrURL = ({address, networkName, value, chainid}: QrCodeOptions) => {
  // https://eips.ethereum.org/EIPS/eip-681
  // ethereum:0xB8c77482e45F1F44dE1745F52C74426C631bDD52/transfer?address=0x8e23ee67d1332ad560396262c48ffbb01f93d052&uint256=1
  // ethereum:0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359?value=2.014e18
  let url;
  switch (true) {
    case networkName.toLocaleLowerCase() === 'bitcoin':
      url = `bitcoin:${address}?amount=${value}`;
      break;
    case networkName.toLocaleLowerCase() === 'ethereum': 
      // - ethereum:0x8e23ee67d1332ad560396262c48ffbb01f93d052@1?value=25000000000000000000
      // - ethereum:{TO_ADDRESS}@{CHAIN_ID}?value={AMOUNT_BIGINT}
      url = `ethereum:${address}${chainid ? '@'+chainid : ''}?value=${value}`;
      break;
    // case networkName.toLocaleLowerCase() === 'bnb':
    //   // - ethereum:0xB8c77482e45F1F44dE1745F52C74426C631bDD52@64/transfer?address=xxx&uint256=2.5e2
    //   url = `ethereum:0xB8c77482e45F1F44dE1745F52C74426C631bDD52${chainid ? '@'+chainid : ''}/transfer?address=${address}&value=${value}`;
    //   break;
    default:
      throw new Error(`Unsupported network: ${networkName}`);
  }
  return url;
  // 'ethereum:0xB8c77482e45F1F44dE1745F52C74426C631bDD52/transfer?address=0x8e23ee67d1332ad560396262c48ffbb01f93d052&uint256=2.5e2'
  //'ethereum:0xB8c77482e45F1F44dE1745F52C74426C631bDD52/transfer?address=0x8e23ee67d1332ad560396262c48ffbb01f93d052&uint256=1&value=1' //url;
}

export const generateQrCodeBase64 = async (opts: QrCodeOptions) => {
  const url = generateQrURL(opts);
  const config: QRCodeToDataURLOptions = {
    errorCorrectionLevel: 'low',
    type: 'image/png',
    width: 100,
    margin: 2,
    color: {
      dark:"#333",
      light:"#fff"
    }
  };
  let res;
  try {
    res =  await toDataURL(url, config);
  } catch (err) {
    console.error(err)
  }
  return res;
}