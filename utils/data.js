import axios from "axios";

const baseUri = process.env.BASE_IPFS_PATH;

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

  return axios.get(url,
    {
      headers: {
        'Accept': 'text/plain'
      }
    }
  );
};

export const ipfsIndexFetcher = async (URI, index) => {
  let url = formatIpfsUrl(URI);

  url = `${url}/${index}`;

  return axios.get(url,
    {
      headers: {
        'Accept': 'text/plain'
      }
    }
  );
};

export const ipfsMetadataFetcher = async (URI) => {
  const url = `${formatIpfsUrl(URI)}/_metadata.json`;

  return axios.get(url,
    {
      headers: {
        'Accept': 'text/plain'
      }
    }
  );
};

export const getImageHash = (URI) => {
  const url = formatIpfsUrl(URI);

  return url;
};
