<template>
  <div class="c-tokencard">
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
  computed: {
    image() {
      const displayImage = this.token.formats[1];
      const aspectArray = displayImage.dimensions.value.split("x");
      const width = aspectArray[0];
      const height = aspectArray[1];

      return {
        uri: displayImage.uri,
        aspect: {
          width,
          height,
        },
      };
    },
  },
  methods: {
    getTokenMetaData() {
      console.log(this.token.tokenId);
    },
    showTokenModal() {
      const token = {
        ...this.token,
        image: this.image,
      };

      this.$store.commit("token/updateCurrentModalToken", token);
      this.$store.commit("token/updateIsTokenModalOpen", true);
    },
  },
};
</script>

<style lang="scss" scoped></style>
