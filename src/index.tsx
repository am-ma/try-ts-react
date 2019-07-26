import React, { FunctionComponent, CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const canvasHeight: number = 12;
const canvasWidth: number = 12;

interface DotValues {
  isFill: boolean;
  color: string;
}
interface DotProps {
  values: DotValues;
  onClick: Function;
}
interface DotState { }
class Dot extends React.Component<DotProps, DotState> {
  constructor(props: DotProps) {
    super(props);
  }

  renderStyle() {
    if (!this.props.values.isFill) {
      return {} as CSSProperties;
    }

    return {
      backgroundColor: this.props.values.color,
    } as CSSProperties;
  }

  render() {
    return <button style={this.renderStyle()} className="dot" onClick={() => this.props.onClick()}></button>;
  }
}

interface CanvasProps {}
interface CanvasState {
  dots: DotValues[];
}
class Canvas extends React.Component<CanvasProps, CanvasState> {
  constructor(props: CanvasProps) {
    super(props);
    this.state = {
      dots: Array(canvasHeight * canvasWidth).fill(null).map(values => ({
        isFill: false,
        color: '#000',
      } as DotValues)),
    };
  }

  handleClick(i: number) {
    const dots = this.state.dots.slice();
    const dot = dots[i];
    dots[i].isFill = !dots[i].isFill;
    dots[i].color = '#000';
    this.setState({ dots: dots });
  }

  render() {
    const dots = Array(canvasHeight)
      .fill(null)
      .map((_, h) => (
        <div className="canvas-row" key={h}>
          {Array(canvasWidth)
            .fill(null)
            .map((_, w) => {
              const index = w + h * canvasWidth;
              const values = this.state.dots[index];
              return <Dot values={values} key={index} onClick={() => this.handleClick(index)} />;
            })}
        </div>
      ));

    return <div>{dots}</div>;
  }
}

const App: FunctionComponent = () => {
  return (
    <div className="board">
      <div className="board-board">
        <Canvas />
      </div>
      <div className="board-info">
        <div>{/* status */}</div>
        <ol>{/* TODO */}</ol>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
