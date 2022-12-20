import {
  NetworkType,
  BeaconEvent,
  defaultEventCallbacks,
} from "@airgap/beacon-sdk";
const networks = {
  mainnet: {
    networkname: "Mainnet",
    nodes: [
      "https://mainnet.api.tez.ie",
      "https://mainnet.smartpy.io",
      "https://rpc.tzbeta.net/",
      "https://teznode.letzbake.com",
      "https://mainnet-tezos.giganode.io",
    ],
  },
  jakartanet: {
    networkname: "Jakartanet",
    nodes: ["https://rpc.jakartanet.teztnets.xyz"],
  },
  ghostnet: {
    networkname: "Ghostnet",
    nodes: ["https://rpc.ghostnet.teztnets.xyz/", "https://ghostnet.ecadinfra.com", "https://ghostnet.tezos.marigold.dev/"],
  },
  ithacanet: {
    networkname: "Ithacanet",
    nodes: ["https://ithacanet.ecadinfra.com", "https://ithacanet.smartpy.io/"],
  },
};

const cnetwork = {
  networkname: "Mainnet",
  node: "https://mainnet.api.tez.ie",
};

const walletOptions = {
  name: "joko-wallet",
  preferredNetwork: NetworkType.GHOSTNET,
  disableDefaultEvents: true, // Disable all events / UI. This also disables the pairing alert.
  eventHandlers: {
    // To keep the pairing alert, we have to add the following default event handlers back
    [BeaconEvent.PAIR_INIT]: {
      handler: defaultEventCallbacks.PAIR_INIT,
    },
    [BeaconEvent.PAIR_SUCCESS]: {
      handler: (data) => setPublicToken(data.publicKey),
    },
  },
};

const jokoContractAddress = "KT1VFnAEjAJvN9e4bqB3HRJMwZTSEKh1EoAS";
const fa2ContractAddress = "KT1JdcVuRJZizh9VQNQvCnaPShWBdrBK6L2b";

const base_tzkt_api_url = "https://api.ghostnet.tzkt.io/v1/"

export {
  networks,
  cnetwork,
  walletOptions,
  jokoContractAddress,
  fa2ContractAddress,
  base_tzkt_api_url
};
