<template>
  <div>
    <!-- <button @click="addArtist">Add Artist</button> -->
    <!-- <EpisodeCard :episode="testEpisode" :isAuthenticated="false" /> -->
    <div style="max-width: 293px; margin: 120px 0">
      <!-- <TokenCard :token="testTokenAspect" /> -->
      <TokenGalleryCard :token="testTokenGallery" />
    </div>

    <label class="c-label">Artist name</label>
    <input type="text" class="c-input" placeholder="e.g John Doe" />
    <label class="c-label">Artist desc</label>
    <textarea class="c-textarea"></textarea>
  </div>
</template>

<script>
export default {
  name: "IndexPage",
  methods: {
    addArtist() {
      this.$store.dispatch("addNewArtist");
    },
  },
  computed: {
    testEpisode() {
      return {
        number: "01",
        artist: "Lojay",
        description:
          "Born in April, 1996, Kelvin Nnamdi Odenigbo better known as Lojay is a Nigerian singer and songwriter. He came into limelight after featuring Wizkid in his debut EP ‘LV N ATTN’. Having developed interests in music at a very young age, Lojay released Ariel in October 2019. He featured superstar singer, Sarz in his hit single Tonongo and Monalisa, as well as worked with other artists like Wizkid.",
        image:
          "https://res.cloudinary.com/dmwfd0zhh/image/upload/q_auto,f_auto/v1659114681/Joko%20Test/Lojay_Cover_odngka.jpg",
      };
    },
    testTokenAspect() {
      return {
        name: "IGOR",
        pixelArtist: "Daniel Picasso",
        pixelArtistUrl: "https://www.instagram.com/danielpicasso/",
        image:
          "https://res.cloudinary.com/dmwfd0zhh/image/upload/v1659430390/Joko%20Test/Test_token_wbznbf.png",
        tokenIndex: 1,
        tokenCount: 10,
        description:
          "Born in April, 1996, Kelvin Nnamdi Odenigbo better known as Lojay is a Nigerian singer and songwriter. He came into limelight after featuring Wizkid in his debut EP ‘LV N ATTN’. Having developed interests in music at a very young age, Lojay released Ariel in October 2019. He featured superstar singer, Sarz in his hit single Tonongo and Monalisa, as well as worked with other artists like Wizkid.",
      };
    },
    testTokenGallery() {
      return {
        name: "IGOR",
        pixelArtist: "Daniel Picasso",
        pixelArtistUrl: "https://www.instagram.com/danielpicasso/",
        image:
          "https://res.cloudinary.com/dmwfd0zhh/image/upload/v1659430010/Joko%20Test/FYnvLcpXwAMKKEP_lm27q8.jpg",
        tokenIndex: 1,
        tokenCount: 10,
        description:
          "Born in April, 1996, Kelvin Nnamdi Odenigbo better known as Lojay is a Nigerian singer and songwriter. He came into limelight after featuring Wizkid in his debut EP ‘LV N ATTN’. Having developed interests in music at a very young age, Lojay released Ariel in October 2019. He featured superstar singer, Sarz in his hit single Tonongo and Monalisa, as well as worked with other artists like Wizkid.",
      };
    },
  },
};
</script>

<style lang="scss"></style>
