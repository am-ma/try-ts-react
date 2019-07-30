import React from 'react';
import App from './App';
import renderer from 'react-test-renderer';
import DotPreview from './components/DotPreview';
import { shallow } from 'enzyme';

describe('App', () => {
  const jsx = <App canvasHeight={2} canvasWidth={2} />;
  describe('render', () => {
    it('will render', () => {
      jest.spyOn(DotPreview.prototype, 'renderForDownload').mockImplementationOnce(jest.fn());
      const result = renderer.create(jsx).toJSON();

      expect(result).toMatchSnapshot();
    });
  });

  describe('handleClick', () => {
    it('will update target index Dot.values', () => {
      const wrapper = shallow(jsx);
      const app = wrapper.instance() as App;
      app.state.dots[0] = { isFill: false, color: '#000' };

      app.setState({ color: '#fff' });
      app.handleClick(0);
      expect(app.state.dots[0]).toEqual({ isFill: true, color: '#fff' });
    });
  });

  describe('colorOnChange', () => {
    it('will update color', () => {
      const wrapper = shallow(jsx);
      const app = wrapper.instance() as App;
      app.setState({ color: '#000' });

      const event: any = { target: { value: '#fff' } };
      app.colorOnChange(event);
      expect(app.state.color).toEqual('#fff');
    });
  });

  describe('saveOnClick', () => {
    it('will save dots', () => {
      const wrapper = shallow(jsx);
      const app = wrapper.instance() as App;

      const setItem = jest.fn();
      jest.spyOn(window.localStorage, 'setItem').mockImplementationOnce(setItem);
      const alert = jest.fn();
      jest.spyOn(window, 'alert').mockImplementationOnce(alert);

      app.setState({
        isSaved: false,
        dots: [],
      });

      app.saveOnClick();

      expect(setItem).toHaveBeenCalledWith('ts-react-drawing', '[]');
      expect(alert).toHaveBeenCalledWith('saved!');
      expect(app.state.isSaved).toBe(true);
    });
  });

  describe('dotSizeOnChange', () => {
    it('will save dotSize', () => {
      const event: any = { target: { value: 10 } };
      const wrapper = shallow(jsx);
      const app = wrapper.instance() as App;
      app.setState({
        dotSize: 2,
      });

      app.dotSizeOnChange(event);

      expect(app.state.dotSize).toBe(10);
    });
  });

  describe('load', () => {
    it('will load dots in localStorage', () => {
      window.localStorage.setItem('ts-react-drawing', '[{"isFill":false,"color":"#ccc"}]');

      const wrapper = shallow(jsx);
      const app = wrapper.instance() as App;

      const result = app.load();

      expect(result).toEqual([{ isFill: false, color: '#ccc' }]);
    });
    it('will return empty array when localStrage target item is empty', () => {
      window.localStorage.setItem('ts-react-drawing', '');

      const wrapper = shallow(jsx);
      const app = wrapper.instance() as App;

      const result = app.load();

      expect(result).toEqual([]);
    });
    it('will return empty array when localStrage target item is no set', () => {
      window.localStorage.clear();

      const wrapper = shallow(jsx);
      const app = wrapper.instance() as App;

      const result = app.load();

      expect(result).toEqual([]);
    });
  });

  describe('loadOnClick', () => {
    it('will update state.dots', () => {
      const wrapper = shallow(jsx);
      const app = wrapper.instance() as App;
      app.setState({
        dots: [],
      });
      jest.spyOn(app, 'load').mockImplementationOnce(() => ['hoge']);

      app.loadOnClick();

      expect(app.state.dots).toEqual(['hoge']);
    });
  });
});
