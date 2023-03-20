<template>
  <div class="c-home">
    <section class="c-home__hero">
      <h1 class="c-home__hero__title" data-animation="title">
        <div class="word c-line">
          <span class="c-line__inner">Stories</span>
        </div>
        <div class="word c-line c-line--bottom">
          <span class="c-line__inner">
            <span class="c-line__dash"></span>
            <span>Behind</span>
          </span>
        </div>
        <div class="word c-line c-line--bottom">
          <span class="c-line__inner">The Music.</span>
        </div>
      </h1>
      <p class="c-home__hero__desc" data-animation="in-view">
        We are using the power of storytelling to enable musicians build a
        stronger connection with existing fans, and acquire new core fans.
      </p>
    </section>
    <section class="c-home__episodes">
      <div class="c-home__episodes__header">
        <div class="c-header__title">Episodes + Tokens</div>
        <div class="c-header__question">
          <span>What are tokens?</span>
          <span>
            <ToolTip>
              Crypto tokens are a type of cryptocurrency that represents
            </ToolTip>
          </span>
        </div>
      </div>
      <Episode v-for="(artist, id) in artists" :key="id" :episode="artist" />
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import tokens from "~/data/tokens.json";
import Masonry from "~/js/components/Masonry";
import pages from "~/js/pages";
import { ipfsMetadataFetcher, getImageHash } from "~/utils/data";

export default {
  name: "IndexPage",
  async asyncData({ store }) {
    const artists = store.getters.artists;

    if (!artists) {
      await store.dispatch("fetchInitialStorage");
    }

    return {};
  },
  async mounted() {
    this.page = new pages(this.$el);
  },
  methods: {
    addArtist() {
      this.$store.dispatch("addNewArtist");
    },
  },
  computed: {
    ...mapGetters({
      artists: "artists",
    }),
    tokens() {
      return tokens;
    },
  },
};
</script>

<style lang="scss"></style>

<!-- <button @click="addArtist">Add Artist</button> -->
<!-- <EpisodeCard :episode="testEpisode" :isAuthenticatedVideo="false" /> -->
<!-- <div style="max-width: 293px; margin: 120px 0">
      <TokenCard :token="testTokenAspect" />
      <TokenGalleryCard :token="testTokenGallery" />
    </div> -->

<!-- <div class="c-masonry" data-masonry>
      <TokenGalleryCard
        v-for="(token, index) in tokens"
        :key="index"
        :token="token"
        data-masonry-item
        :data-index="index"
      />
    </div>

    <label class="c-label">Artist name</label>
    <input type="text" class="c-input" placeholder="e.g John Doe" />
    <label class="c-label">Artist desc</label>
    <textarea class="c-textarea"></textarea> -->
