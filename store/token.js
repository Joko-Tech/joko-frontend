import {
  fa2ContractAddress,
} from "~/utils/network";
export const state = () => ({
  isTokenModalOpen: false,
  currentModalToken: null,
});

export const getters = {
  isTokenModalOpen: (state) => {
    return state.isTokenModalOpen;
  },
  currentModalToken: (state) => {
    return state.currentModalToken;
  },
};

export const mutations = {
  updateIsTokenModalOpen: (state, payload) => {
    state.isTokenModalOpen = payload;
  },
  updateCurrentModalToken: (state, payload) => {
    state.currentModalToken = payload;
  },
};

export const actions = {
  updateActionValue({ commit }) {
    commit("updateValue", payload);
  },
  async fetchMint({ commit }, {tokenIds}) {
    const query = `
    query MyQuery($tokenIds: [String!]) {
      mint(where: {tokenId: {_in: $tokenIds}}) {
        tokenId
        raribleUrl
      }
    }     
    `;
    const {
      data: {
        data: { mint },
      },
    } 
    = await this.$axios.post("http://15.207.106.83/v1/graphql", {
      query,
      variables: { tokenIds: tokenIds },
    });
    return mint;
  },
  async fetchAsk({ commit }, {tokenIds}) {
    const query = `
    query MyQuery($tokenAddress: String, $tokenIds: [String!]="") {
      ask(where: {tokenAddress: {_eq: $tokenAddress}, tokenId: {_in: $tokenIds}}, 
          limit: 1, 
          order_by: {timestamp: desc, amount:asc}) 
      {
        amount
        askerId
        timestamp
        tokenAddress
        tokenId
      }
    }       
    `;
    const {
      data: {
        data: { ask },
      },
    } = await this.$axios.post("http://15.207.106.83/v1/graphql", {
      query,
      variables: { tokenAddress: "KT1KjromN7E42JsC38iBkkkqKkteKJ8BHtRP", tokenIds: tokenIds },
    });
    return ask;
  },
  async fetchBid({ commit }, {tokenIds}) {
    const query = `
    query MyQuery($tokenAddress: String, $tokenIds: [String!]="") {
      bid(limit: 1,
            order_by: {timestamp: desc, price: desc}, 
            where: {tokenAddress: {_eq: $tokenAddress}, tokenId: {_in: $tokenIds}}) {
        price
        timestamp
        tokenAddress
        tokenId
      }
    }           
    `;
    const {
      data: {
        data: { bid },
      },
    } = await this.$axios.post("http://15.207.106.83/v1/graphql", {
      query,
      variables: { tokenAddress: "KT18bPNxdKzk7XqYEfKp6mS4un7X64Ho6mkR", tokenIds: tokenIds },
    });
    return bid;
  },
  async fetchSale({ commit }, {tokenIds}) {
    const query = `
    query MyQuery($tokenIds: [String!]="") {
      lastSale(limit: 1, 
               order_by: {timestamp: desc}, 
               where: {tokenId: {_in: $tokenIds}}) 
      {
        amount
        tokenId
        timestamp
      }
    }               
    `;
    const {
      data: {
        data: { lastSale },
      },
    } = await this.$axios.post("http://15.207.106.83/v1/graphql", {
      query,
      variables: { tokenIds: tokenIds },
    });
    return lastSale;
  },
  async fetchSell({ commit }, {tokenIds}) {
    const query = `
    query MyQuery($tokenAddress: String, $tokenIds: [String!]="") {
      sell(where: {tokenAddress: {_eq: $tokenAddress}, 
                  tokenId: {_in: $tokenIds}}, 
                  order_by: {timestamp: desc}, 
                  limit: 1) 
      {
        saleAmount
        sellerId
        timestamp
        tokenAddress
        tokenId
      }
    }         
    `;
    const {
      data: {
        data: { sell },
      },
    } = await this.$axios.post("http://15.207.106.83/v1/graphql", {
      query,
      variables: { tokenAddress: "KT1JkaXjdxrWSrVjXzufTgdJTJC9UoQjkveW",
                   tokenIds: tokenIds },
    });
    return sell;
  },
  async fetchBuy({ commit }, {tokenIds}) {
    const query = `
    query MyQuery($tokenAddress: String, $tokenIds: [name!]) {
      buy(limit: 1,
          where: {tokenAddress: {_eq: $tokenAddress}, 
          tokenId: {_in: $tokenIds}}, 
          order_by: {timestamp: desc}) 
      {
        buyAmount
        buyFrom
        timestamp
        tokenAddress
        tokenId
      }
    }         
    `;
    const {
      data: {
        data: { buy },
      },
    } = await this.$axios.post("http://15.207.106.83/v1/graphql", {
      query,
      variables: { tokenAddress: "KT1HVzCL4e4F4f4pRwxG9ye9oo85YB6t7cmd", tokenIds: tokenIds },
    });
    return buy;
  },
};
