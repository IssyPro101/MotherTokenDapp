import React, { Component } from 'react'
import mothertokenbanner from '../mothertokenbanner.png'

class Navbar extends Component {

  logout = () => {
    sessionStorage.clear()
    window.location.reload(false)
  }
  render() {
    return (
        <nav id='navigation' className="navbar navbar-dark fixed-top bg-light flex-md-nowrap p-0 shadow">
          <div>
            <img id='logo' src={mothertokenbanner} alt='dd'></img>
          </div>

          <div id='user-info'>
            <small className='text-secondary'>
                <small id='account'>{this.props.account}</small>
            </small>
            <small className='text-secondary'>
                <small id='account-short'>{this.props.account.substring(0, 7)}...</small>
            </small>  
            <button id='logout' onClick={this.logout}>Logout</button>
          </div>

        </nav>
    );
  }
}

export default Navbar;
