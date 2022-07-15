import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        onClick={() => this.props.onClick(i)}
        value={this.props.squares[i]}
      />
    );
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
      history: [{ squares: Array(9).fill(null) }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const squares = history[this.state.stepNumber].squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    history.push({ squares: squares });
    console.log(squares, history);
    this.setState({
      history: history,
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length - 1,
    });
  }

  jumpTo(step) {
    this.setState({
      xIsNext: step % 2 === 0,
      stepNumber: step,
    });
  }

  render() {
    const history = this.state.history;
    console.log(this.state.stepNumber, history);
    const current = history[this.state.stepNumber].squares;
    const winner = calculateWinner(current);
    const moves = history.map((move, step) => {
      const desc = step ? `Go to move # ${step}` : "Go to game start";
      return (
        <li key={step}>
          <button onClick={() => this.jumpTo(step)}>{desc}</button>
        </li>
      );
    });
    let status = "";
    if (winner) status = "Winner: " + winner;
    else status = "Next player: " + (this.state.xIsNext ? "X" : "O");

    return (
      <div className="game">
        <div className="game-board">
          <Board onClick={(i) => this.handleClick(i)} squares={current} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);

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
