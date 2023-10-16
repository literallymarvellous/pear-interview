import { DEFAULT_MAX_USDG_AMOUNT } from "./contants";
import { InfoTokens, Token, TokenInfo } from "./types";

const AddressZero = "0x"; // fix 

export function expandDecimals(n: bigint, decimals: number) {
  const bn = BigInt(n);
  const exp = BigInt(10) ** BigInt(decimals);
  return bn * exp;
}

export function getSpread(p: { minPrice: bigint; maxPrice: bigint }): bigint {
  const diff = p.maxPrice - p.minPrice;
  return bigintMulDiv(diff, PRECISION, bigintDiv(p.maxPrice + p.minPrice, 2));
}

export function getTokenInfo(
  infoTokens: InfoTokens,
  tokenAddress: string,
  replaceNative?: boolean,
  nativeTokenAddress?: string,
) {
  if (replaceNative && tokenAddress === nativeTokenAddress) {
    return infoTokens[AddressZero];
  }

  return infoTokens[tokenAddress];
}

export const useGetPositions = (
  account: string,
  infoTokens: InfoTokens,
  showlPnlAfterFees: boolean,
  isPnlInLeverage: boolean,
) => {
  const { chainId } = useChainId();

  const { data: positionsCount, refetch: positionsCountRefetch } =
    useReadPositionsCount(account);
  useInterval(positionsCountRefetch, REFRESH_RATE.veryFast);

  // console.log("p count", positionsCount)

  const { data: positionsIds, refetch: positionsIdsRefetch } =
    useReadPositionsIds(account, positionsCount);
  useInterval(positionsIdsRefetch, REFRESH_RATE.veryFast);

  const { data: positionsAdapters, refetch: positionsAdaptersRefetch } =
    useReadPositionsAdapters(positionsIds, positionsCount);

  const { data: positionsData, refetch: positionsDataRefetch } =
    useReadPositionsData(positionsIds, positionsCount);

  const { data: positionsRequestData, refetch: positionsRequestDataRefetch } =
    useReadPositionsRequestData(positionsAdapters, positionsCount);


  let positions: any = [];
  let positionIds: string[] = [];


  for (let i = 0; i < positionsCount; i++) {
    // Only add the positionId if it's not already in the array
    if (!positionIds.includes(positionsIds[i])) {
      positionIds.push(positionsIds[i]);

      const isLong = positionsRequestData[i][6];

      const collateralToken = getTokenInfo(
        infoTokens,
        positionsRequestData[i][1],
        true,
        getContract(chainId, 'NATIVE_TOKEN'),
      );
      const indexToken = getTokenInfo(
        infoTokens,
        positionsRequestData[i][2],
        true,
        getContract(chainId, 'NATIVE_TOKEN'),
      );

      const markPrice = isLong ? indexToken.minPrice : indexToken.maxPrice;
      // console.log("mark p", markPrice)

      const adapter = positionsAdapters[i];
      let contractKey = getPositionContractKey(
        adapter,
        positionsRequestData[i][1],
        positionsRequestData[i][2],
        isLong,
      );

      let positionInfo = {
        positionId: positionsIds[i],
        adapter,
        contractKey,
        collateralToken,
        indexToken,
        isLong,
        size: positionsData[i][0],
        collateral: positionsData[i][1],
        averagePrice: positionsData[i][2],
        entryFundingRate: positionsData[i][3],
        cumulativeFundingRate: collateralToken.cumulativeFundingRate,
        hasRealisedProfit: positionsData[i][4],
        realisedPnl: positionsData[i][5],
        lastIncreasedTime: positionsData[i][6],
        hasProfit: positionsData[i][7],
        delta: positionsData[i][8],
        markPrice,
      };
      positions.push(positionInfo);
    }
  }

  const { derivedPositions, positionsMap } = derivePositions(
    positions,
    account,
    chainId,
    showlPnlAfterFees,
    isPnlInLeverage,
  );
  const positionKeys = derivedPositions.map(
    (positions) => positions.contractKey,
  );

  return {
    positions: derivedPositions,
    positionKeys: positionKeys as `0x${string}`[],
    positionsIds: positionsIds as `0x${string}`[],
    positionsAdapters: positionsAdapters as `0x${string}`[],
    positionsMap,
  };
};

