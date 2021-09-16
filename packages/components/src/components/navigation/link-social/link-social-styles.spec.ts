import { BreakpointCustomizable, Theme } from '../../../types';
import { addComponentCss, getComponentCss } from './link-social-styles';
import { SocialIconName } from './link-social-utils';
import * as jssUtils from './../../../utils/jss';

describe('addComponentCss()', () => {
  it('should call getCachedComponentCss() to retrieve cached css', () => {
    const host = document.createElement('p-link-social');
    jest.spyOn(jssUtils, 'attachCss').mockImplementation(() => {});
    const spy = jest.spyOn(jssUtils, 'getCachedComponentCss').mockImplementation(() => '');

    addComponentCss(host, 'logo-facebook', false, true, 'light');

    expect(spy).toHaveBeenCalledWith(host, expect.anything(), 'logo-facebook', false, true, 'light');
  });
});

describe('getComponentCss()', () => {
  it.each<[SocialIconName, BreakpointCustomizable<boolean>, boolean, Theme]>([
    [undefined, false, false, 'light'],
    [undefined, false, false, 'dark'],
    ['logo-facebook', false, false, 'light'],
    ['logo-facebook', false, false, 'dark'],
    ['logo-google', false, false, 'light'],
    ['logo-google', false, false, 'dark'],
    ['logo-instagram', false, false, 'light'],
    ['logo-instagram', false, false, 'dark'],
    ['logo-kakaotalk', false, false, 'light'],
    ['logo-kakaotalk', false, false, 'dark'],
    ['logo-linkedin', false, false, 'light'],
    ['logo-linkedin', false, false, 'dark'],
    ['logo-naver', false, false, 'light'],
    ['logo-naver', false, false, 'dark'],
    ['logo-pinterest', false, false, 'light'],
    ['logo-pinterest', false, false, 'dark'],
    ['logo-reddit', false, false, 'light'],
    ['logo-reddit', false, false, 'dark'],
    ['logo-tiktok', false, false, 'light'],
    ['logo-tiktok', false, false, 'dark'],
    ['logo-twitter', false, false, 'light'],
    ['logo-twitter', false, false, 'dark'],
    ['logo-wechat', false, false, 'light'],
    ['logo-wechat', false, false, 'dark'],
    ['logo-whatsapp', false, false, 'light'],
    ['logo-whatsapp', false, false, 'dark'],
    ['logo-xing', false, false, 'light'],
    ['logo-xing', false, false, 'dark'],
    ['logo-youtube', false, false, 'light'],
    ['logo-youtube', false, false, 'dark'],
    ['logo-youtube', { base: true, xs: false, s: true, m: false, l: true, xl: false }, false, 'light'],
    ['logo-youtube', false, true, 'light'],
  ])(
    'should return correct css for variant: %s, hideLabel: %s, hasHref: %s and theme: %s',
    (variant, hideLabel, hasHref, theme) => {
      expect(getComponentCss(variant, hideLabel, hasHref, theme)).toMatchSnapshot();
    }
  );
});
