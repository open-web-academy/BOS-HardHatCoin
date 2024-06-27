use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    env, near_bindgen, AccountId, Balance, PanicOnDefault, Promise, Gas, require, log, PromiseResult
};
use near_sdk::json_types::U128;
pub use crate::xcc::*;
pub use crate::migrate::*;

mod xcc;
mod migrate;

const YOCTO_FT: u128 = 1_000_000_000_000_000_000;

pub type EpochHeight = u64;

// Definition of structures
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
    pub winners: Vec<Winner>,
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
    pub winners: Vec<Winner>,
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

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Winner {
    account: String,
    bid: Balance,
    hat_amount: Balance,
}


#[near_bindgen]
impl Contract {
    /// Initializes the contract with owner, fungible token address, total supply, tokens per auction, and auction duration.
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

    /// Constructor for the contract. Creates a new instance of the contract with initial information.
    #[init]
    pub fn new(owner_id: AccountId, ft_address: AccountId, total_supply: Balance, tokens_per_auction: Balance, auction_duration: EpochHeight) -> Self {
        let auction_info = AuctionInfo {
            start_time: 0,
            end_time: 0,
            highest_bid: 0,
            highest_bidder: String::default(),
            claimed: false,
            highest_bid_temp: 0,
        };

        let this = Self {
            owner_id,
            ft_address,
            total_supply,
            current_supply: total_supply,
            tokens_per_auction: tokens_per_auction,
            auction_duration,
            auction_info: auction_info,
            winners: Vec::new(),
        };

        this
    }

    /// Retrieves the current supply of tokens.
    pub fn get_current_supply(&self) -> Balance {
        return self.current_supply;
    }

    /// Retrieves the current auction information.
    pub fn get_auction_info(&self) -> AuctionInfo {
        return self.auction_info.clone();
    }

    /// Retrieves the number of tokens per auction.
    pub fn get_tokens_per_auction(&self) -> Balance {
        return self.tokens_per_auction;
    }

    /// Retrieves the list of auction winners.
    pub fn get_winners(&self) -> Vec<Winner> {
        self.winners.clone()
    }

    pub fn get_winners_pagination(&self, page: u64, page_size: u64) -> Vec<Winner> {
        // Invertir el vector de ganadores
        let mut reversed_winners = self.winners.clone();
        reversed_winners.reverse();
    
        // Calcular el índice inicial basado en la página actual y el tamaño de la página
        let winners_len = reversed_winners.len() as u64;
    
        // Verificar si la lista de ganadores está vacía
        if winners_len == 0 {
            log!("La lista de ganadores está vacía.");
            return vec![];
        }
    
        // Calcular el índice inicial
        let start = page * page_size;
    
        // Calcular el índice final y asegurarse de que no exceda el tamaño del vector
        let end = if start + page_size > winners_len {
            winners_len
        } else {
            start + page_size
        };
    
        log!("Mostrando ganadores desde el índice {} hasta el índice {}", start, end);
    
        // Retornar la porción de la lista de ganadores correspondiente a la página solicitada
        reversed_winners[start as usize..end as usize].to_vec()
    }

    /// Retrieves the number of auction winners.
    pub fn get_winners_number(&self) -> u64 {
        let winners_len = self.winners.len() as u64;
        return winners_len; 
    }

    /// Function to claim tokens after an auction has ended.
    #[payable]
    pub fn claim_tokens(&mut self) -> Promise {
        let deposit = env::attached_deposit();

        log!("deposit: {}",deposit); 

        if self.auction_info.start_time == 0  {
            env::panic_str("No active auction");
        }

        if self.auction_info.claimed {
            env::panic_str("Auction already claimed");
        }

        if env::block_timestamp() < self.auction_info.end_time {
            env::panic_str("Auction not finished");
        }

        if deposit < 10000000000000000000000{
            env::panic_str("Deposit must be 0.01 NEAR");
        }

        let highest_bidder = self.auction_info.highest_bidder.clone();

        let call = ft_contract::storage_balance_of(
            highest_bidder.clone().to_string(),
            self.ft_address.clone(),
            0,
            Gas(50_000_000_000_000)
                
        );

        let callback = ext_self::send_rewards(
            "auctions.hat-coin.near".parse::<AccountId>().unwrap(),
            deposit,
            Gas(150_000_000_000_000)
        );

        call.then(callback)


    }

