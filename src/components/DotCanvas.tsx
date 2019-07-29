import React from 'react';
import Dot from './Dot';
import DotValues from '~/models/DotValues.model';

interface DotCanvasProps {
  onClick: Function;
  dots: DotValues[];
  height: number;
  width: number;
}

interface DotCanvasState {}

export default class DotCanvas extends React.Component<DotCanvasProps, DotCanvasState> {
  renderDot(index: number) {
    const values = this.props.dots[index];
    return <Dot values={values} key={index} onClick={() => this.props.onClick(index)} />;
  }

  render() {
    const dots = Array(this.props.height)
      .fill(null)
      .map((_, h) => (
        <div className="canvas-row" key={h}>
          {Array(this.props.width)
            .fill(null)
            .map((_, w) => {
              const index = w + h * this.props.width;
              return this.renderDot(index);
            })}
        </div>
      ));

    return <div>{dots}</div>;
  }
}
