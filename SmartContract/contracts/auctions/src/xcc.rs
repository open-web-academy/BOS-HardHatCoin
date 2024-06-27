use near_sdk::{ext_contract};
use near_sdk::json_types::U128;
pub const NO_DEPOSIT: u128 = 0;
pub const XCC_SUCCESS: u64 = 1;

#[ext_contract(ft_contract)]
pub trait ExternsContract {
    fn ft_transfer(
        &mut self, 
        receiver_id: String, 
        amount: U128, 
        memo: Option<String>
    );
    
    fn storage_balance_of(&self,account_id: String);
}

#[ext_contract(ext_self)]
trait NonFungibleTokenResolver {
    fn send_rewards(&mut self) -> String;
}