require('dotenv').config()
const { ethers } = require("ethers");
const {
  FUTURESWAP_ADDRESS,
  NETWORK,
  GAS_PRICE,
  RERUNTIME
} = require("./configurations");
const { DAI_ADDRESS, CHAINLINK_ADDRESS} = require("./constants")
const { FUTURESWAP_ABI, DAT_ABI, CHAINLINK_ABI } = require("./ABI")
const {logger} = require('./logging')

logger.log('info', "DSR BOT ALIVE")
const provider = new ethers.getDefaultProvider(NETWORK);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const futreSwap = new ethers.Contract(FUTURESWAP_ADDRESS, FUTURESWAP_ABI, provider)
const dai = new ethers.Contract(DAI_ADDRESS, DAT_ABI, provider)
const futreSwapInstance = futreSwap.connect(wallet)


const main = async () => {
    const daiBalance = await dai.balanceOf(FUTURESWAP_ADDRESS)
    const tokenPools = await futreSwapInstance.tokenPools()
    // const constants = await futreSwapInstance.constants() //TODO get DSR rewards from contract
    const stableTokenCollateralPoool = tokenPools.stableTokenCollateralPool
    const amountToAdd = daiBalance.sub(stableTokenCollateralPoool);
    const DSRadditionReward = 20000000000000000 //constants.DSRadditionReward
    const reward = (amountToAdd * DSRadditionReward) / 1e18;

    const gasCost = 180000 * GAS_PRICE 
    const valueOfEth = await getValueofETH()
    const costOfTx = valueOfEth * gasCost

    if (reward > costOfTx) {
        const tx = await futreSwapInstance.addFundsToDSR({
            gasPrice: GAS_PRICE
        })
        logger.log('info', {time: Date.now(), action: "check run:", tx})
    } else {
        logger.log('info', {time: Date.now(), action: "Check Run: no profit"})
    }
};

const getValueofETH = async () => {
    const provider2 = new ethers.getDefaultProvider("rinkeby"); //TODO move to mainnet after chainlink update, change CHAINLINK_ADDRESS
    const chainlink = new ethers.Contract(CHAINLINK_ADDRESS, CHAINLINK_ABI, provider2)
    const priceOfEther = await chainlink.latestAnswer()
    const valueOfEth = priceOfEther / 1e8
    return valueOfEth


} 
main()
setInterval(main, RERUNTIME)
