import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { cnetwork, walletOptions } from "~/utils/network";
const beaconWallet = new BeaconWallet(walletOptions);

export const state = () => ({
  initialData: "",
  wallet: {
    address: "",
    balance: "",
    isConnected: false,
  },
});

export const getters = {
  initialData: (state) => {
    return state.initialData;
  },
  wallet: (state) => {
    return state.wallet;
  },
};

export const mutations = {
  updateInitialData: (state, payload) => {
    state.initialData = payload;
  },
  updateWallet: (state, payload) => {
    const { address, connected } = payload;

    const updatedWallet = {
      ...state.wallet,
      address,
      isConnected: connected,
    };

    state.wallet = updatedWallet;
  },
};

export const actions = {
  async fetchInitialData({ commit }) {
    const response = await this.$axios.$get("/api/initialData");
    commit("updateInitialData", response);
  },

  async connectWallet({ state, commit }) {
    const tezos = new TezosToolkit(cnetwork.node);
    tezos.setWalletProvider(beaconWallet);

    const activeAccount = await beaconWallet.client.getActiveAccount();
    if (activeAccount) {
      commit("updateWallet", {
        address: activeAccount.address,
        connected: true,
      });
    } else {
      try {
        const permissions = await beaconWallet.client.requestPermissions();
        commit("updateWallet", {
          address: permissions.address,
          connected: true,
        });
      } catch (error) {
        console.log(error);
      }
    }
  },
  async disconnectWallet({ commit }) {
    await beaconWallet.clearActiveAccount();

    commit("updateWallet", {
      address: "",
      connected: false,
    });
  },
};
