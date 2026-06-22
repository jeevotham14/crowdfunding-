import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("Crowdfunding", async function () {
  const { networkHelpers, viem } = await network.create();
  const publicClient = await viem.getPublicClient();
  const [creator, donor] = await viem.getWalletClients();

  it("creates a campaign and stores its goal and deadline", async function () {
    const crowdfunding = await viem.deployContract("Crowdfunding");

    await crowdfunding.write.createCampaign([100n, 2n], {
      account: creator.account,
    });

    const campaignCount = await crowdfunding.read.campaignCount();
    const campaign = await crowdfunding.read.getCampaign([1n]);
    const block = await publicClient.getBlock();

    assert.equal(campaignCount, 1n);
    assert.equal(campaign[0].toLowerCase(), creator.account.address.toLowerCase());
    assert.equal(campaign[1], 100n);
    assert.equal(campaign[2], 0n);
    assert.equal(campaign[3], 2n);
    assert.equal(campaign[4], block.timestamp + 60n * 24n * 60n * 60n);
    assert.equal(campaign[5], false);
  });

  it("completes a campaign when a donation reaches the goal", async function () {
    const crowdfunding = await viem.deployContract("Crowdfunding");

    await crowdfunding.write.createCampaign([100n, 1n], {
      account: creator.account,
    });

    const balanceBefore = await publicClient.getBalance({
      address: creator.account.address,
    });

    await crowdfunding.write.contribute([1n], {
      account: donor.account,
      value: 100n,
    });

    const campaign = await crowdfunding.read.getCampaign([1n]);
    const balanceAfter = await publicClient.getBalance({
      address: creator.account.address,
    });

    assert.equal(campaign[2], 100n);
    assert.equal(campaign[5], true);
    assert.equal(balanceAfter - balanceBefore, 100n);
  });

  it("rejects donations that exceed the campaign goal", async function () {
    const crowdfunding = await viem.deployContract("Crowdfunding");

    await crowdfunding.write.createCampaign([100n, 1n], {
      account: creator.account,
    });

    await assert.rejects(
      crowdfunding.write.contribute([1n], {
        account: donor.account,
        value: 101n,
      }),
      /Exceeds goal/,
    );
  });

  it("rejects donations after the campaign deadline", async function () {
    const crowdfunding = await viem.deployContract("Crowdfunding");

    await crowdfunding.write.createCampaign([100n, 1n], {
      account: creator.account,
    });

    await networkHelpers.time.increase(30 * 24 * 60 * 60 + 1);

    await assert.rejects(
      crowdfunding.write.contribute([1n], {
        account: donor.account,
        value: 1n,
      }),
      /Campaign deadline passed/,
    );
  });

  it("rejects campaigns without a duration", async function () {
    const crowdfunding = await viem.deployContract("Crowdfunding");

    await assert.rejects(
      crowdfunding.write.createCampaign([100n, 0n], {
        account: creator.account,
      }),
      /Duration must be greater than 0/,
    );
  });
});
