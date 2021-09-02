import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import App from './App'
import mothertoken from '../mothertokenlogo.png'
import mothertokenbanner from '../mothertokenbanner.png'

class Land extends Component {

  async componentWillMount() {
    let connected = await sessionStorage.getItem('walletAddress')
    if (window.ethereum) {
        const account = await window.ethereum.request({ method: 'eth_accounts' })
        console.log(account[0])
        if (connected === account[0]) {
            await this.loadWeb3()
            await this.setState({content: this.state.app})
        }
    }

  }

  async loadWeb3() {
    if (window.ethereum) {
      await window.ethereum.send('eth_requestAccounts');
      window.web3 = new Web3(window.ethereum);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
    
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

  constructor(props) {
    super(props)
    this.state = {
        chainID: 0,
        app: <App/>,
        content: 
            <div>
            <nav className="navbar navbar-dark fixed-top bg-light flex-md-nowrap p-0 shadow">
          <div>
            <img id='logo' src={mothertokenbanner} alt='dd'></img>
          </div>
          <button id='connect' className="button6" onClick={this.buttonOnClick}>Connect</button>
        </nav>
            <div id='buy-no-connect' className="card-body">
                <img id='reward-logo' src={mothertoken} alt='mother token logo'></img>
                <p id='reward-text2'>
                Buy more to increase your BNB Reward Share.<br></br>
                Simple Right!<br></br>
                </p>
                <a href="https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x37DE55F82FC374c0afCdEFEE994FaffF0AD9Cc24" rel="noopener noreferrer" className="button6" target="_blank">Buy $Mother</a>
            </div>
                <div id='reward_stats_wrap'>
                    <div id='connect-whole'>
                        <div className="card">
                            <div id='connect-content' className="card-body">
                                <p id='reward-text1'>
                                You are not connected or not using Binance Smart Chain network<br></br>
                                To use the app, make sure ou are using the Binance Smart Chain network <br></br>
                                You need to connect your wallet to continue (will automatically connect to your ethereum browser)
                                </p>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>

    }

  }
  changeContent = async () => {
    if (document.getElementById('confirm-check').checked === false) {
      alert('Make sure to agree to the terms and conditions')
    } else {
      await this.loadWeb3()
      if (window.web3) {   
        await window.web3.eth.getChainId((err, chainId) => {
          this.setState({chainID: chainId})
        })
        if (this.state.chainID !== 56) {
          alert('You are not connected to Binance Smart Chain')
        } else {
          var modal = document.getElementById("myModal");
          modal.style.display = "none";
          this.setState({content: this.state.app})
        }
      }
    }
 
  }
  render() {
    window.onclick = (event) => {
        var modal = document.getElementById("myModal");
        if (event.target === modal) {
          modal.style.display = "none";
        }
    }
    return (
        <div>
            {this.state.content}
            <div id="myModal" className="modal">
                <div className="modal-content">
                    <span className="close" onClick={this.spanOnClick}>&times;</span>
                    <h1 align='center'>Disclaimer</h1>
                    <p align='center'>Trading cryptocurrencies carries a high level of risk, and may not be suitable for all investors. Before deciding to trade cryptocurrency you should carefully consider your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose. ICO's, IEO's, STO's and any other form of offering will not guarantee a return on your investment.
                    <br></br>
                    <br></br>
                        Do conduct your own due diligence and consult your financial advisor before making any investment decisions.
                    <br></br>
                    <br></br>
                        Any opinions, news, research, analyses, prices, or other information contained on this website is provided as general market commentary, and does not constitute investment advice. The mothertoken.org and its affiliates will not accept liability for any loss or damage, including without limitation to, any loss of profit, which may arise directly or indirectly from use of or reliance on such information. All opinions expressed on this site are owned by the respective writer and should never be considered as advice in any form.
                    <br></br>
                    <br></br>
                        The mothertoken.org and its affiliates makes no representation or warranties as to the accuracy and or timelines of the information contained herein. A qualified professional should be consulted before making any financial decisions.</p>
                    <div id='confirm'>
                        <input type="checkbox" id="confirm-check"></input>
                        <label>I understand and accept that I will trade/invest MTHR at my own risks</label>
                    </div>
                    <button id='confirm-button' className="button6" onClick={this.changeContent}>Confirm</button>
                    
                </div>
            </div>
        </div>
    );
  }
}

export default Land;
