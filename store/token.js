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
    = await this.$axios.post("https://dipdup.playjoko.com/v1/graphql", {
      query,
      variables: { tokenIds: tokenIds },
    });
    return mint;
  },
  /*
    Fetch ask and offer from normal sale on Objkts
  */
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
    } = await this.$axios.post("https://dipdup.playjoko.com/v1/graphql", {
      query,
      variables: { tokenAddress: "KT1KjromN7E42JsC38iBkkkqKkteKJ8BHtRP", tokenIds: tokenIds },
    });
    return ask;
  },
  async fetchOffer({ commit }, {tokenIds}) {
    const query = `
    query MyQuery($tokenAddress: String, $tokenIds: [String!]="") {
      offer(where: {tokenAddress: {_eq: $tokenAddress}, tokenId: {_in: $tokenIds}}, 
          limit: 1, 
          order_by: {timestamp: desc, amount:desc}) 
      {
        amount
        timestamp
        tokenAddress
        tokenId
      }
    }       
    `;
    const {
      data: {
        data: { offer },
      },
    } = await this.$axios.post("https://dipdup.playjoko.com/v1/graphql", {
      query,
      variables: { tokenAddress: "KT1RMb18HPPm1Dtcb74AfUQgdc4uHcxmEHU2", tokenIds: tokenIds },
    });
    return offer;
  },

  /*
    Fetch ask and bid from auction on Objkts
  */
  async fetchAskAuction({ commit }, {tokenIds}) {
    const query = `
    query MyQuery($tokenAddress: String, $tokenIds: [String!]) {
      askAuction(limit: 1,
          where: {tokenAddress: {_eq: $tokenAddress}, 
          tokenId: {_in: $tokenIds}}, 
          order_by: {timestamp: desc}) 
      {
        endTime
        reserve
        startTime
        tokenAddress
        tokenId
      }
    }         
    `;
    const {
      data: {
        data: { askAuction },
      },
    } = await this.$axios.post("https://dipdup.playjoko.com/v1/graphql", {
      query,
      variables: { tokenAddress: "KT1HVzCL4e4F4f4pRwxG9ye9oo85YB6t7cmd", tokenIds: tokenIds },
    });
    return askAuction;
  },
  async fetchBidAuction({ commit }, {tokenIds}) {
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
    } = await this.$axios.post("https://dipdup.playjoko.com/v1/graphql", {
      query,
      variables: { tokenAddress: "KT18bPNxdKzk7XqYEfKp6mS4un7X64Ho6mkR", tokenIds: tokenIds },
    });
    return bid;
  },
  async fetchEnglishAuction({ commit }, {tokenId}) {
    const query = `
    query MyQuery($tokenAddress: String, $tokenId: String="") {
      english_auction(
        where: {token: {token_id: {_eq: $tokenId}}, fa_contract: {_eq: $tokenAddress}}
        order_by: {timestamp: desc}
        limit: 1
      ) {
        hash
        end_time
        start_time
        price_increment_xtz
        price_increment
        highest_bidder_address
        highest_bid_xtz
        highest_bid
        reserve_xtz
        reserve
        seller_address
        extension_time
      }
    }           
    `;
    const {
      data: {
        data: { english_auction },
      },
    } = await this.$axios.post("https://data.objkt.com/v3/graphql", {
      query,
      variables: { tokenAddress: "KT1Mjhps6Cwmua19eMnHBwuBuESSyMsvRTig", tokenId: "1" },
    });
    return english_auction;
  },

  /*
    Fetch buy and sell from Rarible
  */
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
    } = await this.$axios.post("https://dipdup.playjoko.com/v1/graphql", {
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
    } = await this.$axios.post("https://dipdup.playjoko.com/v1/graphql", {
      query,
      variables: { tokenAddress: "KT1JkaXjdxrWSrVjXzufTgdJTJC9UoQjkveW", 
                  tokenIds: tokenIds },
    });
    return buy;
  },
  
};
