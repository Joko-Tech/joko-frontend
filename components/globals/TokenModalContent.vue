<template>
  <div class="c-modal--token">
    <div class="c-modal--token__imagecon">
      <div
        class="c-modal--token__image"
        :style="`--width: ${token.image.aspect.width}; --height: ${token.image.aspect.height}`"
      >
        <img
          src="https://res.cloudinary.com/dmwfd0zhh/image/upload/v1659430390/Joko%20Test/Test_token_wbznbf.png"
          :alt="token.name"
        />
      </div>
    </div>
    <div class="c-modal--token__content">
      <div class="c-content">
        <div class="c-content__label">You own 1</div>
        <div class="c-content__name">
          {{ token.name }}
        </div>
        <div class="c-content__artist">
          Art by
          <a
            href="https://www.artstation.com/artwork/5ZQZQ"
            target="_blank"
            rel="noopener noreferrer"
          >
            <!-- :href="token.pixelArtistUrl" -->
            <!-- {{ token.pixelArtist }} -->
            Daniel Picasso
          </a>
        </div>
        <div class="c-content__description">
          {{ token.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      token: "token/currentModalToken",
    }),
  },
};
</script>

<style lang="scss" scoped></style>
