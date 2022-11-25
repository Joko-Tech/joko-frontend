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
            {{ modifiedTokens.length }}
          </div>
        </div>
        <div class="c-user__tokenarea__main">
          <div class="c-masonry" data-masonry>
            <TokenGalleryCard
              v-for="(token, index) in modifiedTokens"
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
import { fa2ContractAddress } from "~/utils/network";
import Masonry from "~/js/components/Masonry";

export default {
  data() {
    return {
      isLoading: true,
      modifiedTokens: [],
    };
  },
  async mounted() {
    this.isLoading = true;

    if (this.wallet.isConnected) {
      this.fetchUserTokens();
    }
  },
  computed: {
    ...mapGetters({
      wallet: "wallet/wallet",
    }),
  },
  methods: {
    async fetchUserTokens() {
      try {
        const res = await this.$axios.$get(
          `https://api.mainnet.tzkt.io/v1/tokens/balances/?account=${this.wallet.address}&token.contract=${fa2ContractAddress}`
        );

        this.isLoading = false;

        this.modifiedTokens = res.map((token) => {
          return {
            ...token.token.metadata,
            tokenId: token.token.tokenId,
          };
        });

        console.log(this.modifiedTokens);

        if (res.length) {
          this.$store.commit("wallet/updateWalletTokens", this.modifiedTokens);
          // next tick
          this.$nextTick(() => {
            this.masonry = new Masonry({ element: this.$el });
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    wallet: {
      handler: function (val) {
        if (val.isConnected) {
          this.fetchUserTokens();
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
