const WifeToken = artifacts.require('WifeToken.sol')

contract('WifeToken', async (accounts) => {

    describe('WifeToken deployment', async () => {
        it('sets the total supply upon deployment', async () => {
            token = await WifeToken.deployed()
            totalSupply = await token.totalSupply()
            assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000')
        })
        it('allocates the initial supply to the admin', async () => {
            adminBalance = await token.balanceOf(accounts[0])
            assert.equal(adminBalance.toNumber(), 1000000, 'it allocated the initial supply to the admin')      
        })
    })
})