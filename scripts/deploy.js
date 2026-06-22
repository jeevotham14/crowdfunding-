import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { network } from "hardhat";

const selectedNetwork =
  process.env.HARDHAT_NETWORK ??
  process.env.DEPLOY_NETWORK ??
  "localhost";
const { viem } = await network.create({ network: selectedNetwork });
const crowdfunding = await viem.deployContract("Crowdfunding");
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const artifactPath = path.join(
  rootDir,
  "artifacts",
  "contracts",
  "contract.sol",
  "Crowdfunding.json",
);
const artifact = JSON.parse(await readFile(artifactPath, "utf8"));
const configContents =
  "window.contractConfig = " +
  JSON.stringify(
    {
      address: crowdfunding.address,
      abi: artifact.abi,
    },
    null,
    4,
  ) +
  ";\n";

await writeFile(path.join(rootDir, "contract-config.js"), configContents, "utf8");

console.log(`Network: ${selectedNetwork}`);
console.log(`Crowdfunding deployed to: ${crowdfunding.address}`);
console.log(`Initial campaign count: ${await crowdfunding.read.campaignCount()}`);
console.log("Updated contract-config.js with the latest deployment.");
