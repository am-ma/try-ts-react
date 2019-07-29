import React, { FunctionComponent, CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { taggedTemplateExpression } from '@babel/types';

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

interface CanvasProps {
  onClick: Function;
  dots: DotValues[];
}
interface CanvasState {}
class Canvas extends React.Component<CanvasProps, CanvasState> {
  constructor(props: CanvasProps) {
    super(props);
  }

  renderDot(index: number) {
    const values = this.props.dots[index];
    return <Dot values={values} key={index} onClick={() => this.props.onClick(index)} />;
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
              return this.renderDot(index);
            })}
        </div>
      ));

    return <div>{dots}</div>;
  }
}


interface PreviewProps {
  dots: DotValues[];
  dotSize: number;
}

interface PreviewState {
  dlUrl: string;
}
class Preview extends React.Component<PreviewProps, PreviewState> {
  private svg = React.createRef<SVGSVGElement>();
  private canvas = React.createRef<HTMLCanvasElement>();
  constructor(props: PreviewProps) {
    super(props);
    this.state = {
      dlUrl: '#',
    };
  }
  render() {
    // render svg
    const dotSize = this.props.dotSize;
    const width = dotSize * canvasWidth;
    const height = dotSize * canvasHeight;

    const imageDots = this.props.dots.map((dot, i) => {
      const style: CSSProperties = {
        fill: dot.isFill ? dot.color : '#fff',
      };
      const xIndex = i % canvasWidth;
      const yIndex = Math.floor(i / canvasWidth);
      return <rect key={`${xIndex}_${yIndex}`} x={xIndex*dotSize} y={yIndex*dotSize} width={dotSize} height={dotSize} style={style}></rect>
    });

    return (
      <>
        <svg id="svg" width={width} height={height} ref={this.svg}>{ imageDots }</svg>
        <canvas id="canvas" ref={this.canvas} width={width} height={height} className="not-display">
        </canvas>            
        <div>
          <a href={this.state.dlUrl} id="download" download="dots.png">download</a>
        </div>
      </>
    );
  }

  componentDidMount() {
    this.renderForDownload();
  }

  componentDidUpdate() {
    this.renderForDownload();
  }

  renderForDownload() {
    // svg to xml data src
    const svg = this.svg.current!;
    const svgData = new XMLSerializer().serializeToString(svg as Node);
    const imgsrc = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    
    const canvas = this.canvas.current!;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const image = new Image();
    image.onload = () => {
      // render canvas
      ctx.drawImage(image, 0, 0);
      // render download button
      this.setState({
        dlUrl: canvas.toDataURL('image/png'),
      });
    };
    image.src = imgsrc;
  }
}


interface AppProps {}
interface AppState {
  color: string;
  dots: DotValues[];
  isSaved: boolean;
  dotSize: number;
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
      dotSize: 8,
    };
  }

  handleClick(i: number) {
    const dots = this.state.dots.slice();
    dots[i].isFill = !dots[i].isFill;
    dots[i].color = this.state.color;
    this.setState({ dots: dots });
  }

  colorOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      color: e.target.value,
    });
  }

  saveOnClick() {
    const dotsJson = JSON.stringify(this.state.dots);
    window.localStorage.setItem('ts-react-drawing', dotsJson);
    window.alert('saved!');
    this.setState({isSaved: true});
  }

  dotSizeOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ dotSize: parseInt(e.target.value) });
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
          <input type="color" value={this.state.color} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.colorOnChange(e)} />
          </div>
          <div>
            <button type="button" onClick={() => this.saveOnClick()}>save</button>
            {this.state.isSaved && <button type="button" onClick={() => this.loadOnClick()}>load</button>}
          </div>
          <div className="downloads">
            <div>
              dot size <input className="dot-size" type="number" value={this.state.dotSize} onChange={(e) => this.dotSizeOnChange(e)}></input> px
            </div>
            <Preview dotSize={this.state.dotSize} dots={this.state.dots} />
          </div>
        </div>
      </div>
    );
  }
};

ReactDOM.render(<App />, document.getElementById('root'));
