import React, { Component } from 'react';
import { CardList } from './components/card-list/card-list.component';
import { SearchBox } from './components/search-box/search-box.component';
import './App.css';



class App extends Component {
  constructor() {
    super();
    this.state = {
      players: [],
      img:[],
      searchField: ''
    };
  }



  componentDidMount() {
    fetch('http://localhost:3000/players')
      .then(response => response.json())
      .then(users =>{       
      this.setState(this.state.players=users)      
      });      
  }
  

  onSearchChange = event => {
    this.setState({ searchField: event.target.value });
  };


  render() {
    const { players, searchField } = this.state;
    const filteredPlayers = players.filter(players =>
      players.name.toLowerCase().includes(searchField.toLowerCase())
    );

    return (
      <div className='App'>
        <h1>MANCHESTER CITY</h1>
        <center><img class='logo' src="https://web-assets.mancity.com/dist/images/logos/crest.svg"></img></center>
        <SearchBox onSearchChange={this.onSearchChange}></SearchBox>
        <CardList players={filteredPlayers} />
      </div>
    );
  }
}



export default App;
