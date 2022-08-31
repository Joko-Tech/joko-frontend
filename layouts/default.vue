<template>
  <div class="c-layout">
    <Modal
      title="token modal"
      description="a modal showing more details of a specific token"
      v-show="isTokenModalOpen"
      @close="hideTokenModal"
      ref="tokenModal"
      class="c-modal--token"
    >
      <TokenModalContent v-if="currentModalToken" />
    </Modal>
    <div class="c-pages">
      <NavComponent />
      <div class="c-main"><Nuxt /></div>
    </div>
    <FooterComponent />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      isTokenModalOpen: "token/isTokenModalOpen",
      currentModalToken: "token/currentModalToken",
    }),
  },

  mounted() {
    // this.$store.dispatch("fetchAllMetadata");
  },

  methods: {
    hideTokenModal() {
      this.$store.commit("token/updateIsTokenModalOpen", false);

      setTimeout(() => {
        this.$store.commit("token/updateCurrentModalToken", null);
      }, 300);
    },
  },

  watch: {
    "$store.state.token.isTokenModalOpen": function (newState, oldState) {
      if (newState) {
        setTimeout(() => {
          const tokenModalRef = this.$refs.tokenModal;

          tokenModalRef.focus();
        }, 0);
      }
    },
  },
};
</script>