export function useInfoTokens(
  chainId: number,
  active: boolean,
  tokenBalances?: readonly bigint[],
  fundingRateInfo?: readonly bigint[],
  vaultPropsLength?: number,
) {
  const tokens = []; //tokens used in constants
  const vaultReaderAddress = ""
  const vaultAddress = ""
  const positionRouterAddress = ""
  const nativeTokenAddress = ""

  const whitelistedTokens = [] // get from constants.
  const whitelistedTokenAddresses = [] // derive from tokens

  // view function "getVaultTokenInfoV4" In `VaultReader` address
  const { data: vaultTokenInfo } = useVaultReaderGetVaultTokenInfoV4({
    address: vaultReaderAddress,
    args: [
      vaultAddress,
      positionRouterAddress,
      nativeTokenAddress,
      expandDecimals(1, 18),
      whitelistedTokenAddresses,
    ],
  });

  const indexPricesUrl = "" // serverUrl + '/prices'

  const { data: indexPrices } = useSWR([indexPricesUrl], {
    // @ts-ignore spread args incorrect type
    fetcher: (...args) => fetch(...args).then((res) => res.json()),
    refreshInterval: 500,
    refreshWhenHidden: true,
  });

  return {
    infoTokens: getInfoTokens(
      tokens,
      tokenBalances,
      whitelistedTokens,
      vaultTokenInfo,
      fundingRateInfo,
      vaultPropsLength,
      indexPrices,
      nativeTokenAddress,
    ),
  };
}

export function getInfoTokens(
  tokens: Token[],
  tokenBalances: readonly bigint[] | undefined,
  whitelistedTokens: Token[],
  vaultTokenInfo: readonly bigint[] | undefined,
  fundingRateInfo: readonly bigint[] | undefined,
  vaultPropsLength: number | undefined,
  indexPrices: { [address: string]: bigint },
  nativeTokenAddress: string,
): InfoTokens {
  if (!vaultPropsLength) {
    vaultPropsLength = 15;
  }
  const fundingRatePropsLength = 2;
  const infoTokens: InfoTokens = {};

  for (let i = 0; i < tokens.length; i++) {
    const token = JSON.parse(JSON.stringify(tokens[i])) as TokenInfo;

    if (tokenBalances) {
      token.balance = tokenBalances[i];
    }

    if (token.address === USDG_ADDRESS) {
      token.minPrice = expandDecimals(1, USD_DECIMALS);
      token.maxPrice = expandDecimals(1, USD_DECIMALS);
    }

    infoTokens[token.address] = token;
  }

  for (let i = 0; i < whitelistedTokens.length; i++) {
    const token = JSON.parse(JSON.stringify(whitelistedTokens[i])) as TokenInfo;

    if (vaultTokenInfo) {
      token.poolAmount = vaultTokenInfo[i * vaultPropsLength];
      token.reservedAmount = vaultTokenInfo[i * vaultPropsLength + 1];
      token.availableAmount = token.poolAmount - token.reservedAmount;
      token.usdgAmount = vaultTokenInfo[i * vaultPropsLength + 2];
      token.redemptionAmount = vaultTokenInfo[i * vaultPropsLength + 3];
      token.weight = vaultTokenInfo[i * vaultPropsLength + 4];
      token.bufferAmount = vaultTokenInfo[i * vaultPropsLength + 5];
      token.maxUsdgAmount = vaultTokenInfo[i * vaultPropsLength + 6];
      token.globalShortSize = vaultTokenInfo[i * vaultPropsLength + 7];
      token.maxGlobalShortSize = vaultTokenInfo[i * vaultPropsLength + 8];
      token.maxGlobalLongSize = vaultTokenInfo[i * vaultPropsLength + 9];
      token.minPrice = vaultTokenInfo[i * vaultPropsLength + 10];
      token.maxPrice = vaultTokenInfo[i * vaultPropsLength + 11];
      token.spread = getSpread({
        minPrice: token.minPrice,
        maxPrice: token.maxPrice,
      });
      token.guaranteedUsd = vaultTokenInfo[i * vaultPropsLength + 12];
      token.maxPrimaryPrice = vaultTokenInfo[i * vaultPropsLength + 13];
      token.minPrimaryPrice = vaultTokenInfo[i * vaultPropsLength + 14];

      // save minPrice and maxPrice as setTokenUsingIndexPrices may override it
      token.contractMinPrice = token.minPrice;
      token.contractMaxPrice = token.maxPrice;

      token.maxAvailableShort = BigInt(0);

      token.hasMaxAvailableShort = false;
      if (token.maxGlobalShortSize > 0) {
        token.hasMaxAvailableShort = true;
        if (token.maxGlobalShortSize > token.globalShortSize) {
          token.maxAvailableShort =
            token.maxGlobalShortSize - token.globalShortSize;
        }
      }

      if (token.maxUsdgAmount && token.maxUsdgAmount === BigInt(0)) {
        token.maxUsdgAmount = DEFAULT_MAX_USDG_AMOUNT;
      }

      token.availableUsd = token.isStable
        ? (token.poolAmount * token.minPrice) /
        expandDecimals(1, token.decimals)
        : (token.availableAmount * token.minPrice) /
        expandDecimals(1, token.decimals);

      token.maxAvailableLong = BigInt(0)!;
      token.hasMaxAvailableLong = false;
      if (token.maxGlobalLongSize > 0) {
        token.hasMaxAvailableLong = true;

        if (token.maxGlobalLongSize > token.guaranteedUsd) {
          const remainingLongSize =
            token.maxGlobalLongSize - token.guaranteedUsd;
          token.maxAvailableLong =
            remainingLongSize < token.availableUsd
              ? remainingLongSize
              : token.availableUsd;
        }
      } else {
        token.maxAvailableLong = token.availableUsd;
      }

      token.maxLongCapacity =
        token.maxGlobalLongSize > 0 &&
          token.maxGlobalLongSize < token.availableUsd + token.guaranteedUsd
          ? token.maxGlobalLongSize
          : token.availableUsd + token.guaranteedUsd;

      token.managedUsd = token.availableUsd + token.guaranteedUsd;
      token.managedAmount =
        (token.managedUsd * expandDecimals(1, token.decimals)) / token.minPrice;

      setTokenUsingIndexPrices(token, indexPrices, nativeTokenAddress);
    }

    if (fundingRateInfo) {
      token.fundingRate = fundingRateInfo[i * fundingRatePropsLength];
      token.cumulativeFundingRate =
        fundingRateInfo[i * fundingRatePropsLength + 1];
    }

    if (infoTokens[token.address]) {
      token.balance = infoTokens[token.address].balance;
    }

    infoTokens[token.address] = token;
  }

  return infoTokens;
}

