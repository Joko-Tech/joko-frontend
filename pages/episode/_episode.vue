<template>
    <div>
      <video-player :options="videoOptions" />
    </div>
  </template>
  
  <script>
  import VideoPlayer from '@/components/VideoPlayer.vue';
  
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
          sources: [
            {
              src:
                'https://d2o1rek401wuzo.cloudfront.net/assets/VANLIFE/HLS/JOKO-IMRAN_360.m3u8?Expires=1669356976&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMm8xcmVrNDAxd3V6by5jbG91ZGZyb250Lm5ldC9hc3NldHMvVkFOTElGRS9ITFMvSk9LTy1JTVJBTl8zNjAubTN1OCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTY2OTM1Njk3Nn19fV19&Signature=taV-yQWgBLmrJe1Kw0xXTQPOvrmE764TzQbvndwndyvU7YochnZD5SK5fIHsl~MA460na5HC-JBfP~L3L4KVJ9rz7LXbh4tduk0YmkCqsWgGofE6EUpPvQG27LnIhbcGt1LFwZktuFA7nTJhWu4Epib4K5IZk7u01AdNevyTo7jh1S~G8FkBtZIUUwoIzbSXQlJV0rUwzZYwKkJ78SYaDoMUXQQvUXodea16b4TaTbeladBfi9RdKksBXDX45AEtukuZvNeDlpQlQKcjShBoYZcv4FGRHVwfPGqIWjybXn9hZkXFU4F~vfO~OfwJn3HihEDMoYgrkwcbJz0g81LW7w__&Key-Pair-Id=KFDSTL4XUWKY1',
                type: 'application/x-mpegURL'
            }
          ]
        }
      };
    }
  };
  </script>