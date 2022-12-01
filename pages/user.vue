<template>
  <div class="c-user">
    <div v-if="wallet.isConnected">
      <section class="c-user__hero">
        <div class="c-user__avatar">
          <img :src="generateIconSrc(wallet.address)" :alt="wallet.address" />
        </div>
        <div class="c-user__address">
          {{ shortenAddress(wallet.address) }}
        </div>
      </section>
      <section class="c-user__tokenarea">
        <div class="c-user__tokenarea__header">
          <h1 class="c-user__tokenarea__title">Your Tokens</h1>
          <div class="c-user__tokenarea__number">
            {{ walletTokens.length }}
          </div>
        </div>
        <div class="c-user__tokenarea__main">
          <div class="c-masonry" data-masonry>
            <TokenGalleryCard
              v-for="(token, index) in walletTokens"
              :key="index"
              :token="token"
              data-masonry-item
              :data-index="index"
            />
          </div>
        </div>
      </section>
    </div>
    <div v-else>Please, connect your wallet</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Masonry from "~/js/components/Masonry";

export default {
  data() {
    return {
      isLoading: true,
    };
  },
  async mounted() {
    this.isLoading = true;
    this.setMasonry();
  },
  computed: {
    ...mapGetters({
      wallet: "wallet/wallet",
      walletTokens: "wallet/walletTokens",
    }),
  },
  methods: {
    setMasonry() {
      if (this.walletTokens && this.walletTokens.length) {
        // next tick
        this.$nextTick(() => {
          this.masonry = new Masonry({ element: this.$el });
        });
      }
    },
  },
  watch: {
    walletTokens: {
      handler: function () {
        this.setMasonry();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
