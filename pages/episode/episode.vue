<template>
    <div>
      <video-player :options="videoOptions" />
    </div>
  </template>
  
  <script>
  import VideoPlayer from '@/components/VideoPlayer.vue';
  import  { getSignedUrl } from '@aws-sdk/cloudfront-signer';
  
  const key = Buffer.from(process.env.PRIVATE_KEY , 'base64').toString('ascii');

  const imageUrl = getSignedUrl({
    url: "https://d2o1rek401wuzo.cloudfront.net/assets/VANLIFE/HLS/JOKO-IMRAN_360.m3u8",
    dateLessThan: new Date(Date.now() + 1000 * 60 * 60 *24),
    privateKey: key,
    keyPaidId: process.env.CLOUDFRONT_KEYPAIR_ID,
  })

  console.log(imageUrl);

  export default {
    name: 'VideoExample',
    components: {
      VideoPlayer
    },
    data() {
      return {
        videoOptions: {
          controls: true,
          preload: true,
          fluid: true,
          autoplay: true,
          sources: [
            {
              src: {imageUrl},
              type: 'application/x-mpegURL'
            }
          ]
        }
      };
    }
  };
  </script>