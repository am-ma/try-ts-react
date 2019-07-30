import React from 'react';
import DotCanvas from './DotCanvas';
import DotValues from '~/models/DotValues.model';
import renderer from 'react-test-renderer';

describe('DotCanvas', () => {
  describe('render', () => {
    it('will render', () => {
      const dot1: DotValues = { isFill: true, color: '#000' };
      const dot2: DotValues = { isFill: true, color: '#000' };
      const dot3: DotValues = { isFill: false, color: '#000' };
      const dot4: DotValues = { isFill: false, color: '#000' };
      const dots = [dot1, dot2, dot3, dot4];
      const onClick = jest.fn();

      const result = renderer.create(<DotCanvas onClick={onClick} dots={dots} height={2} width={2} />);
      expect(result).toMatchSnapshot();
    });
  });
});
