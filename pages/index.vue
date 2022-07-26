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

<style lang="scss">
body {
  padding: 24px;
}
h1 {
  font-size: 48px;
}
button {
  height: 40px;
  padding: 0 24px;
  border: 1px solid #101010;
  border-radius: 4px;
  margin-bottom: 16px;
}
</style>
