<template>
  <div>
    <button v-if="wallet.isConnected" @click="disconnect">Disconnect</button>
    <button v-else @click="connect">Connect</button>
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
