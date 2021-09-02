const MotherToken = artifacts.require("MotherToken.sol");
const Utils = artifacts.require('Utils.sol');

// Puts it on the blockchain
module.exports = async function(deployer, network, accounts) {
  const [admin, _] = accounts;

  if (network === 'bscTestnet' || network === 'development') {
    // Deploy Token

    await deployer.deploy(Utils)

    await deployer.link(Utils, MotherToken)
    
    await deployer.deploy(MotherToken)

    const motherToken = await MotherToken.deployed()
    
    motherToken.activateContract()

    motherToken.transfer('0xAA3913590512874D1EA660e2f4c71cab2D8Cc321', '10000000000000000')
    
  } else if (network === 'bsc') {

    // Deploy Token

    await deployer.deploy(Utils)

    await deployer.link(Utils, MotherToken)
    
    await deployer.deploy(MotherToken)

    const motherToken = await MotherToken.deployed()
    
    motherToken.activateContract()
    
  }

}