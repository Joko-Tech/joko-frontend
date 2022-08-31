<template>
  <div class="c-episode">
    <EpisodeCard :episode="episode" :isAuthenticated="true" />
  </div>
</template>

<script>
export default {
  props: {
    episode: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