function setTokenUsingIndexPrices(
  token: TokenInfo,
  indexPrices: { [address: string]: bigint },
  nativeTokenAddress: string,
) {
  if (!indexPrices) {
    return;
  }

  const tokenAddress = token.isNative ? nativeTokenAddress : token.address;

  const indexPrice = indexPrices[tokenAddress];

  if (!indexPrice) {
    return;
  }

  const indexPriceBn = BigInt(indexPrice)!;

  if (indexPriceBn === BigInt(0)) {
    return;
  }

  const spread = token.maxPrice! - token.minPrice!;
  const spreadBps = spread;
  bigintMulDiv(
    spread,
    BASIS_POINTS_DIVISOR,
    bigintDiv(token.maxPrice! + token.minPrice!, 2),
  );

  if (spreadBps > bigintSub(MAX_PRICE_DEVIATION_BASIS_POINTS, 50)) {
    // only set one of the values as there will be a spread between the index price and the Chainlink price
    if (indexPriceBn > token.minPrimaryPrice!) {
      token.maxPrice = indexPriceBn;
    } else {
      token.minPrice = indexPriceBn;
    }
    return;
  }

  const halfSpreadBps = Number(bigintDiv(spreadBps, 2));
  token.maxPrice = indexPriceBn;
  bigintMulDiv(
    indexPriceBn,
    BASIS_POINTS_DIVISOR + halfSpreadBps,
    BASIS_POINTS_DIVISOR,
  );
  token.minPrice = indexPriceBn;
  bigintMulDiv(
    indexPriceBn,
    BASIS_POINTS_DIVISOR - halfSpreadBps,
    BASIS_POINTS_DIVISOR,
  );
}