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
      color: '#000',
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
  onClick: Function;
  dots: DotValues[];
}
interface CanvasState {}
class Canvas extends React.Component<CanvasProps, CanvasState> {
  constructor(props: CanvasProps) {
    super(props);
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
              const values = this.props.dots[index];
              return <Dot values={values} key={index} onClick={() => this.props.onClick(index)} />;
            })}
        </div>
      ));

    return <div>{dots}</div>;
  }
}

interface AppProps {}
interface AppState {
  color: string;
  dots: DotValues[];
  isSaved: boolean;
}
class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    const defaultColor = '#000';
    // 読み出し
    const loaded = this.load();

    this.state = {
      color: defaultColor,
      dots: loaded ? loaded : Array(canvasHeight * canvasWidth).fill(null).map(values => ({
        isFill: false,
        color: defaultColor,
      } as DotValues)),
      isSaved: loaded !== [],
    };
  }

  colorHandleUpdate(color: string) {
    this.setState({
      color
    });
  }

  handleClick(i: number) {
    const dots = this.state.dots.slice();
    dots[i].isFill = !dots[i].isFill;
    dots[i].color = this.state.color;
    this.setState({ dots: dots });
  }

  saveOnClick() {
    const dotsJson = JSON.stringify(this.state.dots);
    window.localStorage.setItem('ts-react-drawing', dotsJson);
    window.alert('saved!');
    this.setState({isSaved: true});
  }

  load() {
    const dotsJson = window.localStorage.getItem('ts-react-drawing');
    if (!dotsJson) {
      return [];
    } 

    return JSON.parse(dotsJson);
  }

  loadOnClick() {
    const loaded = this.load();
    this.setState({ dots: loaded });
  }

  render() {
    return (
      <div className="board">
        <div className="board-board">
          <Canvas dots={this.state.dots} onClick={(i: number) => this.handleClick(i)} />
        </div>
        <div className="board-info">
          <div>
            <ColorInput handleUpdate={(color: string) => this.colorHandleUpdate(color)} />
          </div>
          <div>
            <button type="button" onClick={() => this.saveOnClick()}>save</button>
            {this.state.isSaved && <button type="button" onClick={() => this.loadOnClick()}>load</button>}
          </div>
        </div>
      </div>
    );
  }
};

ReactDOM.render(<App />, document.getElementById('root'));
