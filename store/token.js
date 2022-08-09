export const state = () => ({
  isTokenModalOpen: false,
});

export const getters = {
  isTokenModalOpen: (state) => {
    return state.isTokenModalOpen;
  },
};

export const mutations = {
  updateIsTokenModalOpen: (state, payload) => {
    state.isTokenModalOpen = payload;
  },
};

export const actions = {
  updateActionValue({ commit }) {
    commit("updateValue", payload);
  },
};
