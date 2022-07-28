<template>
  <component
    :is="shouldRenderAs"
    :href="href"
    :to="href && href.startsWith('/') ? href : ''"
    :class="classNames"
    @click="click"
    :target="href && !href.startsWith('/') && '_blank'"
  >
    <span class="c-button__text" data-button-text v-if="buttonType !== 'icon'">
      <slot />
    </span>
    <span v-if="icon" class="c-button__icon">
      <component :is="`${icon}-icon`" />
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
    buttonSize: {
      type: String,
      default: "medium",
      validator: (s) => ["medium", "large"].includes(s),
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
        this.buttonSize && `c-button--${this.buttonSize}`,
        this.icon && `c-button--${this.icon}`,
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
