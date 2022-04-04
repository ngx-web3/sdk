import { NgxWeb3File, NgxWeb3StorageProviderInterface } from '@ngx-web3/core';
import * as S3 from "aws-sdk/clients/s3";
import { v4 as uuidv4 } from 'uuid';

interface S3StorageProviderOptions {
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  bucket: string;
  prefix?: string;
};

export class StorjStorageProvider implements NgxWeb3StorageProviderInterface {

  private readonly _S3!: S3;
  private readonly bucket!: string;

  constructor(params: S3StorageProviderOptions) {
    this.bucket = params.bucket || "demo-bucket";
    // init S3 client
    const accessKeyId =  params.accessKeyId;
    const secretAccessKey =  params.secretAccessKey;
    const endpoint = params.endpoint;
    const s3 = new S3({
      accessKeyId,
      secretAccessKey,
      endpoint,
      s3ForcePathStyle: true,
      signatureVersion: "v4",
      httpOptions: { timeout: 0 },
    });
    this._S3 = s3;
  }

  async findFile(Key: string): Promise<NgxWeb3File[]> {
    // const { Buckets } = await this._S3.listBuckets().promise();
    // console.log(Buckets);
    const params = {
      Bucket: this.bucket,
      Key,
    }
    const url = this._S3.getSignedUrl("getObject", params);
    // get blob from url src
    const blob = await fetch(url).then(res => res.blob());
    // create File object from url src and return
    const file = new File([blob], Key) as NgxWeb3File;
    file.ipfsFileNamePath = url;
    return [file];
  }

  async storeFiles(files: File[], opts?: any): Promise<string> {
      // `file` can be a readable stream in node or a `Blob` in the browser
      const uploads = [];
      for (let i = 0; i < files.length; i++) {
        const element = files[i]; 
        const ext =  element.name.split('_').pop();
        // generate random cid using uuid
        const cid = uuidv4();
        const Key = cid + '.' + ext;
        const params = {
          Bucket: this.bucket,
          Key: Key,
          Body: element,
          ACL: "public-read", // not working with Storj
          ContentType: element.type||"application/octet-stream",
        };
        const task = this._S3.upload(params, {
          partSize: 64 * 1024 * 1024
        }).promise();
        uploads.push(task);
      }
      const result = await Promise.all(uploads).then(data => {
        // return data.map(item => item.Location);
        // data item Location is access restricted only.
        // we have to generate a public signedUrl to access the file
        // return data.map(({Bucket, Key}) => {
        //   const params = {
        //     Bucket,
        //     Key,
        //   }
        //   const url = this._S3.getSignedUrl("getObject", params);
        //   return url;
        // });
        return data.map(({Key}) => Key);
      });
    return result.join(',');
  }

}
