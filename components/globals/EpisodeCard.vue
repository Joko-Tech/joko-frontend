<template>
  <div class="c-episode__card">
    <div class="c-episode__header">
      <div class="c-episode__header__inner">
        <div class="c-episode__number">{{ episode.artistName }}</div>
        <div class="c-episode__line" data-animation="in-view">
          <span> &nbsp; - &nbsp;</span>
        </div>
        <h2 class="c-episode__artist">
          <!-- {{ episode.episodeName }} -->
          Choices
        </h2>
      </div>
    </div>

    <div>
      <div class="c-episode__main c-episode__desktopitems">
        <div class="c-episode__coverimage">
          <!-- <img :src="episode.image" :alt="episode.artist" /> -->
          <img
            src="https://res.cloudinary.com/dmwfd0zhh/image/upload/q_auto,f_auto/v1659114681/Joko Test/Lojay_Cover_odngka.jpg"
            :alt="episode.artistName"
          />
        </div>
        <!-- <div class="c-episode__overlay cover" /> -->
        <div class="c-episode__content cover">
          <div class="c-episode__content__inner">
            <div class="c-episode__artist">
              {{ episode.artistname }}
            </div>

            <div class="c-episode__description">
              {{ description }}
            </div>

            <div class="c-episode__controls">
              <ButtonComponent size="large" @click="showVideoModal">
                Preview
              </ButtonComponent>
              <!-- <ButtonComponent
                size="large"
                icon="play"
                v-if="isAuthenticatedVideo"
                filled
                :href="`/episode/${slugify(episode.artistName)}`"
              >
                Watch full episode
              </ButtonComponent> -->
              <ButtonComponent
                size="large"
                icon="play"
                @click="checkIfAuthenticated"
                filled
              >
                Watch full episode
              </ButtonComponent>
              <!-- <div v-else class="c-episode__prompt">
                <ButtonComponent
                  size="large"
                  buttonType="icon"
                  icon="lock"
                  noAnimate
                  renderAs="div"
                />
                <p class="c-episode__prompt__message">
                  You need a token to watch the full episode.
                </p>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="c-episode__mobileitems">
        <p class="c-desc">
          {{ truncatedDescription }}
          <button
            class="c-desc__more"
            v-if="description.length !== truncatedDescription.length"
            @click="showFullText"
          >
            Read More
          </button>
        </p>

        <div class="c-episode__controls">
          <ButtonComponent size="large" @click="showVideoModal">
            Preview
          </ButtonComponent>
          <ButtonComponent
            size="large"
            icon="play"
            v-if="isAuthenticatedVideo"
            filled
            :href="`/episode/${slugify(episode.artistName)}`"
          >
            Watch full episode
          </ButtonComponent>
          <div v-else class="c-episode__prompt">
            <ButtonComponent
              size="large"
              buttonType="icon"
              icon="lock"
              noAnimate
              renderAs="div"
            />
            <p class="c-episode__prompt__message">
              You need a token to watch the full episode.
            </p>
          </div>
        </div>
      </div>
    </div>

    <Toast :show-toast="toastState.show" :toast-state="toastState.type">
      {{ toastState.message }}
    </Toast>
  </div>
</template>

<script>
import { truncateText } from "~/utils/formatters";
import { toastMixin } from "~/mixins/toast";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isTextShortened: true,
      description: `Born in April, 1996, Kelvin Nnamdi Odenigbo better known as Lojay is a Nigerian singer and songwriter. He came into limelight after featuring Wizkid in his debut EP ‘LV N ATTN’. Having developed interests in music at a very young age, Lojay released Ariel in October 2019. He featured superstar singer, Sarz in his hit single Tonongo and Monalisa, as well as worked with other artists like Wizkid.`,
    };
  },
  mixins: [toastMixin],
  props: {
    episode: {
      type: Object,
      required: true,
    },
    isAuthenticatedVideo: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  computed: {
    truncatedDescription() {
      return this.isTextShortened
        ? truncateText(this.description, 139)
        : this.description;
    },
    ...mapGetters({
      wallet: "wallet/wallet",
    }),
  },
  methods: {
    showVideoModal() {
      this.$store.commit("updateIsVideoModalOpen", true);
    },
    showFullText() {
      this.isTextShortened = false;
    },
    checkIfAuthenticated() {
      if (this.wallet.isConnected) {
        const isAuthenticatedVideo = this.$store.dispatch(
          "wallet/isAuthenticatedVideo",
          this.episode.artistName
        );
        isAuthenticatedVideo.then((value) => {
          if (value) {
            this.$router.push(`/episode/${this.episode.artistName}`);
          } else {
            this.showToast({
              message: "You need a token to watch the full episode.",
              autoHideDuration: 3000,
              type: "error",
            });
          }
        });
      } else {
        this.showToast({
          message: "You need to connect your wallet to watch the full episode.",
          autoHideDuration: 3000,
          type: "error",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
