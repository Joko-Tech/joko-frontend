<template>
  <div class="c-modal--token">
    <div class="c-modal--token__imagecon">
      <div
        class="c-modal--token__image"
        :style="`--width: ${token.image.aspect.width}; --height: ${token.image.aspect.height}`"
      >
        <img
          v-if="!token.isVideo"
          :src="getImageHash(token.image.uri)"
          :alt="token.name"
        />
        <video
          v-else
          :src="getImageHash(token.image.uri)"
          preload="auto"
          controls
        />
      </div>
    </div>
    <div class="c-modal--token__content">
      <div class="c-content">
        <!-- <div class="c-content__label">You own 1</div> -->
        <div class="c-content__name">
          {{ token.name }}
        </div>
        <div class="c-content__artist">
          Art by
          <a
            :href="token.pixelArtistUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ token.pixelArtist }}
          </a>
        </div>
        <div class="c-content__description">
          {{ token.description }}
        </div>

        <div class="c-content__panel">
          <div class="c-content__panel__info">
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

            <div class="c-content__market" v-if="token.type === 'gallery'">
              <div class="c-content__market__label">Lowest ask</div>
              <div class="c-content__market__amount">
                <span>
                  {{ lowestAsk ? lowestAsk : "N/A" }}
                </span>
                <span class="c-content__market__amount__icon"
                  ><TezosIcon
                /></span>
              </div>
            </div>

            <div class="c-content__market" v-if="token.type === 'gallery'">
              <div class="c-content__market__label">Highest bid</div>
              <div class="c-content__market__amount">
                <span>
                  {{ highestBid ? highestBid : "N/A" }}
                </span>
                <span class="c-content__market__amount__icon"
                  ><TezosIcon
                /></span>
              </div>
            </div>

            <div class="c-content__market" v-if="token.type === 'gallery'">
              <div class="c-content__market__label">Last price</div>
              <div class="c-content__market__amount">
                <span>
                  {{ lastSale ? lastSale : "N/A" }}
                </span>
                <span class="c-content__market__amount__icon"
                  ><TezosIcon
                /></span>
              </div>
            </div>
          </div>

          <ButtonComponent
            size="large"
            filled
            v-if="token.type === 'gallery'"
            :href="raribleUrl"
          >
            <span v-if="highestBid && !isUserToken">Bid</span>
            <span
              v-if="
                (!highestBid && lowestAsk && !isUserToken) ||
                (!highestBid && !lowestAsk && !isUserToken)
              "
              >Buy</span
            >
            <span v-if="isUserToken">Sell</span>
          </ButtonComponent>
          <ButtonComponent
            size="large"
            filled
            v-if="token.type === 'mint'"
            @click="mintToken"
          >
            Mint
          </ButtonComponent>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      lowestAsk: null,
      highestBid: null,
      lastSale: null,
      raribleUrl: null,
      baseURL: "http://15.207.106.83/api/rest/",
    };
  },
  computed: {
    ...mapGetters({
      token: "token/currentModalToken",
      walletTokens: "wallet/walletTokens",
    }),
    isUserToken() {
      return this.walletTokens.some(
        (walletToken) => walletToken.tokenId === this.token.tokenId
      );
    },
  },
  mounted() {
    if (this.token.type === "gallery") {
      this.fetchAsk();
      this.fetchBid();
      this.fetchSale();
      this.fetchMint();

      this.fetchInterval = setInterval(() => {
        this.fetchAsk();
        this.fetchBid();
        this.fetchSale();
      }, 5000);
    }
  },
  destroyed() {
    clearInterval(this.fetchInterval);
  },
  methods: {
    async fetchAsk() {
      const res = await this.$axios.$get(
        `${this.baseURL}sellv2?_tokenId=${this.token.tokenId}`
      );

      if (res.sell.length) {
        this.lowestAsk = res.sell[0].saleAmount;
      } else {
        this.lowestAsk = null;
      }
    },

    async fetchBid() {
      const res = await this.$axios.$get(
        `${this.baseURL}bid?id=${this.token.tokenId}`
      );

      if (res.bidByPk) {
        this.highestBid = Number(res.bidByPk.price).toFixed(2);
      } else {
        this.highestBid = null;
      }
    },

    async fetchSale() {
      const res = await this.$axios.$get(
        `${this.baseURL}lastSale?id=${this.token.tokenId}`
      );

      if (res.lastSaleByPk) {
        this.lastSale = Number(res.lastSaleByPk.amount).toFixed(2);
      } else {
        this.lastSale = null;
      }
    },

    async fetchMint() {
      const res = await this.$axios.$get(
        `${this.baseURL}mint?id=${this.token.tokenId}`
      );

      if (res.mintByPk) {
        this.raribleUrl = res.mintByPk.raribleUrl;
      } else {
        this.raribleUrl = null;
      }
    },

    mintToken() {
      const payload = {
        pixel_artist: this.token.pixelArtist,
        artist: this.token.artist,
      };

      if (this.token.tier === 2) {
        this.$store.dispatch("wallet/mintTier2", payload);
      }

      if (this.token.tier === 3) {
        this.$store.dispatch("wallet/mintTier3", payload);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
