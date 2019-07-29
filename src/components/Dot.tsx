import React, { CSSProperties } from 'react';
import DotValues from '~/models/DotValues.model';

interface DotProps {
  values: DotValues;
  onClick: Function;
}

interface DotState {}

export default class Dot extends React.Component<DotProps, DotState> {
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
