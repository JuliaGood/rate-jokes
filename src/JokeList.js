import React, { Component } from 'react';
import axios from 'axios';
import './JokeList.css';
import JokeItem from './JokeItem';
import { v4 as uuidv4 } from 'uuid';

class JokeList extends Component {
  static defaultProps = {
    numJokes: 5
  };

  constructor(props) {
    super(props);
    this.state = {
      jokes: JSON.parse(window.localStorage.getItem('jokes') || "[]"),
      loading: false
    };
    this.seenJokes = new Set(this.state.jokes.map((joke) => {
      return joke.text;
    }));
    console.log('this.seenJokes: ', this.seenJokes);
  };

  componentDidMount() {
    if (this.state.jokes.length === 0) {
      this.getJokes();
    }
  }

  async getJokes() {
    try {
      const randJokes = [];
      while (randJokes.length < this.props.numJokes) {
        const response = await axios.get('https://icanhazdadjoke.com/', {
          headers: { Accept: 'application/json' } //'couse default response format is HTML
        });
        console.log('response: ', response);
        const newJoke = response.data.joke;
        if (!this.seenJokes.has(newJoke)) {
          randJokes.push({ text: newJoke, votes: 0, id: uuidv4() });
        } else {
          console.log('found a duplicate');
        }
      }

      this.setState((currState) => ({
        loading: false,
        jokes: [...currState.jokes, ...randJokes]
      }),
        () => window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
      );
    } catch (error) {
      alert(error);
      this.setState({ loading: false });
    }

  }

  handleVote(id, delta) {
    this.setState((currState) => ({
      jokes: currState.jokes.map((joke) =>
        joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
      )
    }),
      () => window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
    );
  }

  handleClick = () => {
    this.setState({ loading: true }, this.getJokes);
  }

  render() {
    if (this.state.loading) {
      return (
        <div className='joke-list-spinner'>
          <i className='far fa-8x fa-laugh fa-spin' />
          <h1 className='joke-list-title'>Loading...</h1>
        </div>
      )
    }

    const sortedJokes = this.state.jokes.sort((a, b) => b.votes - a.votes);

    return (
      <div className='joke-list'>
        <div className='joke-list-sidebar'>
          <h1 className='joke-list-title'><span>Rate</span> Jokes</h1>
          <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
          <button
            className='joke-list-getmore'
            onClick={this.handleClick}
          >New Jokes</button>
        </div>

        <div className='joke-list-jokes'>
          {sortedJokes.map((joke) => (
            <JokeItem
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
