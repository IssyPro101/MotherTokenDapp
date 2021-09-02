import React, { Component} from 'react'
import mothertoken from '../mothertokenlogo.png'

class Main extends Component {

  async componentWillMount() {

  }

  constructor(props) {
    super(props)
    this.state = {
      rewardpool: 0,
      liquiditypool: 0,
      loading: false
    }
  }

  rewardpool = () => {
    window.web3.eth.getBalance('0x37DE55F82FC374c0afCdEFEE994FaffF0AD9Cc24').then((poolBalance) => {
      this.setState({rewardpool: poolBalance / 10 ** 18});
    })
    
  }

  bnbliquiditypool = async () => {
    let tokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
    let walletAddress = "0x51E0524191718ACb0175913fb4E1C15e89a091ae";

    // The minimum ABI to get ERC20 Token balance
    let minABI = [
      // balanceOf
      {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
      },
      // decimals
      {
    "constant":true,
    "inputs":[],
    "name":"decimals",
    "outputs":[{"name":"","type":"uint8"}],
    "type":"function"
      }
    ];

    // Get ERC20 Token contract instance
    let contract = new window.web3.eth.Contract(minABI, tokenAddress);
    let balance = await contract.methods.balanceOf(walletAddress).call()
    this.setState({bnbliquiditypool: Number(balance) / 1000000000000000000})
    
  }


  // Claim BNB function
  claimBNB = async () => { 
    var d = new Date()
    var now = new Date(d.getTime()) 
    var next = new Date(d.getTime() + 86400000)
    this.setState({lastClaim: this.props.bnbReward})
    this.setState({claimDateAfterTx: next.toString()})
    if (this.props.motherHeld !== '0' && now > this.props.nextAvailableClaimDate) {
      this.setState({loading: true})
      const currentComponent = this
      await this.props.token.methods.claimBNBReward().send({from: this.props.account})
      .once('transactionHash', async function(hash){
        currentComponent.setState({lastClaimTx: hash})
        currentComponent.setState({loading: false})
        var modal = document.getElementById("myModalBNB")
        modal.style.display = "block";
      })
      .once('error', function(error) {
        alert('There was an error during the transaction.')
        currentComponent.setState({loading: false})
      })
    } else if (now < this.props.nextAvailableClaimDate) {
      alert('Your reward cycle is not completed yet.')
    } else {
      alert('You need to own and hold $MTHR to collect bnb rewards.')
    }
   
  }

  mthrliquiditypool = async () => {
    let motherHeldinLP = await this.props.token.methods.balanceOf('0xD0c732866fC6D379b7E93E49d773cE62b7Dd23Aa').call()
    this.setState({mthrliquiditypool: Number(motherHeldinLP) / 10 * 9})
  }

  buttonOnClick = (event) => {
    event.preventDefault();
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
  }

  spanOnClick = () => {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  }

  spanOnClickBNB = () => {
    var modal = document.getElementById("myModalBNB");
    modal.style.display = "none";
  }

  changeBNB = (bnb) => {
    this.bnb = bnb
  }
  
  bnb = 0;

