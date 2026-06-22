// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {

    struct Campaign {
        address payable creator;
        uint goal;
        uint fundsRaised;
        uint durationMonths;
        uint deadline;
        bool completed;
    }

    uint public campaignCount;
    mapping(uint => Campaign) public campaigns;

    // Create campaign
    function createCampaign(uint _goal, uint _durationMonths) public {
        require(_goal > 0, "Goal must be greater than 0");
        require(_durationMonths > 0, "Duration must be greater than 0");

        campaignCount++;

        campaigns[campaignCount] = Campaign(
            payable(msg.sender),
            _goal,
            0,
            _durationMonths,
            block.timestamp + (_durationMonths * 30 days),
            false
        );
    }

    // Contribute with full validation
    function contribute(uint _id) public payable {

        require(_id > 0 && _id <= campaignCount, "Invalid campaign ID");

        Campaign storage campaign = campaigns[_id];

        require(!campaign.completed, "Campaign already completed");

        require(block.timestamp <= campaign.deadline, "Campaign deadline passed");

        require(msg.value > 0, "Send some ETH");

        // Optional: restrict exceeding goal
        require(
            campaign.fundsRaised + msg.value <= campaign.goal,
            "Exceeds goal"
        );

        campaign.fundsRaised += msg.value;

        // If goal is reached
        if (campaign.fundsRaised == campaign.goal) {
            campaign.completed = true;

            (bool success, ) = campaign.creator.call{value: campaign.fundsRaised}("");
            require(success, "Transfer failed");
        }
    }

    // Get campaign details for the UI
    function getCampaign(uint _id) public view returns (
        address creator,
        uint goal,
        uint fundsRaised,
        uint durationMonths,
        uint deadline,
        bool completed
    ) {
        require(_id > 0 && _id <= campaignCount, "Invalid ID");

        Campaign memory c = campaigns[_id];
        return (c.creator, c.goal, c.fundsRaised, c.durationMonths, c.deadline, c.completed);
    }
}
