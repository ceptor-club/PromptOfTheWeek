# Project Notes

Used the Chainlink Functions starter kit as the base. The following files are new:

> apify-request.js
> helper-hardhat-config.js
> contracts/Prompt.sol
> deploy/00-deploy-prompt.js

The objective of this Hackathon was to create a contract that houses what's called the "Prompt of the Week", a suggested challenge to generate AI image and consequently mint Ceptor Collectibles in that theme. The contract can be found here:

https://sepolia.etherscan.io/address/0x8dfec628e42cc35665c621ad04e03dc627d15432

The contract houses 10 prompts in an array. Chainlink VRF chooses the prompt and Chainlink Automation triggers the VRF request once a week. The previous objective was to create a automate the prompt being posted to twitter using QuickNode and then using Twitter-scraper from the apify-request script to get likes to choose the most popular minted NFT that aligns with the challenge of the week. Unfortunately Twitter API caused development hurdles which lead to the far too delayed development of chainlink functions. 

The contract can still be deployed using

> npm hardhat deploy --tags 00 --network ethereumSepolia

Please check networks.js for network information. 