<template>
  <div class="c-modal--token">
    <div class="c-modal--token__imagecon">
      <div
        class="c-modal--token__image"
        :style="`--width: ${token.image.aspect.width}; --height: ${token.image.aspect.height}`"
      >
        <img :src="getImageHash(token.image.uri)" :alt="token.name" />
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

        <div class="c-content__panel">
          <div class="c-content__market">
            <div class="c-content__market__label">Editions</div>
            <div class="c-content__market__edition">
              <!-- <span>{{ token.tokenIndex }}/{{ token.tokenCount }}</span> -->
              <span>1/1</span>
              <span>
                <ToolTip>Number of tokens in this edition</ToolTip>
              </span>
            </div>
          </div>

          <div class="c-content__market">
            <div class="c-content__market__label">Lowest ask</div>
            <div class="c-content__market__amount">
              <span>10</span> <span><TezosIcon /></span>
            </div>
          </div>

          <div class="c-content__market">
            <div class="c-content__market__label">Highest bid</div>
            <div class="c-content__market__amount">
              <span>10</span> <span><TezosIcon /></span>
            </div>
          </div>

          <div class="c-content__market">
            <div class="c-content__market__label">Last price</div>
            <div class="c-content__market__amount">
              <span>10</span> <span><TezosIcon /></span>
            </div>
          </div>

          <ButtonComponent size="large" filled>Sell</ButtonComponent>
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
