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
    this.state={ 
      jokes: JSON.parse(window.localStorage.getItem('jokes') || "[]" ),
      loading: false
    };
  };

  // where's the best place to make a request? - in the componentDidMount()
  componentDidMount() {
    if(this.state.jokes.length === 0) {
      this.getJokes();
    }
  }

  async getJokes() {
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
    
    this.setState(st => ({
      loading: false,
      jokes: [...st.jokes, ...randJokes]
    }),
      () => window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
    );
  }

  handleVote(id, delta) {
    this.setState(st => ({
      jokes: st.jokes.map(joke =>
        joke.id === id ? {...joke, votes: joke.votes + delta } : joke
      )
    }),
      () => window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
    );
  }

  handleClick = () => {
    this.setState({ loading: true }, this.getJokes);
  }

  render() {
    if(this.state.loading) {
      return (
        <div className='JokeList-spinner'>
          <i className='far fa-8x fa-laugh fa-spin' />
          <h1 className='JokeList-title'>Loading...</h1>
        </div>
      )
    }
    return (
      <div className='JokeList'>
        <div className='JokeList-sidebar'>
          <h1 className='JokeList-title'><span>Dad</span> Jokes</h1>
          <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
          <button 
            className='JokeList-getmore'
            onClick={this.handleClick}
          >New Jokes</button>        
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
