<template>
  <div class="c-tokencard c-tokencard--gallery">
    <div
      class="c-tokencard__image"
      :class="`c-tokencard__image--${size}`"
      :style="`--width: ${image.aspect.width}; --height: ${image.aspect.height}`"
      ref="tokenImage"
    >
      <img
        :pre-src="getImageHash(image.uri)"
        :alt="token.name"
        v-if="!isVideo"
      />
      <video
        v-else
        :pre-src="getImageHash(image.uri)"
        autoplay
        preload="auto"
        muted
        loop
        playsinline
      />

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
      </div>
      <div class="c-tokencard__artist">
        Art by
        <a :href="pixelArtistUrl" target="_blank" rel="noopener noreferrer">
          {{ pixelArtist }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import LazyLoader from "~/js/components/ImageLazyLoader";
export default {
  props: {
    pageType: {
      type: String,
      required: true,
      default: "userPage",
    },
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
  mounted() {
    new LazyLoader(this.$refs.tokenImage);
  },
  computed: {
    image() {
      const displayImage = this.token?.formats[1];
      const aspectArray = displayImage.dimensions?.value.split("x");

      if (this.isVideo) {
        return {
          uri: displayImage.uri,
          aspect: {
            width: 16,
            height: 9,
          },
        };
      }

      if (!aspectArray) {
        return {
          uri: displayImage.uri,
          aspect: {
            width: 1,
            height: 1,
          },
        };
      }

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
    isVideo() {
      return this.token.formats[1].mimeType === "video/mp4";
    },
    pixelArtist() {
      return this.token.creators[1].split(" ")[0];
    },
    pixelArtistUrl() {
      return this.token.creators[1].split(" ")[1];
    },
  },
  methods: {
    showTokenModal() {
      const token = {
        ...this.token,
        image: this.image,
        isVideo: this.isVideo,
        pixelArtist: this.pixelArtist,
        pixelArtistUrl: this.pixelArtistUrl,
        type: this.pageType,
      };
      this.$store.commit("token/updateCurrentModalToken", token);
      this.$store.commit("token/updateIsTokenModalOpen", true);
    },
  },
};
</script>

<style lang="scss" scoped></style>
