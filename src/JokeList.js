import React, { Component } from 'react';
import axios from 'axios';
import './JokeList.css';
import Joke from './Joke';
import { v4 as uuidv4 } from 'uuid';

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
      // we gonna make each joke an OBJECT (not string) - that we can add things in like VOTES & DEVOTES
      randJokes.push({ text: response.data.joke, votes: 0, id: uuidv4() });
      console.log('randJokes: ', randJokes);
    }
    
    this.setState({ jokes: randJokes });
  }

  handleVote(id, delta) {
    this.setState(st => ({
      jokes: st.jokes.map(joke =>
        joke.id === id ? {...joke, votes: joke.votes + delta } : joke
      )
    }))
  }

  render() {
    return (
      <div className='JokeList'>
        <div className='JokeList-sidebar'>
          <h1 className='JokeList-title'><span>Dad</span> Jokes</h1>
          <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
          <button className='JokeList-getmore'>New Jokes</button>        
        </div>
        
        <div className='JokeList-jokes'>
          {this.state.jokes.map((joke) => (
            <Joke 
              text={joke.text} 
              votes={joke.votes} 
              key={joke.id} 
              upVote={() => this.handleVote(joke.id, 1)}
              downVote={() => this.handleVote(joke.id, -1)}
            />
          ))}
        </div>
      </div>
    );   
  }

}

export default JokeList;
