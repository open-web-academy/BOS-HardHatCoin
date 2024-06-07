## Descripción 📄

Contrato de subastas para el token HAT.

## Métodos de los contratos 🚀

Asignamos el identificador de nuestro contrato desplegado a una constante (Sustituir el ID por el del contrato desplegado):

    Auctions
    ID=auctionshat.testnet
    echo $ID

Inicialización del contrato:

    Auctions
    near call $ID init_contract '{"owner_id":"auctionshat.testnet","ft_address":"lion.tokens.testnet",
    "total_supply":1000, "tokens_per_auction": 100,  "auction_duration":3600000000000}' --accountId $ID

### Auctions


Obtener balance actual de tokens:

    near view $ID get_current_supply

Cambiar contrato de ft:

    near call $ID change_ft_address '{"ft_address":"lion.tokens.testnet"}' --accountId $ID --gas 300000000000000

Cambiar supply de ft:

    near call $ID change_tokens_supply '{"amount":1000000}' --accountId $ID --gas 300000000000000

Consultar subasta:

    near view $ID get_auction_info

Crear puja:

    near call $ID start_or_place_bid '{ }' --accountId yairnava.testnet --gas 300000000000000 --deposit 1.000000000000000000000001

Probar intercambio de tokens:

    near call $ID transfer_near '{"bidder":"yairnava.testnet", "amount":1}' --accountId $ID --gas 300000000000000

    near call $ID transfer_ft '{"bidder":"yairnava.testnet", "amount":1}' --accountId $ID --gas 300000000000000 --deposit 0.000000000000000000000001

Reclamar tokens:

    near call $ID claim_tokens '{}' --accountId auctions1.testnet --gas 300000000000000 --deposit 0.000000000000000000000001

Cambiar duración subasta:

    near call $ID change_auction_duration '{"new_duration":900000000000}' --accountId $ID --gas 300000000000000

Finalizar subasta:

    near call $ID finish_auction  --accountId $ID --gas 300000000000000

Registrar cuenta en contrato

    near call lion.tokens.testnet storage_deposit '{"account_id":"yairtest1.testnet"}' --accountId yairnava.testnet --deposit 0.01

    near call lion.tokens.testnet ft_transfer '{"receiver_id":"lion.tokens.testnet", "amount": "0"}' --accountId yairtest2.testnet --depositYocto

Verificar cuenta registrada
    
    near view lion.tokens.testnet storage_balance_of '{"account_id":"syi216.testnet"}'

    near view lion.tokens.testnet ft_balance_of '{"account_id":"syi216.testnet"}'


## Construido con 🛠️
* [RUST](https://www.rust-lang.org/) - Lenguaje de programación usado para contrato inteligente.
* [Rust Toolchain](https://docs.near.org/docs/develop/contracts/rust/intro#installing-the-rust-toolchain)
* [NEAR CLI](https://docs.near.org/docs/tools/near-cli) - Herramienta de interfaz de línea de comandos para interactuar con cuentas y contratos inteligentes en NEAR.
* [yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable)