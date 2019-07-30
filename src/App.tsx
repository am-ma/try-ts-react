import React from 'react';

import DotValues from '~/models/DotValues.model';
import DotCanvas from './components/DotCanvas';
import DotPreview from './components/DotPreview';

interface AppProps {
  canvasHeight: number;
  canvasWidth: number;
}
interface AppState {
  color: string;
  dots: DotValues[];
  isSaved: boolean;
  dotSize: number;
}

export default class App extends React.Component<AppProps, AppState> {
  private defaultColor = '#000';
  constructor(props: AppProps) {
    super(props);

    // 読み出し
    const loaded = this.load();
    const isLoaded = loaded.length > 0;

    this.state = {
      color: this.defaultColor,
      dots: isLoaded ? loaded : this.createDefaultDots(),
      isSaved: isLoaded,
      dotSize: 8,
    };
  }

  createDefaultDots() {
    return Array(this.props.canvasHeight * this.props.canvasWidth)
      .fill(null)
      .map(
        () =>
          ({
            isFill: false,
            color: this.defaultColor,
          } as DotValues)
      );
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

  clearOnClick() {
    const dots = this.createDefaultDots();
    this.setState({
      dots,
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
            height={this.props.canvasHeight}
            width={this.props.canvasWidth}
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
            <button type="button" onClick={() => this.clearOnClick()}>
              clear
            </button>
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
            <DotPreview
              height={this.props.canvasHeight}
              width={this.props.canvasWidth}
              dotSize={this.state.dotSize}
              dots={this.state.dots}
            />
          </div>
        </div>
      </div>
    );
  }
}
