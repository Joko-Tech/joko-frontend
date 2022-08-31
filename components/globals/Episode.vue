<template>
  <div class="c-episode">
    <EpisodeCard :episode="episode" :isAuthenticated="true" />
    <div class="c-episode__tokens"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ipfsMetadataFetcher } from "~/utils/data";
export default {
  props: {
    episode: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      episodeTokenMetadata: "episodeTokenMetadata",
    }),
  },
  async mounted() {
    // getch all token tier metadata from 1 - 3

    const metadata = await Promise.all([
      await ipfsMetadataFetcher(this.episode.tier1_metadata_path),
      await ipfsMetadataFetcher(this.episode.tier2_metadata_path),
      await ipfsMetadataFetcher(this.episode.tier3_metadata_path),
    ]);

    console.log(metadata);
  },
};
</script>

<style lang="scss" scoped></style>
