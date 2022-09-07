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
          <div class="c-user__tokenarea__number">3</div>
        </div>
      </section>
    </div>
    <div v-else>Please, connect your wallet</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      wallet: "wallet",
    }),
  },
};
</script>

<style lang="scss" scoped></style>
