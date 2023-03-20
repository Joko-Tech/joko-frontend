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
let getRepTokensPerTier = (artistName, tokenList) => {
  let pixelArtistList = [];
  let repTokensPerTier = [];
  tokenList.map((token, index) => {
    let artist = "";
    let tier = "";
    let pixel_artist = "";
    for (let i = 0; i < token.attributes.length; i++) {
      switch (token.attributes[i].name) {
        case "Tier":
          tier = token.attributes[i].value ? token.attributes[i].value : null;
          break;
        case "Artist":
          artist = token.attributes[i].value
            ? token.attributes[i].value
            : token.creators[0].split(" ")[0];
          break;
        case "Pixel artist":
          pixel_artist = token.attributes[i].value
            ? token.attributes[i].value
            : token.creators[1].split(" ")[0];
          break;
        default:
          break;
      }
    }
    // Check if already have the reprentative token of this artist
    if (pixelArtistList.indexOf(pixel_artist) == -1) {
      pixelArtistList.push(pixel_artist);
      repTokensPerTier.push({
        tokenIds: [],
        artistName: artist,
        pixel_artist: pixel_artist,
        tier: tier,
        ...token,
      });
    }
  });
  return repTokensPerTier;
};
let getArtistMapId = async () => {
  const contractBigMaps = (
    await axios.get(
      `${base_tzkt_api_url}bigmaps?contract=${jokoContractAddress}`
    )
  ).data;
  for (const bigMap of contractBigMaps) {
    if (bigMap.path == "artist_map") return bigMap.ptr;
  }
  return null;
};
let getBigMapValue = async (artistsMapId) => {
  let value = [];
  const bigMaps = (
    await axios.get(
      `https://api.ghostnet.tzkt.io/v1/bigmaps/${artistsMapId}/keys`
    )
  ).data;
  for (const bigMap of bigMaps) {
    value.push(bigMap);
  }
  return value;
};
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
    console.log("fetchInitialStorage");
    const contract = await tezos.contract.at(jokoContractAddress);
    const storage = await contract.storage();
    // const artistsMap = storage.artist_map.valueMap;
    const artistsMapId = await getArtistMapId();
    const artistsValues = Array.from(await getBigMapValue(artistsMapId));

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

  async fetchGalleryMetadata({ state, commit, dispatch }) {
    let repTokens = [];
    const repTokensPerArtist = {};
    let artists = state.artists;
    if (!artists) {
      await dispatch("fetchInitialStorage");
    }
    artists = state.artists;
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
    tokenMetadata.map((artist, index) => {
      const artist_name = artist.artistName;
      if (!repTokensPerArtist[artist_name]) {
        repTokensPerArtist[artist_name] = {};
      }
      repTokensPerArtist[artist_name]["tier1"] = getRepTokensPerTier(
        artist_name,
        artist.tier1_metadata
      );
      repTokensPerArtist[artist_name]["tier2"] = getRepTokensPerTier(
        artist_name,
        artist.tier2_metadata
      );
      repTokensPerArtist[artist_name]["tier3"] = getRepTokensPerTier(
        artist_name,
        artist.tier3_metadata
      );
      repTokensPerArtist[artist_name] = Array.prototype.concat(
        repTokensPerArtist[artist_name]["tier1"],
        repTokensPerArtist[artist_name]["tier2"],
        repTokensPerArtist[artist_name]["tier3"]
      );
    });
    // convert object to key's array
    const keys = Object.keys(repTokensPerArtist);
    // iterate over object
    keys.forEach((key, index) => {
      if (repTokens.length == 0) repTokens = repTokensPerArtist[key];
      else repTokens = repTokens.concat(repTokensPerArtist[key]);
    });
    commit("updateMintedTokenMetadata", repTokens);
  },
};
