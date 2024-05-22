use near_sdk::{ext_contract};

#[ext_contract(ext_c)]
pub trait ExternsContract {
    fn ft_transfer (
        &mut self,
        amount: String,
        receiver_id: String
    );
}

#[ext_contract(ext_self)]
trait NonFungibleTokenResolver {
    
}