# crowdfunding-


## Project Summary

This repository is a **Blockchain Crowdfunding dApp** built with:

- `Solidity` smart contract
- `Hardhat` development environment
- `Web3.js` front-end integration
- local static server for browser interaction

---

## What it does

- Lets users create crowdfunding campaigns on a blockchain contract
- Allows donors to contribute ETH to a campaign by ID
- Automatically marks a campaign complete and transfers funds to the creator when the goal is reached
- Tracks campaign goal, funds raised, duration, deadline, and completion status

---

## Key files

- contract.sol
  - Solidity `Crowdfunding` contract
  - Supports `createCampaign`, `contribute`, and `getCampaign`
- deploy.js
  - Deploys the contract via Hardhat/viem
  - Writes contract-config.js with contract address and ABI
- serve.js
  - Serves the frontend locally
- index.html
  - UI for connecting wallet, creating campaigns, donating, and viewing campaigns
- styles.css
  - Frontend styling
- package.json
  - Scripts for compile, test, deploy, serve, and Sepolia deployment
- contract-config.js
  - Generated runtime config for the frontend contract connection

---

## Technologies

- Solidity `^0.8.0`
- Hardhat
- `@nomicfoundation/hardhat-toolbox-viem`
- Web3.js frontend
- Local Hardhat / Sepolia deployment support

---



> A simple decentralized crowdfunding app that deploys a Solidity campaign contract using Hardhat, then connects a browser UI to the contract for creating campaigns and sending donations. Includes wallet connect support, campaign progress tracking, and local deployment utilities.

