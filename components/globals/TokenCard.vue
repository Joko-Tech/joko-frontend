<template>
  <div class="c-tokencard">
    <div
      class="c-tokencard__image"
      ref="tokenImage"
      :class="`c-tokencard__image--${size}`"
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

      <div v-if="this.token.tier !== 1" class="c-tokencard__bottom">
        <div class="c-tokencard__price">
          <div class="c-tokencard__price__label">Price</div>
          <div class="c-tokencard__price__amount">
            <span>{{ price }}</span> <span><TezosIcon /></span>
          </div>
        </div>
        <ButtonComponent @click="mintToken">Mint</ButtonComponent>
      </div>
      <div v-if="this.token.tier === 1" class="c-tokencard__bottom">
        <div class="c-tokencard__price">
          <div class="c-tokencard__price__label">Time Left</div>
          <div class="c-tokencard__price__amount">
            <p class="auction"></p>
          </div>
        </div>
        <div class="c-tokencard__price">
          <div class="c-tokencard__price__label">Highest bid</div>
          <div class="c-tokencard__price__amount">
            <span>{{ highestBidXtz }}</span> <span><TezosIcon /></span>
          </div>
        </div>
        <ButtonComponent @click="bid">Bid</ButtonComponent>
      </div>
    </div>

    <Toast :show-toast="toastState.show" :toast-state="toastState.type">
      {{ toastState.message }}
    </Toast>
  </div>
</template>

<script>
import LazyLoader from "~/js/components/ImageLazyLoader";
import { toastMixin } from "~/mixins/toast";
import { mapGetters } from "vuex";

export default {
  mixins: [toastMixin],
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
  data() {
    return {
      highestBidXtz: null,
      auctionUrl: null,
      auctionStartTime: null,
      auctionEndTime: null,
    };
  },
  mounted() {
    new LazyLoader(this.$refs.tokenImage);
    if (this.token.tier === 1) {
      this.fetchAuction();
      this.fetchInterval = setInterval(() => {
        this.fetchAuctionBid();
      }, 60000);
    };
  },
  computed: {
    ...mapGetters({
      wallet: "wallet/wallet",
    }),

    image() {
      const displayImage = this.token.formats[1];
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
        isVideo: this.isVideo,
        pixelArtist: this.pixelArtist,
        pixelArtistUrl: this.pixelArtistUrl,
        type: "mint",
      };

      this.$store.commit("token/updateCurrentModalToken", token);
      this.$store.commit("token/updateIsTokenModalOpen", true);
    },
    async mintToken() {
      const payload = {
        pixel_artist: this.pixelArtist,
        artist: this.token.artist,
        price: this.price,
      };

      if (!this.wallet.isConnected) {
        this.showToast({
          message: "Please connect your wallet",
          type: "error",
          autoHideDuration: 3000,
        });
        return;
      }

      this.showToast({
        message: "Minting token...",
        type: "info",
      });

      try {
        if (this.token.tier === 1) {
          await this.$store.dispatch("wallet/mintTier1", payload);

          this.showToast({
            message: "Token minted successfully",
            type: "success",
            autoHideDuration: 3000,
          });
        }

        if (this.token.tier === 2) {
          await this.$store.dispatch("wallet/mintTier2", payload);

          this.showToast({
            message: "Token minted successfully",
            type: "success",
            autoHideDuration: 3000,
          });
        }

        if (this.token.tier === 3) {
          await this.$store.dispatch("wallet/mintTier3", payload);

          this.showToast({
            message: "Token minted successfully",
            type: "success",
            autoHideDuration: 3000,
          });
        }
      } catch (error) {
        this.showToast({
          message: "Error minting token",
          type: "error",
          autoHideDuration: 3000,
        });
      }
    },
    bid() {
      window.open(this.auctionUrl, '_blank');
    },
    updateTimer() {
      // Set the date we're counting down to
      var countDownDate = new Date(this.auctionEndTime).getTime();

      // Update the count down every 1 second
      var x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        document.getElementById("auction").innerHTML = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";

        // If the count down is finished, write some text
        if (distance < 0) {
          clearInterval(x);
          document.getElementById("auction").innerHTML = "AUCTION ENDED";
        }
      }, 1000);
    },
    async fetchAuction() {
      if (this.token.tier === 1) {
        const payload = {
          tier: this.token.tier,
          artist: this.token.artist,
        };
        const tokenIds = await this.$store.dispatch("fetchTokenId", payload);
        const auction = await this.$store.dispatch("token/fetchEnglishAuction", {tokenIds: tokenIds});

        if(auction.length) {

          this.auctionStartTime = auction[0].start_time;
          this.auctionEndTime = auction[0].end_time;
          this.highestBidXtz = auction[0].highest_bid_xtz / Math.pow(10, 6);
          this.auctionUrl = "https://objkt.com/auction/e/" + auction[0].hash;
        }
        else {
          this.highest_bid_xtz = auction[0]?.highest_bid_xtz / Math.pow(10, 6);
        }
        // Set the date we're counting down to

        var countDownDate = new Date(this.auctionEndTime).getTime();

        // Update the count down every 1 second
        var x = setInterval(function() {

          // Get today's date and time
          var now = new Date().getTime();

          // Find the distance between now and the count down date
          var distance = countDownDate - now;

          // Time calculations for days, hours, minutes and seconds
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);

          // Display the result in the element with id="demo"
          var timers = document.getElementsByClassName("auction");
          Array.prototype.forEach.call(timers, function(timer) {
              timer.innerHTML = days + "d " + hours + "h "
                              + minutes + "m " + seconds + "s ";
          });
          

          // If the count down is finished, write some text
          if (distance < 0) {
            clearInterval(x);
            Array.prototype.forEach.call(timers, function(timer) {
              timer.innerHTML = "Auction Ended"
          });
          }
        }, 1000);
      }
    },
    async fetchAuctionBid() {
      if (this.token.tier === 1) {
        const payload = {
          tier: this.token.tier,
          artist: this.token.artist,
        };
        const tokenIds = await this.$store.dispatch("fetchTokenId", payload);
        const auction = await this.$store.dispatch("token/fetchEnglishAuction", {tokenIds: tokenIds});

        if(auction.length && new Date() - new Date(auction[0].end_time) <= 0) {
          this.highestBidXtz = auction[0].highest_bid_xtz / Math.pow(10, 6);
        }
        else {
          this.highestBidXtz = auction[0].highest_bid_xtz / Math.pow(10, 6);
        }
      } 
    },
    
  },
};
</script>

<style lang="scss" scoped></style>
