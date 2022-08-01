<template>
  <component
    :is="shouldRenderAs"
    :href="href"
    :to="href && href.startsWith('/') ? href : ''"
    :class="classNames"
    @click="click"
    :target="href && !href.startsWith('/') && '_blank'"
  >
    <div class="c-button__bg" />
    <div class="c-button__border" />
    <span class="c-button__inner">
      <span
        class="c-link c-button__text"
        data-button-text
        v-if="buttonType !== 'icon'"
      >
        <span class="c-link__inner">
          <span> <slot /></span>
          <span v-if="!noAnimate" class="c-link__animated" aria-hidden="true">
            <slot />
          </span>
        </span>
      </span>
      <span v-if="icon" class="c-button__icon">
        <component :is="`${icon}-icon`" />
      </span>
    </span>
  </component>
</template>

<script>
export default {
  name: "Button",
  props: {
    buttonType: {
      type: String,
      default: "primary",
      validator: (s) => ["primary", "icon"].includes(s),
    },
    size: {
      type: String,
      default: "medium",
      validator: (s) => ["medium", "large"].includes(s),
    },
    filled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: "",
    },
    href: {
      type: String,
      default: null,
    },
    noAnimate: {
      type: Boolean,
      default: false,
    },
    renderAs: {
      type: String,
    },
  },
  computed: {
    classNames() {
      return [
        "c-button",
        this.buttonType && `c-button--${this.buttonType}`,
        this.noAnimate && "c-button--no-animate",
        this.buttonType !== "icon" && this.icon && "c-button--withicon",
        this.size && `c-button--${this.size}`,
        this.icon && `c-button--${this.icon}`,
        this.filled && "c-button--filled",
      ];
    },
    shouldRenderAs() {
      return !this.renderAs
        ? this.href
          ? "nuxt-link"
          : "button"
        : this.renderAs;
    },
  },
  methods: {
    click() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped></style>
