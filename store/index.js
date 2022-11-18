import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { bytes2Char } from "@taquito/utils";
import { Amplify, Auth } from 'aws-amplify';
import { ipfsMetadataFetcher } from "~/utils/data";
import {
  jokoContractAddress,
  fa2ContractAddress,
  walletOptions,
  networks,
} from "~/utils/network";
import { NetworkType } from "@airgap/beacon-sdk";
import { char2Bytes } from '@taquito/utils';
import { RequestSignPayloadInput, SigningType } from '@airgap/beacon-sdk';
import { checkUser, handleAmplifySignIn } from '~/utils/user';
import { getHttp } from '~/utils/api';
Amplify.configure({
  Auth: {
    region: process.env.NEXT_PUBLIC_REGION,
    identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
    userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_WEB_CLIENT_ID,
    authenticationFlowType: 'CUSTOM_AUTH',
    mandatorySignIn: false
  },
  API: {
    endpoints: [
      {
        name: process.env.NEXT_PUBLIC_API_NAME,
        endpoint: process.env.NEXT_PUBLIC_API_BASE_URL
      }
    ]
  }
});
// import { InMemorySigner } from "@taquito/signer";
// import * as faucet from "~/data/faucet.json";
let beaconWallet;
let tezos = new TezosToolkit(networks.mainnet.nodes[0]);

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
  allTokenMetadata: null,
  mintedTokenMetadata: null,
  storage: null,
  isVideoModalOpen: false,
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

  async connectWallet({ state, commit }) {
    // tezos = new TezosToolkit(networks.ghostnet.nodes[0]);
    tezos.setWalletProvider(beaconWallet);

    const activeAccount = await beaconWallet.client.getActiveAccount();
    if (activeAccount) {
      commit("updateWallet", {
        address: activeAccount.address,
        connected: true,
      });
    } else {
      try {
        console.log(process.env.NEXT_PUBLIC_REGION)
        const permissions = await beaconWallet.requestPermissions({
          network: {
            type: NetworkType.MAINNET,
            rpcUrl: networks.mainnet.nodes[0],
          },
        });
        const userAddress = await beaconWallet.getPKH();
        const cognitoUser = await handleAmplifySignIn(userAddress);
        console.log("User: ");
        console.log(cognitoUser);
        const message = cognitoUser.challengeParam.message;
        console.log("Message to sign: " + message);
        // The bytes to sign
        const bytes = char2Bytes(message.toString());
        const payloadBytes = '05' + '0100' + char2Bytes(bytes.length.toString()) + bytes;

        // The payload to send to the wallet
        const payload = {
          signingType: SigningType.MICHELINE,
          payload: payloadBytes,
          sourceAddress: userAddress,
        };
        // Request to user to Sign the message on the blockchain
        // The signing
        const signedPayload = await beaconWallet.client.requestSignPayload(payload);
        // The signature
        const { signature } = signedPayload;

        const publicKey = (await beaconWallet.client.getActiveAccount()).publicKey;
        const clientMetadata = { "publicKey": publicKey }

        console.log("Send challenge answer: \n" + cognitoUser + "\n" + signature);
        await Auth.sendCustomChallengeAnswer(cognitoUser, signature, clientMetadata)
          .then(async (user) => {
            console.log('user after answer');
            console.log(user);
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
        if (!await checkUser())
          throw "Authentication failed";
        else {
          commit("updateWallet", {
            address: userAddress,
            connected: true,
          });
        }
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
    new TezosToolkit(networks.ghostnet.nodes[0]);

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

    const contract = await tezos.contract.at(jokoContractAddress);

    const res = await contract.methodsObject.add_artist(artistObject).send();

    console.log(res);
    // const res = await op.confirmation(3);
    // const hash = res.hash;
    // console.log(hash);

    // const storage = await contract.storage();

    // console.log(storage);

    // console.log(contract);
  },
  async mintTier2({ state, commit }, tokenPayload) {
    const { artist, pixel_artist } = tokenPayload;

    const tokenObject = {
      artist,
      pixel_artist,
      amount_tokens: 1,
    };

    const contract = await tezos.wallet.at(jokoContractAddress);

    const res = await contract.methodsObject
      .mint_JOKO_tier2(tokenObject)
      .send({ amount: 10 });
  },
  async mintTier3({ state, commit }, tokenPayload) {
    const { artist, pixel_artist } = tokenPayload;

    const tokenObject = {
      artist,
      pixel_artist,
      amount_tokens: 1,
    };

    const contract = await tezos.wallet.at(jokoContractAddress);

    const res = await contract.methodsObject
      .mint_JOKO_tier3(tokenObject)
      .send({ amount: 5 });
  },
  async isAuthenticated({ state, commit }, artistName) {
    const nftIdList = [];
    const requiredNftList = [];
    let hasNft = false;
    try {
      const contractStorage = await this.$axios.$get(
        `https://api.tzkt.io/v1/contracts/${jokoContractAddress}/storage`
      );
      const tier_map = contractStorage.tier_map[artistName];
      console.log(tier_map)
      tier_map["tier1"]?.map(tokenId => {
        requiredNftList.push(tokenId)
      })
      tier_map["tier2"]?.map(tokenId => {
        requiredNftList.push(tokenId)
      })
      tier_map["tier3"]?.map(tokenId => {
        requiredNftList.push(tokenId)
      })
      console.log(requiredNftList);
      const nfts = await getHttp('getFromLambda');
      nfts.map(nft => {
        nftIdList.push(nft.token.tokenId);
      })
      console.log(nftIdList);
      nftIdList.map(nft => {
        if (requiredNftList.includes(nft))
          hasNft = true;
      })
      return hasNft;
    }
    catch (e) {
      console.log(e);
    }
  }
}

