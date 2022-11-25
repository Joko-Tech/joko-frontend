var cfsign = require('aws-cloudfront-sign');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const key = Buffer.from(process.env.PRIVATE_KEY , 'base64').toString('ascii');

const now = new Date().getTime() + 1;
console.log(now);

var signingParams = {
    keypairId: process.env.CLOUDFRONT_KEYPAIR_ID,
    privateKeyString: key
    // Optional - this can be used as an alternative to privateKeyString
  }

  var signedUrl = cfsign.getSignedUrl(
    'https://d2o1rek401wuzo.cloudfront.net/assets/VANLIFE/HLS/JOKO-IMRAN_360.m3u8', 
    signingParams,
    expireTime = (new Date().getTime() + 1)
  );

return signedUrl;