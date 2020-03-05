# DSR bot 
* When an exchange is using the Dai Savings Rate there are certain edge cases where funds will end up in the contract but not get moved to the DSR
* These edgecases were rare enough that we created a function that will check to see if there is a balance that needs to go into the DSR and if it does it will move the funds and reward the caller proportionally to the size of the amount moved up to a maximum of 10 DAI
* This bot monitors and exchange and sends that transaction

## requirements 
* NPM version 10 or greater

## .env file 
* a .env file is needed with your private key 
* recommended to remove after the bot spins up
```
PRIVATE_KEY=<your private key>

```
## configurations
* configurations are stored in the configuration.js file 
```
const FUTURESWAP_ADDRESS = "0xe0e4d3c894c31EBC0325ab2b59667286cE40582D"
const NETWORK = "kovan"
const GAS_PRICE = 2000000000
const RERUNTIME = 180000
```
* FUTURESWAP_ADDRESS 
    * Exchnage address
* NETWORK
    * target network (homestead for mainnet)
* GAS_PRICE
    * gas price in wei (default 2 gwei)
* RERUNTIME
    * Time between checks of exchange in ms default 3 min
## Running
* put in desired configurations 
* put in .env file
```
$ npm install 
$ npm run start
```
* logs get written to log.txt and errors to errors.txt 
* to have a continuous view run 
```
$ tail -f log.txt
``` 