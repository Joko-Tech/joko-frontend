<template>
  <div>
    <!-- <button @click="addArtist">Add Artist</button> -->
    <!-- <TokenCard tokenId="1" /> -->
    <EpisodeCard :episode="testEpisode" :isAuthenticated="false" />
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
  },
};
</script>

<style lang="scss"></style>
