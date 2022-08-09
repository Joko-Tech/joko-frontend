<template>
  <div class="c-layout">
    <Modal
      title="token modal"
      description="a modal showing more details of a specific token"
      v-show="isTokenModalOpen"
      @close="hideTokenModal"
      ref="tokenModal"
    >
      Hello Modal
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
    }),
  },

  methods: {
    hideTokenModal() {
      this.$store.commit("token/updateIsTokenModalOpen", false);
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
