import React, { FunctionComponent, CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const canvasHeight: number = 12;
const canvasWidth: number = 12;

interface ColorInputProps {
  handleUpdate: Function;
}
interface ColorInputState {
  color: string;
}
class ColorInput extends React.Component<ColorInputProps, ColorInputState> {
  constructor(props: ColorInputProps) {
    super(props);
    this.state = {
      color: '#ccc',
    };
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ color: e.target.value });
    this.props.handleUpdate(e.target.value);
  }

  render() {
    return <input type="color" value={this.state.color} onChange={(e) => this.onChange(e)} />
  }
}

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

interface CanvasProps {
  color: string;
}
interface CanvasState {
  dots: DotValues[];
}
class Canvas extends React.Component<CanvasProps, CanvasState> {
  constructor(props: CanvasProps) {
    super(props);
    this.state = {
      dots: Array(canvasHeight * canvasWidth).fill(null).map(values => ({
        isFill: false,
        color: this.props.color,
      } as DotValues)),
    };
  }

  handleClick(i: number) {
    const dots = this.state.dots.slice();
    const dot = dots[i];
    dots[i].isFill = !dots[i].isFill;
    dots[i].color = this.props.color;
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

interface AppProps {}
interface AppState {
  color: string;
}
class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      color: '#000',
    };
  }

  colorHandleUpdate(color: string) {
    this.setState({
      color
    });
  }

  render() {
    return (
      <div className="board">
        <div className="board-board">
          <Canvas color={this.state.color} />
        </div>
        <div className="board-info">
          <div>
            {<ColorInput handleUpdate={(color: string) => this.colorHandleUpdate(color)} />}
          </div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
};

ReactDOM.render(<App />, document.getElementById('root'));
