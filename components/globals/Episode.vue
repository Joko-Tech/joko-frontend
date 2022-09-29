<template>
  <div class="c-episode">
    <div class="c-episode__maincard">
      <EpisodeCard :episode="episode" :isAuthenticated="false" />
    </div>

    <div class="c-episode__token__wrapper">
      <div class="c-episode__tokens" v-if="metadatas">
        <TokenCard
          v-for="(metadata, index) in metadatas"
          :key="index"
          :token="metadata"
        />
      </div>

      <div class="c-episode__tokens" v-else>
        <TokenCardSkeleton />
        <TokenCardSkeleton />
        <TokenCardSkeleton />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ipfsMetadataFetcher, ipfsIndexFetcher } from "~/utils/data";
export default {
  data() {
    return {
      metadatas: null,
      isAuthenticated: true,
    };
  },
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

    try {
      const startTime = new Date().getTime();

      const metadatas = await Promise.all([
        await ipfsIndexFetcher(
          this.episode.tier1_metadata_path,
          this.episode.tier1_index
        ),
        await ipfsIndexFetcher(
          this.episode.tier2_metadata_path,
          this.episode.tier2_index
        ),
        await ipfsIndexFetcher(
          this.episode.tier3_metadata_path,
          this.episode.tier3_index
        ),
      ]);

      this.metadatas = metadatas.map((metadata, index) => {
        const tokenIndex = this.episode[`tier${index + 1}_index`];
        const tokenCount = this.episode[`tier${index + 1}_total_supply`];

        return {
          ...metadata.data,
          tokenIndex: tokenIndex === tokenCount ? tokenIndex : tokenIndex + 1,
          tokenCount,
          tier: index + 1,
          isFullyMinted: tokenIndex === tokenCount,
        };
      });

      const endTime = new Date().getTime();

      console.log(`metadata fetched in ${endTime - startTime}ms`);
    } catch (error) {
      console.log(error);
    }

    // console.log(metadata);
  },
};
</script>

<style lang="scss" scoped></style>
