require('dotenv').config()
const { ethers } = require("ethers");
const {
  FUTURESWAP_ADDRESS,
  NETWORK,
  GAS_PRICE,
  RERUNTIME
} = require("./configurations");
const { DAI_ADDRESS } = require("./constants")
const { FUTURESWAP_ABI, DAI_ABI } = require("./ABI")
const {logger} = require('./logging')

logger.log('info', "DSR BOT ALIVE")
const provider = new ethers.getDefaultProvider(NETWORK);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const futreSwap = new ethers.Contract(FUTURESWAP_ADDRESS, FUTURESWAP_ABI, provider)
const dai = new ethers.Contract(DAI_ADDRESS, DAI_ABI, provider)
const futreSwapInstance = futreSwap.connect(wallet)


const main = async () => {
    const daiBalance = await dai.balanceOf(FUTURESWAP_ADDRESS)
    const tokenPools = await futreSwapInstance.tokenPools()
    const constants = await futreSwapInstance.constants()
    const stableTokenCollateralPool = tokenPools.stableTokenCollateralPool
    const amountToAdd = daiBalance.sub(stableTokenCollateralPool);
    const isDSR = constants.isDSR
    const dsrAdditionalRewards = constants.dsrAdditionalRewards
    const reward = (amountToAdd * dsrAdditionalRewards) / 1e18;
    const gasCost = 180000 * GAS_PRICE 
    const priceOfEther = await getValueofETH(futreSwapInstance)
    const costOfTx = priceOfEther * gasCost / 1e18
    if (reward > costOfTx && isDSR) {
        const tx = await futreSwapInstance.addFundsToDsr({
            gasPrice: GAS_PRICE
        })
        logger.log('info', {time: Date.now(), action: "check run:", tx})
    } else {
        logger.log('info', {time: Date.now(), action: "Check Run: no profit"})
    }
};

const getValueofETH = async (futreSwapInstance) => {
    const priceOfEther = await futreSwapInstance.getAssetTokenPrice()
    return priceOfEther
} 
main()
setInterval(main, RERUNTIME)
