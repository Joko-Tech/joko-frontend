<template>
  <div class="c-nav__userarea">
    <div v-if="wallet.isConnected">
      <ButtonComponent @click="disconnect" noAnimate>
        {{ shortenAddress(wallet.address) }}
      </ButtonComponent>
    </div>

    <ButtonComponent v-else @click="connect" icon="indicator">
      Sync
    </ButtonComponent>
    <nuxt-link to="/user" class="c-avatar" v-if="wallet.isConnected">
      <img :src="generateIconSrc(wallet.address)" :alt="wallet.address" />
    </nuxt-link>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      wallet: "wallet/wallet",
    }),
  },

  methods: {
    connect() {
      this.$store.dispatch("wallet/connectWallet");
    },
    disconnect() {
      this.$store.dispatch("wallet/disconnectWallet");
    },
  },
};
</script>

<style lang="scss" scoped></style>
