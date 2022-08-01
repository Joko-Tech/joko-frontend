<template>
  <div class="c-episode__card">
    <div class="c-episode__header">
      <div class="c-episode__header__inner">
        <div class="c-episode__number">EP- {{ episode.number }}</div>
        <div class="c-episode__line"></div>
        <h2 class="c-episode__artist">
          {{ episode.artist }}
        </h2>
      </div>
    </div>

    <div class="c-episode__main">
      <div class="c-episode__coverimage">
        <img :src="episode.image" :alt="episode.artist" />
      </div>
      <!-- <div class="c-episode__overlay cover" /> -->
      <div class="c-episode__content cover">
        <div class="c-episode__content__inner">
          <div class="c-episode__artist">
            {{ episode.artist }}
          </div>

          <div class="c-episode__description">
            {{ episode.description }}
          </div>

          <div class="c-episode__controls">
            <ButtonComponent size="large">Preview</ButtonComponent>
            <ButtonComponent
              size="large"
              icon="play"
              v-if="isAuthenticated"
              filled
            >
              Watch full episode
            </ButtonComponent>
            <div v-else class="c-episode__prompt">
              <ButtonComponent
                size="large"
                buttonType="icon"
                icon="lock"
                noAnimate
                renderAs="div"
              />
              <p class="c-episode__prompt__message">
                You need a token to watch the full episode.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    episode: {
      type: Object,
      required: true,
    },
    isAuthenticated: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped></style>
