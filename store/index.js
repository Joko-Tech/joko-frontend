import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { cnetwork, walletOptions, networks } from "~/utils/network";
// import { InMemorySigner } from "@taquito/signer";
// import * as faucet from "~/data/faucet.json";
let beaconWallet;

// check if window exists
if (typeof window !== "undefined") {
  beaconWallet = new BeaconWallet(walletOptions);
}

export const state = () => ({
  initialData: "",
  wallet: {
    address: "",
    balance: "",
    isConnected: false,
  },
  artists: null,
  storage: null,
});

export const getters = {
  initialData: (state) => {
    return state.initialData;
  },
  wallet: (state) => {
    return state.wallet;
  },
  artists: (state) => {
    return state.artists;
  },
  storage: (state) => {
    return state.storage;
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
  updateArtists: (state, payload) => {
    state.artists = payload;
  },
  updateStorage: (state, payload) => {
    state.storage = payload;
  },
};

export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    // const tezos = new TezosToolkit(networks.jakartanet.nodes[0]);
    // const contract = await tezos.contract.at(
    //   "KT1RsM3NBMSYnNaWRqD6jjWVexY7GprsbG6F"
    // );
    // const storage = await contract.storage();
    // const artistsMap = storage.artist_map.valueMap;
    // const artistsKeys = Array.from(artistsMap.keys());
    // const artistsValues = Array.from(artistsMap.values());
    // const artists = artistsKeys.map((key, index) => {
    //   return {
    //     id: key,
    //     ...artistsValues[index],
    //   };
    // });
    // commit("updateArtists", artists);
    // commit("updateStorage", storage);
  },

  async fetchInitialData({ commit }) {
    const response = await this.$axios.$get("/api/initialData");
    commit("updateInitialData", response);
  },

  async connectWallet({ state, commit }) {
    const tezos = new TezosToolkit(networks.jakartanet.nodes[0]);
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
  async addNewArtist({ state, commit }) {
    const tezos = new TezosToolkit(networks.jakartanet.nodes[0]);

    // tezos.setSignerProvider(
    //   InMemorySigner.fromFundraiser(
    //     faucet.email,
    //     faucet.password,
    //     faucet.mnemonic.join(" ")
    //   )
    // );

    const artistObject = {
      artist: "harry2",
      artist_record: {
        address: "tz1bnmFGgKfrRfHLNABQpWh14CjsTKmrFNog",
        max_mint: 2,
        tier1_index: 0,
        tier1_metadata_path:
          "697066733a2f2f516d53635262716947655231625778376b6661757246767678734d457353",
        tier1_total_supply: 1,
        tier2_index: 0,
        tier2_metadata_path:
          "697066733a2f2f516d53635262716947655231625778376b6661757246767678734d457353",
        tier2_total_supply: 10,
        tier3_index: 0,
        tier3_metadata_path:
          "697066733a2f2f516d53635262716947655231625778376b6661757246767678734d457353",
        tier3_total_supply: 20,
      },
    };

    const contract = await tezos.contract.at(
      "KT1KWs63x8KeZQZhbCpLW6WdcHN69hxa9dCg"
    );

    const res = await contract.methodsObject.add_artist(artistObject).send();

    console.log(res);
    // const res = await op.confirmation(3);
    // const hash = res.hash;
    // console.log(hash);

    // const storage = await contract.storage();

    // console.log(storage);

    // console.log(contract);
  },
};
