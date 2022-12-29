import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { Amplify, Auth } from "aws-amplify";
import {
  jokoContractAddress,
  walletOptions,
  networks,
  fa2ContractAddress,
  base_tzkt_api_url,
} from "~/utils/network";
import { NetworkType } from "@airgap/beacon-sdk";
import { char2Bytes } from "@taquito/utils";
import { SigningType } from "@airgap/beacon-sdk";
import { checkUser, handleAmplifySignIn } from "~/utils/user";
import { getHttp } from "~/utils/api";

Amplify.configure({
  Auth: {
    region: process.env.NEXT_PUBLIC_REGION,
    identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
    userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_WEB_CLIENT_ID,
    authenticationFlowType: "CUSTOM_AUTH",
    mandatorySignIn: false,
  },
  API: {
    endpoints: [
      {
        name: process.env.NEXT_PUBLIC_API_NAME,
        endpoint: process.env.NEXT_PUBLIC_API_BASE_URL,
      },
    ],
  },
});

let beaconWallet;
// let tezos = new TezosToolkit(networks.mainnet.nodes[0]);
let tezos = new TezosToolkit(networks.ghostnet.nodes[1]);

// check if window exists
if (typeof window !== "undefined") {
  beaconWallet = new BeaconWallet(walletOptions);
}

export const state = () => ({
  wallet: {
    address: "",
    balance: "",
    isConnected: false,
  },
  walletTokens: [],
});

export const getters = {
  wallet: (state) => {
    return state.wallet;
  },
  walletTokens: (state) => {
    return state.walletTokens;
  },
};

export const mutations = {
  updateWallet: (state, payload) => {
    const { address, connected } = payload;

    const updatedWallet = {
      ...state.wallet,
      address,
      isConnected: connected,
    };

    state.wallet = updatedWallet;
  },
  updateWalletTokens: (state, payload) => {
    state.walletTokens = payload;
  },
};

export const actions = {
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
        console.log(process.env.NEXT_PUBLIC_REGION);
        const permissions = await beaconWallet.requestPermissions({
          network: {
            type: NetworkType.GHOSTNET,
            rpcUrl: networks.ghostnet.nodes[1],
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
        const payloadBytes =
          "05" + "0100" + char2Bytes(bytes.length.toString()) + bytes;

        // The payload to send to the wallet
        const payload = {
          signingType: SigningType.MICHELINE,
          payload: payloadBytes,
          sourceAddress: userAddress,
        };
        // Request to user to Sign the message on the blockchain
        // The signing
        const signedPayload = await beaconWallet.client.requestSignPayload(
          payload
        );
        // The signature
        const { signature } = signedPayload;

        const publicKey = (await beaconWallet.client.getActiveAccount())
          .publicKey;
        const clientMetadata = { publicKey: publicKey };

        console.log(
          "Send challenge answer: \n" + cognitoUser + "\n" + signature
        );
        await Auth.sendCustomChallengeAnswer(
          cognitoUser,
          signature,
          clientMetadata
        )
          .then(async (user) => {
            console.log("user after answer");
            console.log(user);
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
        if (!(await checkUser())) throw "Authentication failed";
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
    await Auth.signOut();
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
  },

  async mintTier1({ state, commit }, tokenPayload) {
    const { artist, pixel_artist, price } = tokenPayload;

    const tokenObject = {
      artist,
      pixel_artist,
      amount_tokens: 1,
    };

    const contract = await tezos.wallet.at(jokoContractAddress);

    const res = await contract.methodsObject
      .mint_JOKO_tier1(tokenObject)
      .send({ amount: price });
  },

  async mintTier2({ state, commit }, tokenPayload) {
    const { artist, pixel_artist, price } = tokenPayload;

    const tokenObject = {
      artist,
      pixel_artist,
      amount_tokens: 1,
    };

    const contract = await tezos.wallet.at(jokoContractAddress);

    const res = await contract.methodsObject
      .mint_JOKO_tier2(tokenObject)
      .send({ amount: price });
  },

  async mintTier3({ state, commit }, tokenPayload) {
    const { artist, pixel_artist, price } = tokenPayload;

    const tokenObject = {
      artist,
      pixel_artist,
      amount_tokens: 1,
    };

    const contract = await tezos.wallet.at(jokoContractAddress);

    const res = await contract.methodsObject
      .mint_JOKO_tier3(tokenObject)
      .send({ amount: price });
  },

  async isAuthenticatedVideo({ state, commit }, artistName) {
    const res = await getHttp("getFromLambda", {}, artistName, jokoContractAddress, fa2ContractAddress, NetworkType.GHOSTNET);
    console.log(res);
    return res.hasNft.tier1 || res.hasNft.tier2 || res.hasNft.tier3;
  },

  async isAuthenticatedBTS({ state, commit }, artistName) {
    const res = await getHttp("getFromLambda", {}, artistName, jokoContract, fa2ContractAddress, NetworkType.GHOSTNET);
    console.log(res);
    return res.hasNft.tier1 || res.hasNft.tier2;
  },

  async fetchUserTokens({ state, commit }) {
    try {
      const res = await this.$axios.$get(
        `${base_tzkt_api_url}tokens/balances/?account=${state.wallet.address}&token.contract=${fa2ContractAddress}`
      );

      const modifiedTokens = res.map((token) => {
        return {
          ...token.token.metadata,
          tokenId: token.token.tokenId,
        };
      });

      commit("updateWalletTokens", modifiedTokens);
    } catch (error) {
      console.log(error);
    }
  },
};
