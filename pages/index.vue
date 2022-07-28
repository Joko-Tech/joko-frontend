<template>
  <div>
    <h1>Hello Tezos</h1>
    <ConnectButton />
    <button @click="addArtist">Add Artist</button>
    <TokenCard tokenId="1" />
  </div>
</template>

<script>
export default {
  name: "IndexPage",
  methods: {
    addArtist() {
      this.$store.dispatch("addNewArtist");
    },
  },
};
</script>

<style lang="scss"></style>
