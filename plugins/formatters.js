import Vue from "vue";
import VueCookies from 'vue-cookies';
import { createDataURL } from "~/utils/blockies";
import { getImageHash } from "~/utils/data";
import { slugify } from "~/utils/formatters";

Vue.use(VueCookies);

Vue.mixin({
  methods: {
    shortenAddress(address) {
      return `${address.slice(0, 5)}...${address.slice(-5)}`;
    },
    generateIconSrc(address) {
      return createDataURL({ seed: address });
    },
    getImageHash(URI) {
      return getImageHash(URI);
    },
    slugify(string) {
      return slugify(string);
    },
  },
});