  render() {

    window.onclick = (event) => {
      var modal = document.getElementById("myModal");
      if (event.target === modal) {
        modal.style.display = "none";
      }
    }

    setInterval(this.rewardpool, 1000)
    setInterval(this.bnbliquiditypool, 1000)
    setInterval(this.mthrliquiditypool, 1000)
    
    let content;
    if (this.state.loading) {
      content = <div className="loader"></div>
    } else {
      content = <div id='content' className='mt-3'>
      <div className="d-flex justify-content-between mb-3">
      </div>
      <div className="card mb-4">
        <div id='reward_stats_wrap'>
          <div id='reward-share' className="card-body">
           <img id='reward-logo' src={mothertoken} alt='mother token logo'></img>
            <p id='reward-text1'>
                MTHR<br></br>
                Your Reward Share<br></br>
                {this.props.percentagePool}%<br></br>
            </p>
            <p id='reward-text2'>
            Buy more to increase your BNB Reward Share.<br></br>
            Simple Right!<br></br>
            </p>
            <a href="https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x37DE55F82FC374c0afCdEFEE994FaffF0AD9Cc24" rel="noopener noreferrer" className="button6" target="_blank">Buy $Mother</a>
          </div>
          <div id='mother-balance' className="card-body">
           <img id='reward-logo' src={mothertoken} alt='mother token logo'></img>
            <p id='reward-text1'>
                MTHR<br></br>
                Mother Balance:<br></br>
                {this.props.motherHeld} MTHR<br></br>

            </p>
            <p id='reward-text2'>
            Keep buying to get more rewards!<br></br>
            </p>
          </div>
        </div>
      </div>
      <div className="card">
          <div id='collectable-bnb' className="card-body">
            <p id='bnb-reward'>
                My Collectable BNB Reward: {this.props.bnbReward} BNB<br></br>
                <small id='estimate'><strong>Estimated Annual BNB Rewards ≈ {this.props.bnbReward * 365} BNB</strong></small><br></br>
                Next Collect Date: <p id='next-collect-text'>{this.props.nextAvailableClaimDate.toString()}</p><br></br>
            </p>
            <button className="button6" onClick={this.claimBNB}>COLLECT MY BNB</button>
            <button id="openRC" className="button6" onClick={this.buttonOnClick}>REWARD CALCULATOR</button>
          </div>
      </div>  
      <div id='stats'>
        <div className="container">
          <div className="row">
            <div className="col">
            <img className='logo-col' src={mothertoken} alt='mother token logo'></img>
              <p>Max Transaction Amount</p>
              <p>10,000,000,000 $MTHR</p>
            </div>
            <div className="col">
            <img className='logo-col' src={mothertoken} alt='mother token logo'></img>
              <p>Total Liquidity Pool</p>
              <p>{(this.state.bnbliquiditypool * this.props.bnbPrice + this.state.mthrliquiditypool * this.props.motherPrice).toString()}</p>
            </div>
            <div className="col">
            <img className='logo-col' src={mothertoken} alt='mother token logo'></img>
              <p>1 million $MTHR Price</p>
              <p>{this.props.motherPrice.toString()}</p>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col">
            <img className='logo-col' src={mothertoken} alt='mother token logo'></img>
             <p>Total BNB in liquidity pool</p>
             <p>{this.state.bnbliquiditypool}</p>
            </div>
            <div className="col">
            <img className='logo-col' src={mothertoken} alt='mother token logo'></img>
              <p>Total BNB in reward pool</p>
              <p>{this.state.rewardpool}</p>
            </div>
          </div>
        </div>
      </div>
      <div id="myModal" className="modal">
        <div id='reward-calculator-modal'className="modal-content">
          <span className="close" onClick={this.spanOnClick}>&times;</span>
          <div id='input-invest'>
            <p id='amount-invest'>Enter BNB Amount to Invest:</p>
            <input id='bnb' onChange={event => this.changeBNB(event.target.value)}></input>
          </div>
          <table id='reward-calculator'>
            <thead>
              <tr>
                <th></th>
                <th>Existing</th>
                <th>New</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>$MTHR BALANCE</td>
                <td>{this.props.motherHeld}</td>
                <td>{this.bnb / this.props.motherPriceBNB}</td>
                <td>{this.props.motherHeld + this.bnb / this.props.motherPriceBNB}</td>
              </tr>
              <tr>
                <td>Reward Share %</td>
                <td>{this.props.percentagePool}%</td>
                <td>{(this.bnb / this.props.motherPriceBNB) / 1000000000000000 * 100}%</td>
                <td>{this.props.percentagePool + ((this.bnb / this.props.motherPriceBNB) / 1000000000000000 * 100)}%</td>
              </tr>
              <tr>
                <td>Daily Rewards in BNB*</td>
                <td>{this.state.rewardpool * this.props.percentagePool}</td>
                <td>{this.state.rewardpool * this.bnb / this.props.motherPriceBNB / 1000000000000000}</td>
                <td>{(this.state.rewardpool * this.props.percentagePool) + (this.state.rewardpool * this.bnb / this.props.motherPriceBNB / 1000000000000000)}</td>
              </tr>
              <tr>
                <td>Yearly Reward in BNB*</td>
                <td>{this.state.rewardpool * this.props.percentagePool * 365}</td>
                <td>{this.state.rewardpool * this.bnb / this.props.motherPriceBNB / 1000000000000000 * 365}</td>
                <td>{(this.state.rewardpool * this.props.percentagePool * 365) + (this.state.rewardpool * this.bnb / this.props.motherPriceBNB / 1000000000000000 * 365)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div id="myModalBNB" className="modal">
        <div id='successful-claim' className="modal-content">
          <span className="close" onClick={this.spanOnClickBNB}>&times;</span>
          <h1 align='center'>Exciting!</h1>
          <p align='center'><strong>You have succesfully claimed: {this.state.lastClaim} BNB</strong></p>
          <p align='center'>Your next collect date is: {this.state.claimDateAfterTx}</p>
          <a href={'https://bscscan.com/tx/'+this.state.lastClaimTx} target='_blank' rel="noopener noreferrer"><p align='center'>View on BscScan</p></a>
        </div>
      </div>
    </div>
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

export default Main;
