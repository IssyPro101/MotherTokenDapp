import React, { Component } from 'react'
import './App.css'
import Navbar from './Navbar'
import MotherToken from '../abis/MotherToken.json'
import Main from './Main'

class App extends Component {


  async componentWillMount() {
    let account = await window.ethereum.request({ method: 'eth_accounts' })
    account = account[0]
    await sessionStorage.setItem('walletAddress', account);
    await this.loadBlockchainData()
    await this.loadWebSocket()
    
  }

  async loadWebSocket() {

    var socket = new WebSocket('wss://stream.binance.com:9443/ws/bnbusdt@kline_1m');
    console.log(socket)

    socket.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected')
    }

    socket.onmessage = ({data}) => {
      // listen to data sent from the websocket server
      this.setState({bnbPrice: JSON.parse(data).k.c})
    }

    socket.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss

    }

  }
  async loadBlockchainData() {
    const web3 = window.web3

    const account = await window.ethereum.request({ method: 'eth_accounts' })
    this.setState({account: account[0]})

    // Load Token
    const networkId = await web3.eth.net.getId()
    const tokenData = MotherToken.networks[networkId]

    if (tokenData) {
      const token = new web3.eth.Contract(MotherToken.abi, tokenData.address)
      this.setState({token})
      this.setState({connected: true})

      // Get Total Supply
      let totalSupply = await this.state.token.methods.totalSupply().call()
      totalSupply = totalSupply / 1000000000

      // Calculate user BNB Reward
      let bnbReward = await this.state.token.methods.calculateBNBReward(this.state.account).call()
      bnbReward = web3.utils.fromWei(bnbReward.toString())

      // Get Mother held by user
      let motherHeld = await this.state.token.methods.balanceOf(this.state.account).call()
      motherHeld = motherHeld.toString() / 1000000000

      // Get next available claim date
      let nextAvailableClaimDate = await this.state.token.methods.nextAvailableClaimDate(this.state.account).call()
      nextAvailableClaimDate = new Date(nextAvailableClaimDate*1000)
      console.log(nextAvailableClaimDate)
      if (motherHeld === '0') {
        nextAvailableClaimDate = 'You need to own and hold Mother Token to earn rewards'
      }


      // Get Mother price
      let currentComponent = this
      fetch('https://api.pancakeswap.info/api/v2/tokens/0x0E3EAF83Ea93Abe756690C62c72284943b96a6Bc').then((response) => {
        return response.json();
      }).then(function(data) {
        currentComponent.setState({motherPrice: data['data'].price * 1000000})
        currentComponent.setState({motherPriceBNB: data['data'].price_BNB})
      }).catch(function(error) {
        console.log(error)
        currentComponent.setState({motherPrice: 'Not Available'})
      }); 

      // Calculate percentage of bnb reward pool
      const percentagePool = motherHeld / totalSupply * 100

      this.setState({percentagePool: percentagePool.toFixed(3).toString()})
      this.setState({bnbReward})
      this.setState({motherHeld})
      this.setState({nextAvailableClaimDate})
    }
    this.setState({loading: false})

  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      token: {},
      loading: true
    }

  }

  render() { 
    let content
    if (this.state.loading) {
      content = <div className="loader"></div>
    } else {
      content = <Main 
                      percentagePool={parseFloat(this.state.percentagePool)} 
                      bnbReward={parseFloat(this.state.bnbReward)}
                      nextAvailableClaimDate={this.state.nextAvailableClaimDate}
                      motherHeld={parseFloat(this.state.motherHeld.toFixed(3))}
                      motherPrice={parseFloat(this.state.motherPrice)}
                      bnbPrice={parseFloat(this.state.bnbPrice)}
                      account={this.state.account}
                      token={this.state.token}
                      motherPriceBNB={parseFloat(this.state.motherPriceBNB)}
                />   
    }
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5"> 
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth: '1000px'}}>
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
