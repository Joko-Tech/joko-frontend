<template>
  <div class="c-tokencard"></div>
</template>

<script>
export default {
  props: {
    tokenId: {
      type: String,
      required: true,
    },
  },
  methods: {
    getTokenMetaData() {
      console.log(this.tokenId);
    },
  },
};
</script>

<style lang="scss" scoped></style>
