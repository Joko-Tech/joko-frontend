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
    <Modal
      title="video modal"
      description="a modal showing a video"
      v-if="isVideoModalOpen"
      @close="hideVideoModal"
      ref="videoModal"
      class="c-modal--video"
    >
      <div class="c-modal--video__content">
        <div class="c-modal--video__content__video">
          <video
            src="https://res.cloudinary.com/dmwfd0zhh/video/upload/v1645290917/Pith%20Africa/PITH-_JFE_compressed_xjx09l.mp4"
            poster="https://res.cloudinary.com/dmwfd0zhh/image/upload/q_auto,f_auto/v1645453390/Pith%20Africa/Screenshot_2022-02-21_at_3.21.43_PM_xx2lrw.jpg"
            preload="auto"
            controls
          />
        </div>
      </div>
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
      isVideoModalOpen: "isVideoModalOpen",
      wallet: "wallet/wallet",
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
    hideVideoModal() {
      this.$store.commit("updateIsVideoModalOpen", false);
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
    "$store.state.isVideoModalOpen": function (newState, oldState) {
      if (newState) {
        setTimeout(() => {
          const videoModalRef = this.$refs.videoModal;
          videoModalRef.focus();
        }, 0);
      }
    },
    wallet: {
      handler: function (val) {
        if (val.isConnected) {
          this.$store.dispatch("wallet/fetchUserTokens");
        }
      },
      deep: true,
    },
  },
};
</script>
