# Auctions HAT Token

<img src="https://github.com/open-web-academy/BOS-HardHatCoin/blob/main/assets/icon.png" width="30%">

## Description

The following repository contains the necessary files to deploy the smart contract used for the HAT token auctions, as well as the code used for the graphical interface that will interact with the contract.

## $HAT Auction Mechanism

78% of the treasury ($19,266,000,000 $HAT) will be auctioned every 24 hours for 1000 days - totaling 19,266,000 $HAT daily.

During a 24-hour period, $HAT will be auctioned, accepting $NEAR tokens. The highest bid will win the $HAT. If there are less than 10 minutes remaining in the bidding period, the last bid will extend the period by 10 minutes.

Bid starts at 2 NEARs, increase in minimum 0.5 NEAR.

All NEAR tokens collected will go to the treasury of Open Web Academy.

## Participate in an auction step by step.

### Start Auction

To start an auction, you will first need to enter the amount of NEAR to bid. As mentioned in previous sections, the initial bid must be at least 2 NEARs with increments of 0.5 NEAR. Once the amount is entered, you should click on the "Start new auction" button, which will launch a transaction that you need to accept to initiate the auction.

<img src="https://github.com/open-web-academy/BOS-HardHatCoin/blob/main/assets/startNewAuction.png" width="50%">

### Place a Bid

If the auction is already in progress, we must enter an amount higher than the current bid (increments of 0.5 NEAR). Then, we need to click on the "Place bid" button, which will launch a transaction that we need to accept to send our bid.

<img src="https://github.com/open-web-academy/BOS-HardHatCoin/blob/main/assets/placeBid.png" width="50%">

### Claim Rewards

Once an auction has ended, there are two ways to claim the HAT's won. The first is if another user starts a new auction, which will internally send the tokens to the account with which we won the auction. The second way is if no one has started a new auction, then upon accessing the application, we will see that to start a new auction, we must first claim the previously won tokens. To do this, we need to click on the "Claim HAT's" button, which will launch a transaction that we need to accept to send the won tokens to our account.

<img src="https://github.com/open-web-academy/BOS-HardHatCoin/blob/main/assets/claim.png" width="50%">

### Winners List

At the bottom, we can see the list of past winners, where we can check the information of who won as well as the amount of NEARs bid in that auction.

<img src="https://github.com/open-web-academy/BOS-HardHatCoin/blob/main/assets/winnersList.png" width="50%">

