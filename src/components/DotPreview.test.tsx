import React from 'react';
import DotPreview from './DotPreview';
import DotValues from '~/models/DotValues.model';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

describe('DotPreview', () => {
  const dot1: DotValues = { isFill: true, color: '#000' };
  const dot2: DotValues = { isFill: true, color: '#000' };
  const dot3: DotValues = { isFill: false, color: '#000' };
  const dot4: DotValues = { isFill: false, color: '#000' };
  const dots = [dot1, dot2, dot3, dot4];
  const jsx = <DotPreview dots={dots} dotSize={8} height={2} width={2} />;
  describe('render', () => {
    it('will render', () => {
      jest.spyOn(DotPreview.prototype, 'renderForDownload').mockImplementationOnce(jest.fn());

      const result = renderer.create(jsx).toJSON();

      expect(result).toMatchSnapshot();
    });
  });

  describe('componentDidMount', () => {
    it('will call renderForDownload()', () => {
      jest.spyOn(DotPreview.prototype, 'renderForDownload').mockImplementationOnce(jest.fn());

      const wrapper = shallow(jsx);
      const dotPreview = wrapper.instance() as DotPreview;

      expect(dotPreview.renderForDownload).toHaveBeenCalled();
    });
  });

  describe('componentDidUpdate', () => {
    it('will call renderForDownload()', () => {
      jest.spyOn(DotPreview.prototype, 'renderForDownload').mockImplementationOnce(jest.fn());

      const wrapper = shallow(jsx);
      const dotPreview = wrapper.instance() as DotPreview;

      const dot1: DotValues = { isFill: true, color: '#FFF' };
      const dot2: DotValues = { isFill: true, color: '#FFF' };
      const dot3: DotValues = { isFill: false, color: '#000' };
      const dot4: DotValues = { isFill: false, color: '#000' };
      const newDots = [dot1, dot2, dot3, dot4];

      dotPreview.renderForDownload = jest.fn();
      wrapper.setState({ dots: newDots });

      expect(dotPreview.renderForDownload).toHaveBeenCalled();
    });
  });
});
