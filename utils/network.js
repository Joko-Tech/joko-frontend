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
};

const jokoContractAddress = "KT1N4NzVtwCWCdnNLSsSUG9a7zJt1NUP2rxw";
const fa2ContractAddress = "KT1SoQSSHknvaUUvBRxRiT9ynBHME8sQ191P";

const base_tzkt_api_url = "https://api.ghostnet.tzkt.io/v1/"

export {
  networks,
  cnetwork,
  walletOptions,
  jokoContractAddress,
  fa2ContractAddress,
  base_tzkt_api_url
};
