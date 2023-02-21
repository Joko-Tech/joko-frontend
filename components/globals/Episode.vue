<template>
  <div class="c-episode">
    <div class="c-episode__maincard">
      <EpisodeCard :episode="episode" :isAuthenticatedVideo="false" />
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
      isAuthenticatedVideo: false,
    };
  },
  props: {
    episode: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({}),
  },
  async mounted() {
    // getch all token tier metadata from 1 - 3

    try {
      const startTime = new Date().getTime();

      const metadatas = await Promise.all([
        await ipfsIndexFetcher(
          this.episode.tier1_metadata_path,
          this.episode.tier1_total_supply
        ),
        await ipfsIndexFetcher(
          this.episode.tier2_metadata_path,
          this.episode.tier2_total_supply
        ),
        await ipfsIndexFetcher(
          this.episode.tier3_metadata_path,
          this.episode.tier3_total_supply
        ),
      ]);

      this.metadatas = metadatas.map((metadata, index) => {
        const tier = index + 1;
        const tokenIndex = Number(this.episode[`tier${tier}_total_supply`]);
        const tokenCount = Number(this.episode[`tier${tier}_max_supply`]);
        return {
          ...metadata.data,
          tokenIndex: tokenIndex === tokenCount ? tokenIndex : tokenIndex + 1,
          tokenCount,
          tier,
          isFullyMinted: tokenIndex === tokenCount,
          artist: this.episode.artistName,
          tier2_price: this.episode.tier2_price,
          tier3_price: this.episode.tier3_price,
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
