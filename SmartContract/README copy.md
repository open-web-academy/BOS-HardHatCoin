## Descripción 📄

Contrato de subastas para el token HAT.

## Métodos de los contratos 🚀

Asignamos el identificador de nuestro contrato desplegado a una constante (Sustituir el ID por el del contrato desplegado):

    Auctions
    ID=auctions1.testnet
    echo $ID

Inicialización del contrato:

    Auctions
    near call $ID init_contract '{"owner_id":"auctions1.testnet","ft_address":"lion.tokens.testnet",
    "total_supply":1000, "auction_duration":86400000000000}' --accountId $ID

### Auctions



    near view $ID get_current_supply

    near view $ID get_last_auction_info

    near call $ID change_ft_address '{"ft_address":"lion.tokens.testnet"}' --accountId $ID --gas 300000000000000

    near call $ID transfer_near '{"bidder":"yairnava.testnet", "amount":1}' --accountId $ID --gas 300000000000000

    near call $ID transfer_ft '{"bidder":"yairnava.testnet", "amount":1}' --accountId $ID --gas 300000000000000 --depositYocto 1



## Construido con 🛠️
* [RUST](https://www.rust-lang.org/) - Lenguaje de programación usado para contrato inteligente.
* [Rust Toolchain](https://docs.near.org/docs/develop/contracts/rust/intro#installing-the-rust-toolchain)
* [NEAR CLI](https://docs.near.org/docs/tools/near-cli) - Herramienta de interfaz de línea de comandos para interactuar con cuentas y contratos inteligentes en NEAR.
* [yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable)