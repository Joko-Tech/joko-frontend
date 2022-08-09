<template>
  <div class="c-tokencard" @click="showTokenModal">
    <div class="c-tokencard__image" :class="`c-tokencard__image--${size}`">
      <img :src="token.image" :alt="token.name" />
      <div class="c-tokencard__prompt"></div>
    </div>
    <div class="c-tokencard__info">
      <div class="c-tokencard__info__edition">
        <div class="c-tokencard__name">{{ token.name }}</div>
        <div class="c-tokencard__edition">
          <span>{{ token.tokenIndex }}/{{ token.tokenCount }}</span>
          <span>
            <ToolTip>Number of tokens in this edition</ToolTip>
          </span>
        </div>
      </div>
      <div class="c-tokencard__artist">
        Art by
        <a
          :href="token.pixelArtistUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ token.pixelArtist }}
        </a>
      </div>

      <div class="c-tokencard__bottom">
        <div class="c-tokencard__price">
          <div class="c-tokencard__price__label">Price</div>
          <div class="c-tokencard__price__amount">
            <span>10</span> <span><TezosIcon /></span>
          </div>
        </div>
        <ButtonComponent>Mint</ButtonComponent>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    token: {
      type: Object,
      required: true,
    },
    size: {
      type: String,
      default: "aspect",
      validator: (s) => ["aspect", "auto"].includes(s),
    },
  },
  methods: {
    getTokenMetaData() {
      console.log(this.token.tokenId);
    },
    showTokenModal() {
      this.$store.commit("token/updateIsTokenModalOpen", true);
    },
  },
};
</script>

<style lang="scss" scoped></style>
