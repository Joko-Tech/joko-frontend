<template>
  <div class="c-tokencard c-tokencard--gallery">
    <div class="c-tokencard__image" :class="`c-tokencard__image--${size}`">
      <img :src="token.image" :alt="token.name" />
      <div class="c-tokencard__prompt"></div>
      <div class="c-tokencard__overlay">
        <div class="c-tokencard__overlay__button">
          <ButtonComponent @click="showTokenModal">See Details</ButtonComponent>
        </div>
      </div>
    </div>
    <div class="c-tokencard__info">
      <div class="c-tokencard__info__edition">
        <div class="c-tokencard__name">{{ token.name }}</div>
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
      default: "auto",
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
