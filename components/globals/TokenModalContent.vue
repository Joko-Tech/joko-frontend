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

            <div class="c-content__market" v-if="token.type === 'gallery' | token.type === 'userPage'">
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

            <div class="c-content__market" v-if="token.type === 'gallery' | token.type === 'userPage'">
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

            <div class="c-content__market" v-if="token.type === 'gallery' | token.type === 'userPage'">
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
          <div v-if="token.type === 'gallery' || token.type === 'userPage'">
            <ButtonComponent
              size="large"
              filled
              :href="lowestAskUrl"
              v-if="highestBid && !isUserToken">
              <span>Bid</span>
            </ButtonComponent>
            <ButtonComponent
              size="large"
              filled
              v-if="
                (!highestBid && lowestAsk && !isUserToken) ||
                (!highestBid && !lowestAsk && !isUserToken)
              "
              :href="lowestAskUrl">
              <span>Buy</span>
            </ButtonComponent>
            <ButtonComponent
              size="large"
              filled
              v-if="isUserToken" :href="highestBidUrl">
              <span>Sell</span>
            </ButtonComponent>
          </div>
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
const ternaryOperation = (condition, value1, value2) => {
  return condition ? value1 : value2;
}
export default {
  data() {
    return {
      lowestAskTokenId: null,
      lowestAskSite: null,
      lowestAsk: null,
      lowestAskUrl: null,
      highestBid: null,
      lastSale: null,
      raribleUrl: null,
      highestBidUrl: null,
      baseURL: "http://dipdup.playjoko.com/api/rest/",
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
      this.fetchAsk().then((result) => {
        this.fetchMint();
      });;
      this.fetchBid();
      this.fetchSale();

      this.fetchInterval = setInterval(() => {
        this.fetchAsk();
        this.fetchBid();
        this.fetchSale();
      }, 10000);
    };
    if (this.token.type === "userPage") {
      this.fetchAskByTokenId().then((result) => {
        this.fetchMintByTokenId();
      });
      this.fetchBidByTokenId();
      this.fetchSaleByTokenId();

      this.fetchInterval = setInterval(() => {
        this.fetchAskByTokenId();
        this.fetchBidByTokenId();
        this.fetchSaleByTokenId();
      }, 10000);
    }
  },
  destroyed() {
    clearInterval(this.fetchInterval);
  },
  methods: {
    async fetchAsk() {
      const askObjkts = await this.$store.dispatch("token/fetchAsk", { tokenIds: this.token.tokenIds });

      const askRarible = await this.$store.dispatch("token/fetchSell", { tokenIds: this.token.tokenIds });

      if (askObjkts.length && askRarible.length) {
        this.lowestAsk = ternaryOperation(askObjkts[0].amount < askRarible[0].saleAmount, askObjkts[0].amount, askRarible[0].saleAmount);
        this.lowestAskTokenId = ternaryOperation(askObjkts[0].amount < askRarible[0].saleAmount, askObjkts[0].tokenId, askRarible[0].tokenId);
        this.lowestAskSite = ternaryOperation(askObjkts[0].amount < askRarible[0].saleAmount, "Objkts", "Rarible");
      } else if (askObjkts.length || askRarible.length) {
        this.lowestAsk = ternaryOperation(askObjkts.length, askObjkts[0]?.amount, askRarible[0]?.saleAmount);
        this.lowestAskTokenId = ternaryOperation(askObjkts.length, askObjkts[0]?.tokenId, askRarible[0]?.tokenId);
        this.lowestAskSite = ternaryOperation(askObjkts.length, "Objkts", "Rarible");
      } else {
        this.lowestAsk = null;
        this.lowestAskTokenId = null;
        this.lowestAskSite = null;
      }
    },

    async fetchBid() {
      const res = await this.$store.dispatch("token/fetchBid", {tokenIds: this.token.tokenIds});

      if (res.length) {
        this.highestBid = res[0].price;
        this.highestBidTokenId = res[0].tokenId;
        this.higestBidSite = "Objkts";
      } else {
        this.highestBid = null;
        this.highestBidTokenId = null;
        this.higestBidSite = null;
      }
    },

    async fetchSale() {
      const saleObjkts = await this.$store.dispatch("token/fetchSale", { tokenIds: this.token.tokenIds }); 

      const saleRarible = await this.$store.dispatch("token/fetchBuy", { tokenIds: this.token.tokenIds });

      if (saleRarible.length && saleObjkts.length) {
        this.lastSale = saleObjkts[0].amount < saleRarible[0].buyAmount ? 
                          saleObjkts[0].amount :
                          saleRarible[0].buyAmount;
      } else if (saleObjkts.length || saleRarible.length) {
        this.lastSale = saleObjkts.length ? saleObjkts[0].amount : saleRarible[0].buyAmount;
      } else {
        this.lastSale = null;
      }
    },

    async fetchMint() {
      const lowestAsk = await this.$store.dispatch("token/fetchMint", {tokenIds: [this.lowestAskTokenId]});
      const highestBid = await this.$store.dispatch("token/fetchMint", {tokenIds: [this.highestBidTokenId]});

      if (lowestAsk.length) {
        this.lowestAskUrl = this.lowestAskSite === "Objkts" ? lowestAsk[0].objktsUrl : lowestAsk[0].raribleUrl;
      } else {
        this.lowestAskUrl = null;
      }
      if (highestBid.length) {
        this.highestBidUrl = highestBid[0].objktsUrl;
      } else {
        this.highestBidUrl = null;
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

    async fetchMintByTokenId() {
      const res = await this.$store.dispatch("token/fetchMint", {tokenIds: [this.lowestAskTokenId]});

      if (res.length) {
        this.lowestAskUrl = this.lowestAskSite === "Objkts" ? res[0].objktsUrl : res[0].raribleUrl;
        this.highestBidUrl = res[0].objktsUrl;
      } else {
        this.lowestAskUrl = null;
        this.highestBidUrl = res[0].objktsUrl;
      }
    },

    async fetchAskByTokenId() {
      const askObjkts = await this.$store.dispatch("token/fetchAsk", { tokenIds: [this.token.tokenId] });

      const askRarible = await this.$store.dispatch("token/fetchSell", { tokenIds: [this.token.tokenId] });

      if (askObjkts.length && askRarible.length) {
        this.lowestAsk = ternaryOperation(askObjkts[0].amount < askRarible[0].saleAmount, askObjkts[0].amount, askRarible[0].saleAmount);
        this.lowestAskTokenId = ternaryOperation(askObjkts[0].amount < askRarible[0].saleAmount, askObjkts[0].tokenId, askRarible[0].tokenId);
        this.lowestAskSite = ternaryOperation(askObjkts[0].amount < askRarible[0].saleAmount, "Objkts", "Rarible");
      } else if (askObjkts.length || askRarible.length) {
        this.lowestAsk = ternaryOperation(askObjkts.length, askObjkts[0]?.amount, askRarible[0]?.saleAmount);
        this.lowestAskTokenId = ternaryOperation(askObjkts.length, askObjkts[0]?.tokenId, askRarible[0]?.tokenId);
        this.lowestAskSite = ternaryOperation(askObjkts.length, "Objkts", "Rarible");
      } else {
        this.lowestAsk = null;
        this.lowestAskTokenId = null;
        this.lowestAskSite = null;
      }
    },

    async fetchBidByTokenId() {
      const res = await this.$store.dispatch("token/fetchBid", {tokenIds: [this.token.tokenId]});
      if (res.length) {
        this.highestBid = res[0].price;
      } else {
        this.highestBid = null;
      }
    },

    async fetchSaleByTokenId() {
      const saleObjkts = await this.$store.dispatch("token/fetchSale", { tokenIds: [this.token.tokenId] }); 

      const saleRarible = await this.$store.dispatch("token/fetchBuy", { tokenIds: [this.token.tokenId] });

      if (saleRarible.length && saleObjkts.length) {
        this.lastSale = saleObjkts[0].amount < saleRarible[0].buyAmount ? 
                          saleObjkts[0].amount :
                          saleRarible[0].buyAmount;
      } else if (saleObjkts.length || saleRarible.length) {
        this.lastSale = saleObjkts.length ? saleObjkts[0].amount : saleRarible[0].buyAmount;
      } else {
        this.lastSale = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
