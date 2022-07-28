<template>
  <footer class="c-footer">
    <div class="c-footer__inner">
      <div class="c-footer__top">
        <div class="c-footer__title">Connect</div>
        <div class="c-footer__links">
          <a
            href="https://instagram.com"
            class="c-footer__link"
            target="_blank"
          >
            Instagram
          </a>
          <a href="https://twitter.com" class="c-footer__link" target="_blank">
            Twitter
          </a>
          <a href="mailto:hello@joko.com" class="c-footer__link">Email</a>
        </div>
      </div>
      <div class="c-footer__bottom">
        <div class="c-footer__copy">
          COPYRIGHT © {{ currentYear }} — JOKO INC.
        </div>
        <div class="c-footer__credits">POWERED BY TEZOS</div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style lang="scss" scoped></style>
