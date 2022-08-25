export const state = () => ({
  isTokenModalOpen: false,
  currentModalToken: null,
});

export const getters = {
  isTokenModalOpen: (state) => {
    return state.isTokenModalOpen;
  },
  currentModalToken: (state) => {
    return state.currentModalToken;
  },
};

export const mutations = {
  updateIsTokenModalOpen: (state, payload) => {
    state.isTokenModalOpen = payload;
  },
  updateCurrentModalToken: (state, payload) => {
    state.currentModalToken = payload;
  },
};

export const actions = {
  updateActionValue({ commit }) {
    commit("updateValue", payload);
  },
};
