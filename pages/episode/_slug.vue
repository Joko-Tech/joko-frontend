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
        <video-player :options="videoOptions" />
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
export default {
  data() {
    return {
      videoOptions: {
        controls: true,
        preload: true,
        fluid: true,
        sources: [
          {
            src: "https://d2o1rek401wuzo.cloudfront.net/assets/VANLIFE/HLS/JOKO-IMRAN_360.m3u8?Expires=1669356976&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMm8xcmVrNDAxd3V6by5jbG91ZGZyb250Lm5ldC9hc3NldHMvVkFOTElGRS9ITFMvSk9LTy1JTVJBTl8zNjAubTN1OCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTY2OTM1Njk3Nn19fV19&Signature=taV-yQWgBLmrJe1Kw0xXTQPOvrmE764TzQbvndwndyvU7YochnZD5SK5fIHsl~MA460na5HC-JBfP~L3L4KVJ9rz7LXbh4tduk0YmkCqsWgGofE6EUpPvQG27LnIhbcGt1LFwZktuFA7nTJhWu4Epib4K5IZk7u01AdNevyTo7jh1S~G8FkBtZIUUwoIzbSXQlJV0rUwzZYwKkJ78SYaDoMUXQQvUXodea16b4TaTbeladBfi9RdKksBXDX45AEtukuZvNeDlpQlQKcjShBoYZcv4FGRHVwfPGqIWjybXn9hZkXFU4F~vfO~OfwJn3HihEDMoYgrkwcbJz0g81LW7w__&Key-Pair-Id=KFDSTL4XUWKY1",
            type: "application/x-mpegURL",
          },
        ],
      },
    };
  },
  computed: {
    slug() {
      return this.$route.params.slug;
    },
  },
};
</script>

<style lang="scss" scoped></style>
