<template>
  <div class="c-episode">
    <EpisodeCard :episode="episode" :isAuthenticated="true" />
    <div class="c-episode__tokens"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
};
</script>

<style lang="scss" scoped></style>
