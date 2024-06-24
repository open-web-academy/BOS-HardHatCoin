## Description 📄

Auction contract for the HAT token.

## Contract Methods 🚀

Assign the identifier of our deployed contract to a constant (Replace AUCTION_CONTRACT with the deployed contract's identifier):
 
    Auctions
    AUCTION_CONTRACT=auctions.hat-coin.near
    echo $AUCTION_CONTRACT

    FT
    FT_CONTRACT=hat.tkn.near
    echo $FT_CONTRACT

Contract initialization:

    Auctions
    NEAR_ENV=mainnet near call $AUCTION_CONTRACT init_contract '{"owner_id":"'$AUCTION_CONTRACT'","ft_address":"'$FT_CONTRACT'","total_supply":19266000000, "tokens_per_auction": 19266000,  "auction_duration":86400000000000}' --accountId $AUCTION_CONTRACT

### Auctions

Get current token balance:

    NEAR_ENV=mainnet near view $AUCTION_CONTRACT get_current_supply

Change FT contract address:

    NEAR_ENV=mainnet near call $AUCTION_CONTRACT change_ft_address '{"ft_address":"lion.dev-1634069815926-48042760709553"}' --accountId $AUCTION_CONTRACT --gas 300000000000000

Change FT supply:

    NEAR_ENV=mainnet near call $AUCTION_CONTRACT change_tokens_supply '{"amount":19266000000}' --accountId $AUCTION_CONTRACT --gas 300000000000000

Get auction:

    NEAR_ENV=mainnet near view $AUCTION_CONTRACT get_auction_info

Create bid:

    NEAR_ENV=mainnet near call $AUCTION_CONTRACT start_or_place_bid '{ }' --accountId yairnava.testnet --gas 300000000000000 --deposit 2

Claim tokens:

    NEAR_ENV=mainnet near call $AUCTION_CONTRACT claim_tokens '{}' --accountId auctions1.testnet --gas 300000000000000 --depositYocto

Change auction duration:

    NEAR_ENV=mainnet near call $AUCTION_CONTRACT change_auction_duration '{"new_duration":86400000000000}' --accountId $AUCTION_CONTRACT --gas 300000000000000

Finish auction:

    NEAR_ENV=mainnet near call $AUCTION_CONTRACT finish_auction  --accountId $AUCTION_CONTRACT --gas 300000000000000

Get winners list:

    NEAR_ENV=mainnet near view $AUCTION_CONTRACT get_winners

### FT

Register account in contract:

    NEAR_ENV=mainnet near call $FT_CONTRACT storage_deposit '{"account_id":"hat-auctions.testnet"}' --accountId yairnava.testnet --deposit 0.01

Verify registered account:
    
    NEAR_ENV=mainnet near view $FT_CONTRACT storage_balance_of '{"account_id":"hat-auctions.testnet"}'

Get token balance:

    NEAR_ENV=mainnet near view $FT_CONTRACT ft_balance_of '{"account_id":"auctions.hat-coin.near"}'

Display tokens in wallet:

    NEAR_ENV=mainnet near call $FT_CONTRACT ft_transfer '{ "receiver_id": "---", "amount": 0}' --accountId irvingnh.testnet --depositYocto