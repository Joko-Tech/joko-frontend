<template>
  <div class="c-tokencard">
    <div
      class="c-tokencard__image"
      ref="tokenImage"
      :class="`c-tokencard__image--${size}`"
    >
      <img :pre-src="getImageHash(image.uri)" :alt="token.name" />
      <div class="c-tokencard__prompt" />
      <div class="c-skeleton__item" />
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
        <a :href="pixelArtistUrl" target="_blank" rel="noopener noreferrer">
          {{ pixelArtist }}
        </a>
      </div>

      <div class="c-tokencard__bottom">
        <div class="c-tokencard__price">
          <div class="c-tokencard__price__label">Price</div>
          <div class="c-tokencard__price__amount">
            <span>{{ price }}</span> <span><TezosIcon /></span>
          </div>
        </div>
        <ButtonComponent @click="mintToken">Mint</ButtonComponent>
      </div>
    </div>
  </div>
</template>

<script>
import LazyLoader from "~/js/components/ImageLazyLoader";
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
  mounted() {
    new LazyLoader(this.$refs.tokenImage);
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
    pixelArtist() {
      return this.token.creators[1].split(" ")[0];
    },
    pixelArtistUrl() {
      return this.token.creators[1].split(" ")[1];
    },
    price() {
      if (this.token.tier === 1) {
        return 30;
      }
      if (this.token.tier === 2) {
        return this.token.tier2_price / Math.pow(10, 6);
      }
      if (this.token.tier === 3) {
        return this.token.tier3_price / Math.pow(10, 6);
      }
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
    mintToken() {
      const payload = {
        pixel_artist: this.pixelArtist,
        artist: this.token.artist,
      };

      if (this.token.tier === 2) {
        this.$store.dispatch("mintTier2", payload);
      }

      if (this.token.tier === 3) {
        this.$store.dispatch("mintTier3", payload);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
