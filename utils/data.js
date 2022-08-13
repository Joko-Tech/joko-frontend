import axios from "axios";

const baseUri = "https://gateway.pinata.cloud/ipfs/";

export const formatIpfsUrl = (URI) => {
  let url;
  if (URI.includes("ipfs://")) {
    url = `${baseUri}${URI.split("ipfs://")[1]}`;
  } else {
    url = `${baseUri}${URI}`;
  }

  return url;
};

export const ipfsFetcher = async (URI) => {
  const url = formatIpfsUrl(URI);

  return axios.get(url);
};

export const ipfsMetadataFetcher = async (URI) => {
  const url = `${formatIpfsUrl(URI)}/_metadata.json`;

  return axios.get(url);
};

export const getImageHash = (URI) => {
  const url = formatIpfsUrl(URI);

  return url;
};
