import { Carousel } from './carousel';
import * as carouselUtils from './carousel-utils';
import * as breakpointObserverUtils from '../../../utils/breakpoint-observer';
import * as validatePropsUtils from '../../../utils/validation/validateProps';
import * as breakpointCustomizableUtils from '../../../utils/breakpoint-customizable';
import * as breakpointObserverUtilsUtils from '../../../utils/breakpoint-observer-utils';
import * as jsonUtils from '../../../utils/json';
import { Splide } from '@splidejs/splide';
import * as splideModule from '@splidejs/splide';

describe('connectedCallback', () => {
  it('should call this.observeBreakpointChange()', () => {
    const component = new Carousel();
    const spy = jest.spyOn(component, 'observeBreakpointChange' as any);

    component.connectedCallback();
    expect(spy).toBeCalledWith();
  });
});

describe('componentWillLoad', () => {
  it('should call parseJSON() with correct parameters and set slidesPerPage', () => {
    const spy = jest.spyOn(breakpointCustomizableUtils, 'parseJSON').mockReturnValueOnce(5).mockReturnValueOnce(10);
    const component = new Carousel();
    component.host = document.createElement('p-carousel');
    component.slidesPerPage = 2;

    component.componentWillLoad();
    expect(spy).toBeCalledWith(2);

    expect(component.slidesPerPage).toBe(5);
  });

  it('should call this.updateSlidesAndPagination()', () => {
    const component = new Carousel();
    component.host = document.createElement('p-carousel');
    const spy = jest.spyOn(component, 'updateSlidesAndPagination' as any);

    component.componentWillLoad();
    expect(spy).toBeCalledWith();
  });

  it('should call this.observeBreakpointChange()', () => {
    const component = new Carousel();
    component.host = document.createElement('p-carousel');
    const spy = jest.spyOn(component, 'observeBreakpointChange' as any);

    component.componentWillLoad();
    expect(spy).toBeCalledWith();
  });
});

describe('componentDidLoad', () => {
  const splideMock = {
    index: 0,
    on: (_, __) => ({} as Splide),
    mount: () => {},
  } as Splide;

  const getContainerEl = (): HTMLElement => {
    const container = document.createElement('div');
    container.className = 'splide';

    const track = document.createElement('div');
    track.className = 'splide__track';

    const list = document.createElement('div');
    list.className = 'splide__list';

    track.append(list);
    container.append(track);

    return container;
  };

  it('should call getSplideBreakpoints() with correct parameters', () => {
    jest.spyOn(splideModule, 'Splide').mockReturnValue(splideMock);
    const spy = jest.spyOn(carouselUtils, 'getSplideBreakpoints');
    const component = new Carousel();
    component.slidesPerPage = 3;

    component.componentDidLoad();
    expect(spy).toBeCalledWith(3);
  });

  it('should call parseJSONAttribute() with correct parameter', () => {
    jest.spyOn(splideModule, 'Splide').mockReturnValue(splideMock);
    const spy = jest.spyOn(jsonUtils, 'parseJSONAttribute');
    const component = new Carousel();
    component.internationalization = { first: 'first' };

    component.componentDidLoad();
    expect(spy).toBeCalledWith(component.internationalization);
  });

  it('should call Splide constructor with correct parameters and set this.splide', () => {
    const spy = jest.spyOn(splideModule, 'Splide').mockReturnValue(splideMock);

    const component = new Carousel();
    expect(component['splide']).toBeUndefined();

    component.componentDidLoad();
    expect(spy).toBeCalledTimes(1);
    expect(spy.mock.calls[0]).toMatchSnapshot();
    expect(component['splide']).toBe(splideMock);
  });

  it('should call this.splide.on() twice with correct parameters', () => {
    const onSpy: (_, __) => Splide = jest.fn();
    jest.spyOn(splideModule, 'Splide').mockReturnValue({ ...splideMock, on: onSpy } as Splide);
    const component = new Carousel();

    component.componentDidLoad();
    expect(onSpy).toBeCalledTimes(2);
    expect(onSpy).toHaveBeenNthCalledWith(1, 'mounted', expect.any(Function));
    expect(onSpy).toHaveBeenNthCalledWith(2, 'move', expect.any(Function));
  });

  it('should call updatePrevNextButtonAria() and renderPagination() with correct parameters on mounted event', () => {
    const updatePrevNextButtonAriaSpy = jest
      .spyOn(carouselUtils, 'updatePrevNextButtonAria')
      .mockImplementation(() => {});
    const renderPaginationSpy = jest.spyOn(carouselUtils, 'renderPagination').mockImplementation(() => {});
    const component = new Carousel();
    component['container'] = getContainerEl();
    component.componentDidLoad();

    component['splide'].emit('mounted');
    expect(updatePrevNextButtonAriaSpy).toBeCalledWith(component['btnPrev'], component['btnNext'], component['splide']);
    expect(renderPaginationSpy).toBeCalledWith(component['pagination'], component['amountOfPages'], 0);
  });

  it('should call updatePrevNextButtonAria(), updatePagination() and this.carouselChange.emit() with correct parameters on move event', () => {
    const updatePrevNextButtonAriaSpy = jest
      .spyOn(carouselUtils, 'updatePrevNextButtonAria')
      .mockImplementation(() => {});
    const updatePaginationSpy = jest.spyOn(carouselUtils, 'updatePagination').mockImplementation(() => {});
    const carouselChangeEmitSpy = jest.fn();
    const component = new Carousel();
    component['container'] = getContainerEl();
    component['carouselChange'] = { emit: carouselChangeEmitSpy };
    component.componentDidLoad();

    component['splide'].emit('move', 1, 0);
    expect(updatePrevNextButtonAriaSpy).toBeCalledWith(component['btnPrev'], component['btnNext'], component['splide']);
    expect(updatePaginationSpy).toBeCalledWith(component['pagination'], 1);
    expect(carouselChangeEmitSpy).toBeCalledWith({ activeIndex: 1, previousIndex: 0 });
  });

  it('should call this.splide.mount()', () => {
    const mountSpy: (_, __) => Splide = jest.fn();
    jest.spyOn(splideModule, 'Splide').mockReturnValue({ ...splideMock, mount: mountSpy } as Splide);
    const component = new Carousel();

    component.componentDidLoad();
    expect(mountSpy).toBeCalledWith();
  });
});

