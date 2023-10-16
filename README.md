## Task

Setup a nodejs backend with a single endpoint that fetches position trade data for a given user address.

### API endpoint

## Naming & Query Parameters

Endpoint naimg & query parameters is left upto your discretion.

## Return data type

The endpoint should return the `Position[]` type in the types.ts file.å

## Required data

`useGetPositions` function in utils is a function used to fetch a user's positions data in the frontend. you'll be writing it to fit nodejs usage. Feel free make structural changes to code where neccessary.
The gmxfactory contract holding necessary functions for this is also included the contracts folder.

## Helpful resources

The utils folder contains files with neccessary functions, addresses & info to aid the data fetching process.
The functions in utils are functions used in the frontend(react) & will need to be refactored to accomodate use in nodejs(typescript)

Helpful link
https://github.com/gmx-io/gmx-interface/blob/c9ada749522671d65db8832f8398e13dede84b1b/src/pages/Exchange/Exchange.js#L136

## Missing variables and where to fetch them

- tokenBalances - `getTokenBalances` in Reader contract
- fundingRate - `getFundingRates` in Reader contract
- tokenInfo - `getVaultTokenInfoV4` to VaultReader contract

## Testing Contract

GmxFactory contract isn't verified so, make use of https://remix.ethereum.org/.

## Stack

- typescript
- nodejs web framework of choice
- viem/etherjs for ethereum framework

## Notes

Things will be looking at:

- Typescript usage
- Error handling
- Rpc management for ethereum.
- Api practices eg. code versioning, status code usage etc.

You'll be filling a few blank spaces in terms of functions & utility. Codebase should be clean & production-esque as possible.

## Submission & Issues

Create a PR with your deployed api link & github repo.
Feel free to open an issue if certain information is missing or for any errors.
