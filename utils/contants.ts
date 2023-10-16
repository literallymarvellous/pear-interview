import { expandDecimals } from "./utils";

const serverUrl = 'https://gmx-server-mainnet.uw.r.appspot.com'

// Arbitrum mainnet
const address = {
  tokens: {
    ETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    BTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    LINK: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
    UNI: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
    USDC: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    PIOU: '0xFffffF8244e4d4a906F9A70C13E91cB30E1Cb39A',
  },
  contracts: {
    GMX_READER: '0x22199a49A999c351eF7927602CFB187ec3cae489',
    GMX_VAULT: '0x489ee077994B6658eAfA855C308275EAd8097C4A',
    SALES_CONTRACT: '0x5a1efce55840e2f5b49f2ff7e5061712e6fa3151',
    GMX_FACTORY_ADDRESS: '0x75f688604a58c720E7e4496139765498A2563C78',
    POSITION_NFT: '0x3d8Cfe0f2d3A8E9481129d7769af1F6878746e17',
    GMX_POSITION_ROUTER: '0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868',
    NFT_HANDLER: '0x15aF6099951BF6E21C4B234392D59C1930531DE0',
  },
}

export const DEFAULT_MAX_USDG_AMOUNT = expandDecimals(200 * 1000 * 1000, 18);

// whitelisted tokens
export const TOKENS = {
  arbitrum: [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      address: '0x',
      isNative: true,
      isShortable: true,
      imageUrl:
        'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
    },
    {
      name: 'Wrapped Ethereum',
      symbol: 'WETH',
      decimals: 18,
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      isWrapped: true,
      baseSymbol: 'ETH',
      imageUrl:
        'https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295',
    },
    {
      name: 'Bitcoin (WBTC)',
      symbol: 'BTC',
      decimals: 8,
      address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      isShortable: true,
      imageUrl:
        'https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png?1548822744',
    },
    {
      name: 'Chainlink',
      symbol: 'LINK',
      decimals: 18,
      address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
      isStable: false,
      isShortable: true,
      imageUrl:
        'https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png?1547034700',
    },
    {
      name: 'Uniswap',
      symbol: 'UNI',
      decimals: 18,
      address: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
      isStable: false,
      isShortable: true,
      imageUrl:
        'https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png?1600306604',
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      isStable: true,
      imageUrl:
        'https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389',
    },
    {
      name: 'Tether',
      symbol: 'USDT',
      decimals: 6,
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      isStable: true,
      imageUrl:
        'https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png?1598003707',
    },
    {
      name: 'Dai',
      symbol: 'DAI',
      decimals: 18,
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      isStable: true,
      imageUrl:
        'https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734',
    },
    {
      name: 'Frax',
      symbol: 'FRAX',
      decimals: 18,
      address: '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F',
      isStable: true,
      imageUrl:
        'https://assets.coingecko.com/coins/images/13422/small/frax_logo.png?1608476506',
    },
    {
      name: 'Magic Internet Money',
      symbol: 'MIM',
      decimals: 18,
      address: '0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A',
      isStable: true,
      isTempHidden: true,
      imageUrl:
        'https://assets.coingecko.com/coins/images/16786/small/mimlogopng.png',
    },
  ],
};