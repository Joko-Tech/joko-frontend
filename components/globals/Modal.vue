<template>
  <transition name="modal-fade">
    <div
      ref="modal"
      class="c-modal"
      role="dialog"
      :aria-labelledby="title"
      :aria-describedby="description"
      @keydown.esc="close"
      tabindex="0"
    >
      <div class="c-modal__main">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    transition: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    focus() {
      this.$nextTick(() => {
        const modalRef = this.$refs.modal;
        modalRef.focus();
      });
    },
  },
  watch: {
    "$store.state.token.isTokenModalOpen": function (newState, oldState) {
      if (newState) {
        this.focus();
      }
    },

    $route() {
      this.close();
    },
  },
};
</script>
