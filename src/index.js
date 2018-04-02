import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: {
        currentStep: 0,
        squares: [Array(9).fill(null)],
      },
      player: 'X',
    }
  }

  squares() {
    return this.state.history.squares[this.state.history.currentStep]
  }

  handleClick(i) {
    if (this.squares()[i] || calculateWinner(this.squares()))
      return;
    const players         = { X: 'O', O: 'X' };
    const nextPlayer      = players[this.state.player];
    const newSquareStates = this.squares().slice();
    newSquareStates[i]    = this.state.player;
    this.setState({history: {
        currentStep: this.state.history.currentStep + 1,
        squares: [...this.state.history.squares, newSquareStates],
      }
    });
    this.setState({player: nextPlayer});
  }

  jumpTo(step) {
    const newHistory = this.state.history.squares.slice(0, step + 1);
    this.setState({ history: {
        squares: newHistory,
        currentStep: step
      }
    })
  }

  render() {
    let status = "Next player: " + this.state.player;
    const winner = calculateWinner(this.squares());
    if (winner) {
      const players = { X: 'O', O: 'X' };
      status = players[this.state.player] + " has just won!";
    }

    const moves = this.state.history.squares.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={ move }>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            player={ this.state.player }
            squares={ this.squares() }
            onClick={ (i) => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
