import React, { Component } from 'react';
import axios from 'axios';
import './JokeList.css';

class JokeList extends Component {
  static defaultProps = {
    numJokes: 5
  };

  constructor(props) {
    super(props);
    this.state={ jokes: [] };
  };

  // where's the best place to make a request? - in the componentDidMount()
  async componentDidMount() {
    let randJokes = [];

    while(randJokes.length < this.props.numJokes) {
      let response = await axios.get('https://icanhazdadjoke.com/', {
        headers: { Accept: 'application/json' } //'couse default response format is HTML
      });
      console.log('response: ', response);
      randJokes.push(response.data.joke);
      console.log('randJokes: ', randJokes);
    }
    

    this.setState({ jokes: randJokes });
  }

  render() {
    return (
      <div className='JokeList'>
        <h1>Dad Jokes</h1>
        <div className='JokeList-jokes'>
          {this.state.jokes.map((joke) => (
            <div>{joke}</div>
          ))}
        </div>
      </div>
    );   
  }

}

export default JokeList;
