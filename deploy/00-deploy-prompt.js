const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

const FUND_AMOUNT = ethers.utils.parseUnits("10.0", "ether") /*"10.000 000 000 000 000 000"  18 decimal places */

module.exports = async function ({ getNamedAccounts, deployments }) {
  console.log("deploying Prompt contract")

  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  // get IPFS hashes of images

  let vrfCoordinatorV2Address, subscriptionId
  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2MockContract = await deployments.get("VRFCoordinatorV2Mock")
    const vrfCoordinatorV2Mock = await ethers.getContractAt(
      vrfCoordinatorV2MockContract.abi,
      vrfCoordinatorV2MockContract.address
    )
    vrfCoordinatorV2Address = vrfCoordinatorV2MockContract.address
    const tx = await vrfCoordinatorV2Mock.createSubscription()
    const txReceipt = await tx.wait(1)
    subscriptionId = txReceipt.events[0].args.subId
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    console.log("Retrieved Mocks for Random NFT")
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
    subscriptionId = networkConfig[chainId].subscriptionId
  }

  console.log("------------------------------")
  console.log("getting args")
  const args = [
    vrfCoordinatorV2Address,
    networkConfig[chainId]["gasLane"] /* same as networkConfig[chainId].gasLane */ /* also keyhash*/,
    subscriptionId,
    networkConfig[chainId].callbackGasLimit,
  ]

  console.log(`vrfCoordinatorV2Address: ${vrfCoordinatorV2Address}`)
  console.log(`networkConfig[chainId]["gasLane"]: ${networkConfig[chainId]["gasLane"]}`)
  console.log(`subscriptionId: ${subscriptionId}`)
  console.log(`networkConfig[chainId].callbackGasLimit: ${networkConfig[chainId].callbackGasLimit}`)

  console.log("retrieved args")
  console.log("Deploying Prompt contract")

  const promptContract = await deploy("Prompt", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  console.log("------------------------------")

  // verify
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifing...")
    await verify(promptContract.address, args)
  }
  console.log("------------------------------")

  console.log("Completed promptContract script")
}

module.exports.tags = ["all", "prompt", "main", "00"]
