use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    env, near_bindgen, AccountId, Balance, PanicOnDefault, Promise, Gas, require, log, assert_one_yocto
};

pub use crate::xcc::*;
pub use crate::migrate::*;

mod xcc;
mod migrate;

const YOCTO_FT: u128 = 1_000_000_000_000_000_000;

pub type EpochHeight = u64;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct OldContract {
    pub owner_id: AccountId,
    pub ft_address: AccountId,
    pub total_supply: Balance,
    pub current_supply: Balance,
    pub tokens_per_auction: Balance,
    pub auction_duration: EpochHeight,
    pub auction_info: AuctionInfo,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    pub owner_id: AccountId,
    pub ft_address: AccountId,
    pub total_supply: Balance,
    pub current_supply: Balance,
    pub tokens_per_auction: Balance,
    pub auction_duration: EpochHeight,
    pub auction_info: AuctionInfo,
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct AuctionInfo {
    start_time: EpochHeight,
    end_time: EpochHeight,
    highest_bid: Balance,
    highest_bidder: String,
    claimed: bool,
    highest_bid_temp: Balance,
}


#[near_bindgen]
impl Contract {
    #[init]
    pub fn init_contract(owner_id: AccountId, ft_address: AccountId, total_supply: Balance, tokens_per_auction: Balance, auction_duration: EpochHeight) -> Self {
        Self::new(
            owner_id,
            ft_address,
            total_supply,
            tokens_per_auction,
            auction_duration
        )
    }

    #[init]
    pub fn new(owner_id: AccountId, ft_address: AccountId, total_supply: Balance, tokens_per_auction: Balance, auction_duration: EpochHeight) -> Self {
        let auction_info = AuctionInfo {
            start_time: 0,
            end_time: 0,
            highest_bid: 0,
            highest_bidder: String::default(),
            claimed: false,
            highest_bid_temp: 0
        };

        let this = Self {
            owner_id,
            ft_address,
            total_supply,
            current_supply: total_supply,
            tokens_per_auction: tokens_per_auction,
            auction_duration,
            auction_info: auction_info,
        };

        this
    }

    pub fn get_current_supply(&self) -> Balance {
        return self.current_supply;
    }

    pub fn get_auction_info(&self) -> AuctionInfo {
        return self.auction_info.clone();
    }

    pub fn get_tokens_per_auction(&self) -> Balance {
        return self.tokens_per_auction;
    }

    #[payable]
    pub fn claim_tokens(&mut self) -> String {
        let deposit = env::attached_deposit();

        if self.auction_info.start_time == 0  {
            return "No active auction".to_string();
        }

        if self.auction_info.claimed {
            return "Auction already claimed".to_string();
        }

        if env::block_timestamp() < self.auction_info.end_time {
            return "Auction not finished".to_string();
        }

        let highest_bidder = self.auction_info.highest_bidder.clone();

        assert_one_yocto();
        
        ext_c::ft_transfer(
            (self.tokens_per_auction.clone()*YOCTO_FT).to_string(),
            highest_bidder.clone().to_string(),
            self.ft_address.clone(),
            deposit,
            Gas(100_000_000_000_000)
        );

        self.auction_info.claimed = true;

        self.current_supply -= self.tokens_per_auction;

        return "Tokens successfully claimed".to_string();

    }

    #[payable]
    pub fn start_or_place_bid(&mut self) -> String {
        let bidder = env::predecessor_account_id();
        let amount = env::attached_deposit();
        let current_timestamp = env::block_timestamp();

        if amount > self.auction_info.highest_bid_temp {
            self.auction_info.highest_bid_temp = amount;
        } else {
            Promise::new(bidder.clone()).transfer(amount);
            return "A bid of the same value has just been made".to_string();
        }
    
        if self.auction_info.start_time == 0 {
            //require!(amount < 1000000000000000000000000, "Deposit must be greater than or equal to 1 NEAR");

            let new_start_time = current_timestamp;
            let new_end_time = current_timestamp + self.auction_duration;
            self.auction_info = AuctionInfo {
                start_time: new_start_time,
                end_time: new_end_time,
                highest_bid: amount,
                highest_bidder: bidder.to_string().clone(),
                claimed: false,
                highest_bid_temp: 0
            };
            self.auction_info.highest_bid_temp = 0;
            return format!("A new auction has started by {}", bidder);
        }
    
        if current_timestamp >= self.auction_info.start_time && current_timestamp <= self.auction_info.end_time {
            //require!(amount > (self.auction_info.highest_bid+100000000000000000000000), "The bid must be higher than the current one by at least 0.1 NEAR");
            if amount > self.auction_info.highest_bid {

                Promise::new(self.auction_info.highest_bidder.clone().parse::<AccountId>().unwrap()).transfer(self.auction_info.highest_bid);

                if (self.auction_info.end_time-current_timestamp) < 600000000000 {
                    self.auction_info.end_time += 600000000000;
                }     

                self.auction_info.highest_bid = amount;
                self.auction_info.highest_bidder = bidder.to_string();
                self.auction_info.highest_bid_temp = 0;

                return format!("Bid placed successfully by {}", bidder);
            }
            
            self.auction_info.highest_bid_temp = 0;
            Promise::new(bidder.clone()).transfer(amount);

            return "The bid is less than or equal to the current one".to_string();
        } else {
            if !self.auction_info.claimed {
                ext_c::ft_transfer(
                    (self.tokens_per_auction.clone()*YOCTO_FT).to_string(),
                    self.auction_info.highest_bidder.clone().to_string(),
                    self.ft_address.clone(),
                    1,
                    Gas(100_000_000_000_000)
                );

                self.current_supply -= self.tokens_per_auction;

                self.auction_info.claimed = true;
            }
            //require!(amount < 1000000000000000000000000, "Deposit must be greater than or equal to 1 NEAR");
            let new_start_time = current_timestamp;
            let new_end_time = current_timestamp + self.auction_duration;
            self.auction_info = AuctionInfo {
                start_time: new_start_time,
                end_time: new_end_time,
                highest_bid: amount,
                highest_bidder: bidder.to_string(),
                claimed: false,
                highest_bid_temp: 0
            };
            self.auction_info.highest_bid_temp = 0;
            return "A new auction has started".to_string();
        }
    }
    
    pub fn change_tokens_supply(&mut self, amount: Balance) {
        self.assert_owner();
        self.total_supply = amount;
        self.current_supply= amount;
    }

    pub fn change_tokens_per_auction(&mut self, amount: Balance) {
        self.assert_owner();
        self.tokens_per_auction = amount;
    }
    
    pub fn change_auction_duration(&mut self, new_duration: EpochHeight) {
        self.assert_owner();
        self.auction_duration = new_duration;
    }

    pub fn change_ft_address(&mut self, ft_address: AccountId) {
        self.assert_owner();
        self.ft_address = ft_address;
    }

    pub fn change_owner(&mut self, owner_id: AccountId) {
        self.assert_owner();
        self.owner_id = owner_id;
    }

    fn assert_owner(&self) {
        require!(self.signer_is_owner(), "Method is private to owner")
    }

    fn signer_is_owner(&self) -> bool {
        self.is_owner(&env::predecessor_account_id())
    }

    fn is_owner(&self, minter: &AccountId) -> bool {
        minter.as_str() == self.owner_id.as_str()
    }

    pub fn finish_auction(&mut self) {
        self.assert_owner();
        self.auction_info.end_time = 0;
    }
}