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
  async mounted() {
    const key = Buffer.from(process.env.PRIVATE_KEY, "base64").toString(
      "ascii"
    );

    const cloudfrontDistributionDomain =
      "https://cloudfront.playjoko.com";
    const s3ObjectKey =
      "assets/VANLIFE/HLS/JOKO-IMRAN.m3u8";
    const url = `${cloudfrontDistributionDomain}/${s3ObjectKey}`;
    const privateKey = key;
    const keyPairId = process.env.CLOUDFRONT_KEYPAIR_ID;
    const dateLessThan = new Date(Date.now + 1000 * 60);

    console.log(dateLessThan);

    const policy = JSON.stringify({
      Statement: [
        {
          Resource: "https://cloudfront.playjoko.com/*",
          Condition: {
            DateLessThan: {
              "AWS:EpochTime": 1678175990,
            },
          },
        },
      ],
    });

    const cookies = getSignedCookies({
      url,
      keyPairId,
      dateLessThan,
      privateKey,
      policy,
    });

    $cookies.set("CloudFront-Key-Pair-Id", cookies["CloudFront-Key-Pair-Id"], null, "/", ".playjoko.com", true);
    $cookies.set("CloudFront-Signature", cookies["CloudFront-Signature"], null, "/", ".playjoko.com", true);
    $cookies.set("CloudFront-Policy", cookies["CloudFront-Policy"], null, "/", ".playjoko.com", true);
    $cookies.set("Test", "value", null, "/", ".playjoko.com", true);

    try {
      const response = await this.$axios.$get(
        "https://cloudfront.playjoko.com/assets/VANLIFE/HLS/JOKO-IMRAN.m3u8",
        {
          method: "GET",
          withCredentials: true
        }
      );

      console.log(response);

      const videoOptions = {
        controls: true,
        preload: true,
        fluid: true,
        sources: [
          {
            src: "https://cloudfront.playjoko.com/assets/VANLIFE/HLS/JOKO-IMRAN.m3u8",
            type: "application/x-mpegURL",
            withCredentials: true,
            overrideNative: true,
          },
        ],
      };

      this.videoOptions = videoOptions;
    } catch (error) {
      console.log(error);
    }
  },
  computed: {
    slug() {
      return this.$route.params.slug;
    },
  },
};
</script>

<style lang="scss" scoped></style>
