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
    nodes: ["https://rpc.ghostnet.teztnets.xyz/"],
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
};

const jokoContractAddress = "KT1TumVTRGXRZzRKBxFzsBpTiUeoiWhafj39";

export { networks, cnetwork, walletOptions, jokoContractAddress };
