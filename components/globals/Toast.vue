<template>
  <transition name="toast-fade">
    <div class="c-toast" v-if="showToast">
      <div class="c-toast__inner">
        <div
          class="c-toast__label c-toast__label--success"
          v-if="toastState === 'success'"
        >
          <div class="c-toast__label__text">Success</div>
        </div>

        <div
          class="c-toast__label c-toast__label--error"
          v-if="toastState === 'error'"
        >
          <div class="c-toast__label__text">Error</div>
        </div>

        <div v-if="toastState === 'info'" class="c-toast__body">
          <slot />
        </div>

        <div v-else class="c-toast__body">
          <p class="c-toast__message">
            <slot />
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  props: {
    toastState: {
      type: String,
      default: "success",
    },
    showToast: Boolean,
  },
};
</script>
