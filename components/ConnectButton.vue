<template>
  <div class="c-nav__userarea">
    <ButtonComponent v-if="wallet.isConnected" @click="disconnect" noAnimate renderAs="div">
      {{ shortenAddress(wallet.address) }}
    </ButtonComponent>
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
      wallet: "wallet",
    }),
  },

  methods: {
    connect() {
      console.log("connect");
      this.$store.dispatch("connectWallet");
    },
    disconnect() {
      this.$store.dispatch("disconnectWallet");
    },
  },
};
</script>

<style lang="scss" scoped></style>