    #[payable]
    pub fn send_rewards(&mut self) -> String{
        assert_eq!(
            env::promise_results_count(),
            1,
            "Éste es un método callback"
        );
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Failed => {
                "Error".to_string()
            },
            PromiseResult::Successful(_result) => {
                let value = std::str::from_utf8(&_result).unwrap();

                log!("value: {}",value); 

                if value == "null".to_string() {
                    env::panic_str("The account does not have a storage deposit in ft contract");
                }

                let highest_bidder = self.auction_info.highest_bidder.clone();
                let deposit = env::attached_deposit();

                log!("deposit: {}",deposit); 

                ft_contract::ft_transfer(
                    highest_bidder.clone().to_string(),
                    U128::from(self.tokens_per_auction.clone()*YOCTO_FT),
                    None,
                    self.ft_address.clone(),
                    1,
                    Gas(100_000_000_000_000)
                );
            
                log!("Deposit to winner: {}",self.tokens_per_auction.clone()*YOCTO_FT); 
            
                // Send tokens to OWA DAO
                Promise::new("open-web-academy.sputnik-dao.near".parse::<AccountId>().unwrap()).transfer(self.auction_info.highest_bid);
            
                self.auction_info.claimed = true;
            
                self.current_supply -= self.tokens_per_auction;
            
                self.winners.push(Winner {
                    account: self.auction_info.highest_bidder.clone(),
                    bid: self.auction_info.highest_bid.clone(),
                    hat_amount: self.tokens_per_auction,
                });
            
                return "Tokens successfully claimed".to_string();
            }
        }
    }

    /// Function to start a new auction or place a bid in an ongoing auction.
    #[payable]
    pub fn start_or_place_bid(&mut self) -> String {
        let bidder = env::predecessor_account_id();
        let amount = env::attached_deposit();
        let current_timestamp = env::block_timestamp();

        require!( self.current_supply >= self.tokens_per_auction, "Current supply is less than the number of tokens per auction");
    
        if self.auction_info.start_time == 0 {
            require!( amount >= 1000000000000000000000000, "The bid must be higher than or equal to 1 NEAR");

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

            return format!("A new auction has started by {}", bidder);
        }
    
        if current_timestamp >= self.auction_info.start_time && current_timestamp <= self.auction_info.end_time {
            require!(amount >=  self.auction_info.highest_bid+490000000000000000000000, "The bid must be higher than the current one by at least 0.5 NEAR");

            if amount > self.auction_info.highest_bid {

                Promise::new(self.auction_info.highest_bidder.clone().parse::<AccountId>().unwrap()).transfer(self.auction_info.highest_bid);

                if (self.auction_info.end_time-current_timestamp) < 600000000000 {
                    self.auction_info.end_time += 600000000000;
                }     

                self.auction_info.highest_bid = amount;
                self.auction_info.highest_bidder = bidder.to_string();

                return format!("Bid placed successfully by {}", bidder);
            }
            
            Promise::new(bidder.clone()).transfer(amount);

            return "The bid is less than or equal to the current one".to_string();
        } else {
            
            require!( amount >= 1000000000000000000000000, "The bid must be higher than or equal to 1 NEAR");
            
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
            return "A new auction has started".to_string();
        }
    }
    
    /// Function to change the token supply.
    pub fn change_tokens_supply(&mut self, amount: Balance) {
        self.assert_owner();
        self.total_supply = amount;
        self.current_supply= amount;
    }

    /// Function to change the tokens per auction.
    pub fn change_tokens_per_auction(&mut self, amount: Balance) {
        self.assert_owner();
        self.tokens_per_auction = amount;
    }
    
    /// Function to change the auction duration.
    pub fn change_auction_duration(&mut self, new_duration: EpochHeight) {
        self.assert_owner();
        self.auction_duration = new_duration;
    }

    /// Function to change the fungible token address.
    pub fn change_ft_address(&mut self, ft_address: AccountId) {
        self.assert_owner();
        self.ft_address = ft_address;
    }

    /// Function to change the owner of the contract.
    pub fn change_owner(&mut self, owner_id: AccountId) {
        self.assert_owner();
        self.owner_id = owner_id;
    }

    /// Verifies if the signer is the owner of the contract.
    fn assert_owner(&self) {
        require!(self.signer_is_owner(), "Method is private to owner")
    }

    /// Checks if the signer is the owner of the contract.
    fn signer_is_owner(&self) -> bool {
        self.is_owner(&env::predecessor_account_id())
    }

    /// Checks if a given account ID is the owner of the contract.
    fn is_owner(&self, minter: &AccountId) -> bool {
        minter.as_str() == self.owner_id.as_str()
    }

    /// Method to finish auction
    pub fn finish_auction(&mut self) {
        self.assert_owner();
        self.auction_info.end_time = 0;
    }
}