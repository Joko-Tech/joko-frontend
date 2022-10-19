<template>
  <div class="c-gallery">
    <section class="c-gallery__header">
      <h1 class="c-gallery__title">Gallery</h1>
      <p class="c-gallery__desc">Collection of Joko tokens</p>
    </section>
    <section class="c-gallery__tokens">
      <div class="c-masonry" data-masonry>
        <TokenGalleryCard
          v-for="(token, index) in tokens"
          :key="index"
          :token="token"
          data-masonry-item
          :data-index="index"
        />
      </div>
    </section>
  </div>
</template>

<script>
import Masonry from "~/js/components/Masonry";
// import tokens from "~/data/tokens.json";
import { mapGetters } from "vuex";
export default {
  async mounted() {
    if (!this.allTokenMetadata) {
      await this.$store.dispatch("fetchAllMetadata");
      await this.$store.dispatch("fetchGalleryMetadata");
    }

    if (this.tokens.length) {
      // next tick
      this.$nextTick(() => {
        this.masonry = new Masonry({ element: this.$el });
      });
    }
  },
  computed: {
    ...mapGetters({
      allTokenMetadata: "allTokenMetadata",
    }),
    tokens() {
      let tokenArray = [];

      this.allTokenMetadata?.forEach((token) => {
        const tokens = [
          ...token.tier1_metadata,
          ...token.tier2_metadata,
          ...token.tier3_metadata,
        ];

        tokenArray.push(...tokens);
      });

      // console.log(tokenArray);

      return tokenArray;
    },
  },
};
</script>

<style lang="scss" scoped></style>
