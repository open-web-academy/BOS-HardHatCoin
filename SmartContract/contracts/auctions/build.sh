#!/bin/bash
set -e
cd "`dirname $0`"
source flags.sh
cargo build --all --target wasm32-unknown-unknown --release

if [ ! -d res/ ];
then
mkdir res
fi

cp target/wasm32-unknown-unknown/release/auctions.wasm ./res/

echo "¿Quieres desplegar el contrato de auctions?"
select yn in "Si" "No"; 
do
    case $yn in
        Si ) 
                echo Ingrese la cuenta:
                read account
                near deploy $account res/auctions.wasm; break;;
        No ) exit;;
    esac
done