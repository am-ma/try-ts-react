import React from 'react';
import Dot from './Dot';
import renderer from 'react-test-renderer';
import DotValues from '~/models/DotValues.model';

describe('Dot', () => {
  describe('render', () => {
    it('will render when isFill is TRUE', () => {
      const onClick = jest.fn();
      const values: DotValues = {
        isFill: true,
        color: '#000',
      };
      const result = renderer.create(<Dot values={values} onClick={onClick} />).toJSON();

      expect(result).toMatchSnapshot();
    });
    it('will render when isFill is FALSE', () => {
      const onClick = jest.fn();
      const values: DotValues = {
        isFill: false,
        color: '#000',
      };
      const result = renderer.create(<Dot values={values} onClick={onClick} />).toJSON();

      expect(result).toMatchSnapshot();
    });
  });
});
