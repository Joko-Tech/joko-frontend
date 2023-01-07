import { TezosToolkit } from "@taquito/taquito";
import { bytes2Char } from "@taquito/utils";
import { ipfsMetadataFetcher, ipfsFetcher } from "~/utils/data";
import {
  jokoContractAddress,
  fa2ContractAddress,
  networks,
  base_tzkt_api_url,
} from "~/utils/network";
import axios from "axios";

// let tezos = new TezosToolkit(networks.mainnet.nodes[0]);
let tezos = new TezosToolkit(networks.ghostnet.nodes[1]);
let getArtistMapId = async () => {
  const contractBigMaps = (
    await axios.get(
      `${base_tzkt_api_url}bigmaps?contract=${jokoContractAddress}`
    )
  ).data;
  for (const bigMap of contractBigMaps) {
    if (bigMap.path == "artist_map")
      return bigMap.ptr;
  }
  return null;
}
let getBigMapValue = async (artistsMapId) => {
  let value = [];
  const bigMaps = (
    await axios.get(
      `https://api.ghostnet.tzkt.io/v1/bigmaps/${artistsMapId}/keys`
    )
  ).data;
  for (const bigMap of bigMaps) {
    value.push(bigMap)
  }
  return value;
}
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
    // const artistsMap = storage.artist_map.valueMap;
    const artistsMapId = await getArtistMapId();
    const artistsValues = Array.from(await getBigMapValue(artistsMapId))

    const artists = artistsValues.map((value, index) => {
      return {
        artistName: value.key.replace(/['"]+/g, ""),
        ...artistsValues[index],
        tier1_metadata_path: bytes2Char(
          artistsValues[index].value.tier1_metadata_path
        ),
        tier2_metadata_path: bytes2Char(
          artistsValues[index].value.tier2_metadata_path
        ),
        tier3_metadata_path: bytes2Char(
          artistsValues[index].value.tier3_metadata_path
        ),
        tier2_price: artistsValues[index].value.tier2_price,
        tier3_price: artistsValues[index].value.tier3_price,
        tier1_total_supply: artistsValues[index].value.tier1_total_supply,
        tier2_total_supply: artistsValues[index].value.tier2_total_supply,
        tier3_total_supply: artistsValues[index].value.tier3_total_supply,
        tier1_max_supply: Number(artistsValues[index].value.tier1_max_supply),
        tier2_max_supply: Number(artistsValues[index].value.tier2_max_supply),
        tier3_max_supply: Number(artistsValues[index].value.tier3_max_supply),
      };
    });
    commit("updateArtists", artists);
    commit("updateStorage", storage);
  },

  async fetchGalleryMetadata({ commit }) {
    const fa2_big_maps = await this.$axios.$get(
      `${base_tzkt_api_url}bigmaps?contract=${fa2ContractAddress}`
    );
    const token_metadata = fa2_big_maps.find(element => element.path === "token_metadata");
    const token_metadata_ptr = token_metadata?.ptr
    const res = await this.$axios.$get(
      `${base_tzkt_api_url}bigmaps/${token_metadata_ptr}/keys`
    );

    const metadata = await Promise.all(
      res.map(async(token) => {
        const tokenId = token.value.token_id;
        const metadataPath = bytes2Char(token.value.token_info[""]);
        const tokenMetadata = await ipfsFetcher(metadataPath);
        return {
          tokenId: tokenId,
          ...tokenMetadata.data,
        };
      })
    );

    commit("updateMintedTokenMetadata", metadata);
  },
};
