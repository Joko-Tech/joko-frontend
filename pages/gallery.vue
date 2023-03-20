<template>
  <div class="c-gallery">
    <section class="c-gallery__header">
      <h1 class="c-gallery__title">Gallery</h1>
      <p class="c-gallery__desc">Collection of Joko tokens</p>
    </section>
    <section class="c-gallery__tokens">
      <div class="c-masonry" data-masonry>
        <TokenGalleryCard
          v-for="(token, index) in mintedTokenMetadata"
          :pageType="pageType"
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
  data() {
    return {
      isLoading: true,
      pageType: "gallery",
    };
  },
  async mounted() {
    if (!this.allTokenMetadata) {
      await this.$store.dispatch("fetchGalleryMetadata");
    }

    console.log(this.$store.getters.artists);

    if (this.mintedTokenMetadata.length) {
      // next tick
      this.$nextTick(() => {
        this.masonry = new Masonry({ element: this.$el });
      });
    }
    this.pageType = "gallery";
  },
  computed: {
    ...mapGetters({
      mintedTokenMetadata: "mintedTokenMetadata",
    }),
  },
};
</script>

<style lang="scss" scoped></style>
