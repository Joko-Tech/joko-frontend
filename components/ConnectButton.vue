<template>
  <div>
    <ButtonComponent v-if="wallet.isConnected" @click="disconnect">
      Disconnect
    </ButtonComponent>
    <ButtonComponent v-else @click="connect">Connect</ButtonComponent>
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
