import React from 'react';

import DotValues from '~/models/DotValues.model';
import DotCanvas from './DotCanvas';
import DotPreview from './DotPreview';

const canvasHeight: number = 12;
const canvasWidth: number = 12;

interface AppProps {}
interface AppState {
  color: string;
  dots: DotValues[];
  isSaved: boolean;
  dotSize: number;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    const defaultColor = '#000';
    // 読み出し
    const loaded = this.load();

    this.state = {
      color: defaultColor,
      dots: loaded
        ? loaded
        : Array(canvasHeight * canvasWidth)
            .fill(null)
            .map(
              () =>
                ({
                  isFill: false,
                  color: defaultColor,
                } as DotValues)
            ),
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
    this.setState({ isSaved: true });
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
          <DotCanvas
            height={canvasHeight}
            width={canvasWidth}
            dots={this.state.dots}
            onClick={(i: number) => this.handleClick(i)}
          />
        </div>
        <div className="board-info">
          <div>
            <input
              type="color"
              value={this.state.color}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.colorOnChange(e)}
            />
          </div>
          <div>
            <button type="button" onClick={() => this.saveOnClick()}>
              save
            </button>
            {this.state.isSaved && (
              <button type="button" onClick={() => this.loadOnClick()}>
                load
              </button>
            )}
          </div>
          <div className="downloads">
            <div>
              dot size{' '}
              <input
                className="dot-size"
                type="number"
                value={this.state.dotSize}
                onChange={e => this.dotSizeOnChange(e)}></input>{' '}
              px
            </div>
            <DotPreview height={canvasHeight} width={canvasWidth} dotSize={this.state.dotSize} dots={this.state.dots} />
          </div>
        </div>
      </div>
    );
  }
}
