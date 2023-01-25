<template>
  <div class="c-episodepage">
    <section>
      <h1 class="c-episodepage__title">EPISODE 1 - CHOICES</h1>
      <div class="c-episodepage__video">
        <!-- <video
          src="https://res.cloudinary.com/dmwfd0zhh/video/upload/v1645290917/Pith%20Africa/PITH-_JFE_compressed_xjx09l.mp4"
          poster="https://res.cloudinary.com/dmwfd0zhh/image/upload/q_auto,f_auto/v1645453390/Pith%20Africa/Screenshot_2022-02-21_at_3.21.43_PM_xx2lrw.jpg"
          preload="auto"
          controls
        /> -->
        <video-player :options="videoOptions" v-if="videoOptions" />
      </div>
      <div class="c-episodepage__bio">
        <div class="c-episodepage__bio__label">Bio</div>
        <p class="c-episodepage__bio__desc">
          Born in April, 1996, Kelvin Nnamdi Odenigbo better known as Lojay is a
          Nigerian singer and songwriter. He came into limelight after featuring
          Wizkid in his debut EP ‘LV N ATTN’. Having developed interests in
          music at a very young age, Lojay released Ariel in October 2019. He
          featured superstar singer, Sarz in his hit single Tonongo and
          Monalisa, as well as worked with other artists like Wizkid.
        </p>
        <a href="https://spotify.com" class="c-episodepage__bio__icon">
          <SpotifyIcon />
        </a>
      </div>
    </section>
    <section class="c-episodepage__bts">
      <div class="c-episodepage__bts__header">
        <h2 class="c-episodepage__bts__title">Behind the scenes</h2>
        <div class="c-episodepage__bts__auth">
          <div class="c-episodepage__bts__auth__text">
            You don’t have access
          </div>

          <ToolTip>
            Purchase a tier 1 or tier 2 token to access BTS footage
          </ToolTip>
        </div>
      </div>

      <div class="c-episodepage__bts__cards">
        <div class="c-bts">
          <div class="c-bts__img">
            <img
              src="https://res.cloudinary.com/dmwfd0zhh/image/upload/q_auto,f_auto/v1659114681/Joko Test/Lojay_Cover_odngka.jpg"
              alt=""
            />
          </div>
        </div>
        <div class="c-bts">
          <div class="c-bts__img">
            <img
              src="https://res.cloudinary.com/dmwfd0zhh/image/upload/q_auto,f_auto/v1659114681/Joko Test/Lojay_Cover_odngka.jpg"
              alt=""
            />
          </div>
        </div>
        <div class="c-bts">
          <div class="c-bts__img">
            <img
              src="https://res.cloudinary.com/dmwfd0zhh/image/upload/q_auto,f_auto/v1659114681/Joko Test/Lojay_Cover_odngka.jpg"
              alt=""
            />
          </div>
        </div>
        <div class="c-bts">
          <div class="c-bts__img">
            <img
              src="https://res.cloudinary.com/dmwfd0zhh/image/upload/q_auto,f_auto/v1659114681/Joko Test/Lojay_Cover_odngka.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
    <section class="c-episodepage__tokens">
      <h2 class="c-episodepage__tokens__title">Lojay Tokens</h2>
      <div class="c-episodepage__tokens__cards"></div>
    </section>
  </div>
</template>

<script>
import { getSignedCookies } from "@aws-sdk/cloudfront-signer";

export default {
  data() {
    return {
      videoOptions: null,
    };
  },
  mounted() {
    const key = Buffer.from(process.env.PRIVATE_KEY, "base64").toString(
      "ascii"
    );

    const cloudfrontDistributionDomain = "https://d2o1rek401wuzo.cloudfront.net";
    const s3ObjectKey = "assets/059a4310-805d-494f-9284-9f5621bb770b/HLS/TRAILER.m3u8";
    const url = `${cloudfrontDistributionDomain}/${s3ObjectKey}`;
    const privateKey = key;
    const keyPairId = process.env.CLOUDFRONT_KEYPAIR_ID;
    const dateLessThan = "2023-01-24";

    const policy = JSON.stringify({
        "Statement": [
            {
                "Resource": "https://d2o1rek401wuzo.cloudfront.net/*",
                "Condition": {
                    "DateLessThan": {
                        "AWS:EpochTime": new Date(Date.now + 1000 * 60)
                    }
                }
            }
        ]
    });


    const cookies = getSignedCookies({
        url,
        keyPairId,
        dateLessThan,
        privateKey,
        policy,
      });

    $cookies.set("CloudFront-Key-Pair-Id", cookies["CloudFront-Key-Pair-Id"], "/", { domain: process.env.COOKIE_BASE_URL })
    $cookies.set("CloudFront-Signature", cookies["CloudFront-Signature"], "/", { domain: process.env.COOKIE_BASE_URL })
    $cookies.set("CloudFront-Policy", cookies["CloudFront-Policy"], "/", { domain: process.env.COOKIE_BASE_URL })

 console.log(cookies);

      const headers = {
        "CloudFront-Key-Pair-Id": cookies["CloudFront-Key-Pair-Id"],
        "CloudFront-Signature": cookies["CloudFront-Signature"],
        "CloudFront-Policy": cookies["CloudFront-Policy"],
      };

      const response = fetch("https://d2o1rek401wuzo.cloudfront.net/assets/059a4310-805d-494f-9284-9f5621bb770b/HLS/TRAILER.m3u8", {
        method: "GET",
        headers,
        mode: 'cors',
      })

      console.log(response);

    const videoOptions = {
      controls: true,
      preload: true,
      fluid: true,
      sources: [
        {
          src: response,
          type: "application/x-mpegURL",
          withCredentials: true,
          overrideNative: true,
        },
      ],
    };

    this.videoOptions = videoOptions;
  },
  computed: {
    slug() {
      return this.$route.params.slug;
    },
  },
};
</script>

<style lang="scss" scoped></style>
