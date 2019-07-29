import React, { CSSProperties } from 'react';
import DotValues from '~/models/DotValues.model';

interface DotPreviewProps {
  dots: DotValues[];
  dotSize: number;
  height: number;
  width: number;
}

interface DotPreviewState {
  dlUrl: string;
}

export default class DotPreview extends React.Component<DotPreviewProps, DotPreviewState> {
  private svg = React.createRef<SVGSVGElement>();
  private canvas = React.createRef<HTMLCanvasElement>();
  constructor(props: DotPreviewProps) {
    super(props);
    this.state = {
      dlUrl: '#',
    };
  }
  render() {
    // render svg
    const dotSize = this.props.dotSize;
    const width = dotSize * this.props.width;
    const height = dotSize * this.props.height;

    const imageDots = this.props.dots
      .map((dot, i) => {
        if (!dot.isFill) {
          return null;
        }
        const style: CSSProperties = {
          fill: dot.color,
        };
        const xIndex = i % this.props.height;
        const yIndex = Math.floor(i / this.props.width);
        return (
          <rect
            key={`${xIndex}_${yIndex}`}
            x={xIndex * dotSize}
            y={yIndex * dotSize}
            width={dotSize}
            height={dotSize}
            style={style}></rect>
        );
      })
      .filter(dotJSX => dotJSX !== null);

    return (
      <>
        <svg id="svg" width={width} height={height} ref={this.svg}>
          {imageDots}
        </svg>
        <canvas id="canvas" ref={this.canvas} width={width} height={height} className="not-display"></canvas>
        <div>
          <a href={this.state.dlUrl} id="download" download="dots.png">
            download
          </a>
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
