import { TezosToolkit } from "@taquito/taquito";
import { bytes2Char } from "@taquito/utils";
import { ipfsMetadataFetcher } from "~/utils/data";
import {
  jokoContractAddress,
  fa2ContractAddress,
  networks,
} from "~/utils/network";

let tezos = new TezosToolkit(networks.mainnet.nodes[0]);

export const state = () => ({
  initialData: "",
  artists: null,
  allTokenMetadata: null,
  mintedTokenMetadata: null,
  storage: null,
  isVideoModalOpen: false,
});

export const getters = {
  initialData: (state) => {
    return state.initialData;
  },
  artists: (state) => {
    return state.artists;
  },
  allTokenMetadata: (state) => {
    return state.allTokenMetadata;
  },
  mintedTokenMetadata: (state) => {
    return state.mintedTokenMetadata;
  },
  storage: (state) => {
    return state.storage;
  },
  isVideoModalOpen: (state) => {
    return state.isVideoModalOpen;
  },
};

export const mutations = {
  updateInitialData: (state, payload) => {
    state.initialData = payload;
  },
  updateArtists: (state, payload) => {
    state.artists = payload;
  },
  updateAllTokenMetadata: (state, payload) => {
    state.allTokenMetadata = payload;
  },
  updateMintedTokenMetadata: (state, payload) => {
    state.mintedTokenMetadata = payload;
  },
  updateStorage: (state, payload) => {
    state.storage = payload;
  },
  updateIsVideoModalOpen: (state, payload) => {
    state.isVideoModalOpen = payload;
  },
};

export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req }) {
    // await dispatch("fetchAllMetadata");
    await dispatch("fetchInitialStorage");
  },

  async fetchInitialData({ commit }) {
    // const response = await this.$axios.$get("/api/initialData");
    // commit("updateInitialData", response);
  },

  async fetchAllMetadata({ state, commit }) {
    const artists = state.artists;

    try {
      const tokenMetadata = await Promise.all(
        artists.map(async (artist, index) => {
          const tier1_metadata = await ipfsMetadataFetcher(
            artist.tier1_metadata_path
          );
          const tier2_metadata = await ipfsMetadataFetcher(
            artist.tier2_metadata_path
          );
          const tier3_metadata = await ipfsMetadataFetcher(
            artist.tier3_metadata_path
          );

          return {
            artistName: artist.artistName,
            tier1_metadata: tier1_metadata.data,
            tier2_metadata: tier2_metadata.data,
            tier3_metadata: tier3_metadata.data,
          };
        })
      );

      commit("updateAllTokenMetadata", tokenMetadata);
    } catch (error) {
      console.log(error);
    }
  },

  async fetchInitialStorage({ commit }) {
    // tezos = new TezosToolkit(networks.ghostnet.nodes[0]);
    const contract = await tezos.contract.at(jokoContractAddress);
    const storage = await contract.storage();
    const artistsMap = storage.artist_map.valueMap;
    const artistsKeys = Array.from(artistsMap.keys());
    const artistsValues = Array.from(artistsMap.values());

    const artists = artistsKeys.map((key, index) => {
      return {
        artistName: key.replace(/['"]+/g, ""),
        ...artistsValues[index],
        tier1_metadata_path: bytes2Char(
          artistsValues[index].tier1_metadata_path
        ),
        tier2_metadata_path: bytes2Char(
          artistsValues[index].tier2_metadata_path
        ),
        tier3_metadata_path: bytes2Char(
          artistsValues[index].tier3_metadata_path
        ),
      };
    });
    commit("updateArtists", artists);
    commit("updateStorage", storage);
  },

  async fetchGalleryMetadata({ commit }) {
    const res = await this.$axios.$get(
      `https://api.tzkt.io/v1/tokens?contract=${fa2ContractAddress}`
    );

    const medatada = res.map((token) => {
      return {
        tokenId: token.tokenId,
        ...token.metadata,
      };
    });

    commit("updateMintedTokenMetadata", medatada);
  },
};