describe('componentWillRender', () => {
  it('should call warnIfHeadingIsMissing() with correct parameters', () => {
    const spy = jest.spyOn(carouselUtils, 'warnIfHeadingIsMissing');
    const component = new Carousel();
    component.host = document.createElement('p-carousel');
    component.host.attachShadow({ mode: 'open' });
    component.heading = 'heading';

    component.componentWillRender();
    expect(spy).toBeCalledWith(component.host, 'heading');
  });

  it('should call parseJSON() with correct parameter and set this.disablePagination', () => {
    jest.spyOn(validatePropsUtils, 'validateProps').mockImplementation(() => {});
    jest.spyOn(carouselUtils, 'warnIfHeadingIsMissing').mockImplementation(() => {});
    const spy = jest.spyOn(breakpointCustomizableUtils, 'parseJSON').mockReturnValue(false);
    const component = new Carousel();
    component.host = document.createElement('p-carousel');
    component.host.attachShadow({ mode: 'open' });
    component.disablePagination = true;

    component.componentWillRender();
    expect(spy).toBeCalledWith(true);

    expect(component.disablePagination).toBe(false);
  });
});

describe('componentDidUpdate', () => {
  it('should call this.splide.refresh()', () => {
    const refreshSpy: () => Splide = jest.fn();
    const component = new Carousel();
    component['splide'] = { refresh: refreshSpy } as Splide;

    component.componentDidUpdate();
    expect(refreshSpy).toBeCalledWith();
  });
});

describe('observeBreakpointChange()', () => {
  it('should not call observeBreakpointChange() if slidesPerPage is a number', () => {
    const spy = jest.spyOn(breakpointObserverUtils, 'observeBreakpointChange');
    const component = new Carousel();
    component.slidesPerPage = 1;

    component['observeBreakpointChange']();
    expect(spy).not.toBeCalled();
  });

  it('should call observeBreakpointChange() with correct parameters if slidesPerPage is an object', () => {
    const spy = jest.spyOn(breakpointObserverUtils, 'observeBreakpointChange');
    const component = new Carousel();
    component.host = document.createElement('p-carousel');
    component.slidesPerPage = { base: 2, m: 3 };

    component['observeBreakpointChange']();
    expect(spy).toBeCalledWith(component.host, component['updateAmountOfPages']);
  });
});

describe('updateSlidesAndPagination()', () => {
  it('should call getSlides() with correct parameter and set this.slides', () => {
    const slide1 = document.createElement('div');
    slide1.id = 'slide1';
    const slide2 = document.createElement('div');
    slide2.id = 'slide2';
    const getSlidesMock = [slide1, slide2];
    const spy = jest.spyOn(carouselUtils, 'getSlides').mockReturnValue(getSlidesMock);
    const component = new Carousel();
    component.host = document.createElement('p-carousel');
    expect(component['slides']).toBeUndefined();

    component['updateSlidesAndPagination']();
    expect(spy).toBeCalledWith(component.host);
    expect(component['slides']).toBe(getSlidesMock);
  });

  it('should call this.updateAmountOfPages()', () => {
    jest.spyOn(carouselUtils, 'getSlides').mockImplementation(() => []);
    const component = new Carousel();
    const spy = jest.spyOn(component, 'updateAmountOfPages' as any);

    component['updateSlidesAndPagination']();
    expect(spy).toBeCalledWith();
  });
});

describe('updateAmountOfPages()', () => {
  it('should call getCurrentMatchingBreakpointValue() and getAmountOfPages() with correct parameters and set this.amountOfPages', () => {
    const getAmountOfPagesSpy = jest.spyOn(carouselUtils, 'getAmountOfPages').mockReturnValue(5);
    const getCurrentMatchingBreakpointValueSpy = jest
      .spyOn(breakpointObserverUtilsUtils, 'getCurrentMatchingBreakpointValue')
      .mockReturnValue(11);
    const component = new Carousel();
    component.slidesPerPage = 1;
    component['slides'] = Array(2);
    expect(component['amountOfPages']).toBeUndefined();

    component['updateAmountOfPages']();
    expect(getCurrentMatchingBreakpointValueSpy).toBeCalledWith(1);
    expect(getAmountOfPagesSpy).toBeCalledWith(2, 11);
    expect(component['amountOfPages']).toBe(5);
  });

  it('should call renderPagination() with correct parameters', () => {
    jest.spyOn(carouselUtils, 'getAmountOfPages').mockReturnValue(5);
    const spy = jest.spyOn(carouselUtils, 'renderPagination');
    const component = new Carousel();
    component['slides'] = Array(2);
    component['splide'] = { index: 1 } as Splide;

    component['updateAmountOfPages']();
    expect(spy).toBeCalledWith(component['pagination'], 5, 1);
  });
});
