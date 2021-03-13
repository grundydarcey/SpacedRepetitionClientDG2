import React, { Component } from 'react';
import './LearningRoute.css';
import LearnContext from '../../contexts/LearnContext';
import LanguageApiService from '../../services/language-api-service';
import Results from '../../components/Results/results';

class LearningRoute extends Component {
  static contextType = LearnContext;

  state = {
    guess: '',
  };

  componentDidMount() {
    LanguageApiService.getHead()
      .then((data) => {
        if (!data) {
          console.error(data);
          throw new Error('Next word not found');
        }
        this.context.setNextWord(data.nextWord);
        this.context.setTotalScore(data.totalScore);
        this.context.setWordCorrectCount(data.wordCorrectCount);
        this.context.setWordIncorrectCount(data.wordIncorrectCount);
      })
      .catch(this.context.setError);
  }

  handleOnChange = (e) => {
    const guess = e.target.value;
    this.setState({ guess: guess });
  };

  handleSubmit(e) {
    e.preventDefault();
    const guess = this.state.guess;
    LanguageApiService.submitGuess(guess).then((res) => {
      this.context.setPrevWord(this.context.nextWord);
      this.context.clearError();
      this.context.setTotalScore(res.totalScore);
      this.context.setWordCorrectCount(res.wordCorrectCount);
      this.context.setWordIncorrectCount(res.wordIncorrectCount);
      this.context.setNextWord(res.nextWord);
      this.context.setAnswer(res.answer);
      this.context.setGuess(guess);
      this.context.setIsCorrect(res.isCorrect);
      this.context.setIsResultDisplayed(true);
    })
  }

  render() {
    return (
      <section className='mainpage'>
        <section className='learn'>
          {!this.context.isResultDisplayed ? (
            <section className='translateForm'>
              <section className='translateTitle'>
                <h2>Translate the word:</h2>
                <span className='word'>{this.context.nextWord}</span>
              </section>
              <form className='translateForm' onSubmit={(e) => this.handleSubmit(e)}><br /><br />
                <label htmlFor='learn-guess-input' className='translatelabel'>
                What's the translation for this word?
                </label><br /><br />
                <input type='text' name='learn-guess-input' id='learn-guess-input' className='input' onChange={this.handleOnChange} required></input>
                <button type='submit' className='guessbutton'>
                  Submit your answer
                </button>
              </form>
            </section>
        
          ) : (
            <Results />
          )}
          <section className='score'>
            <section className='displayScore'>
              <p>Your total score is: {this.context.totalScore}</p>
            </section>
            <p>You have answered this word correctly{' '}
              {this.context.wordCorrectCount} times.
            </p>
            <p>You have answered this word incorrectly{' '}
              {this.context.wordIncorrectCount} times.
            </p>
          </section>  
        </section>
      </section>     
    )
  }
}

export default LearningRoute;