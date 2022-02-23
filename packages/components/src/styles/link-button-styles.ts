import type { Styles, JssStyle } from 'jss';
import type { BreakpointCustomizable } from '../utils';
import type { GetStyleFunction } from '../utils';
import type { LinkButtonVariant, ThemeExtendedElectric } from '../types';
import { buildResponsiveStyle, isThemeDark } from '../utils';
import {
  addImportantToEachRule,
  addImportantToRule,
  getFocusStyle,
  getInsetStyle,
  getTransition,
  pxToRemWithUnit,
  getThemedColors,
} from './';

const { baseColor: darkThemeBaseColor } = getThemedColors('dark');
const { baseColor: lightThemeBaseColor } = getThemedColors('light');

const getVariantColors = (
  variant: LinkButtonVariant,
  theme: ThemeExtendedElectric
): { primaryColor: string; primaryColorHover: string; baseColor: string } => {
  const { brandColor, baseColor, contrastHighColor, hoverColorDarken, contrastHighColorDarken, baseColorDarken } =
    getThemedColors(theme);

  const colors: {
    [t in ThemeExtendedElectric]: {
      [v in LinkButtonVariant]: { primaryColor: string; primaryColorHover: string; baseColor: string };
    };
  } = {
    light: {
      primary: {
        primaryColor: brandColor,
        primaryColorHover: hoverColorDarken,
        baseColor: darkThemeBaseColor,
      },
      secondary: {
        primaryColor: contrastHighColor,
        primaryColorHover: contrastHighColorDarken,
        baseColor: darkThemeBaseColor,
      },
      tertiary: {
        primaryColor: contrastHighColor,
        primaryColorHover: contrastHighColorDarken,
        baseColor,
      },
    },
    dark: {
      primary: {
        primaryColor: brandColor,
        primaryColorHover: hoverColorDarken,
        baseColor: darkThemeBaseColor,
      },
      secondary: {
        primaryColor: darkThemeBaseColor,
        primaryColorHover: baseColorDarken,
        baseColor: lightThemeBaseColor,
      },
      tertiary: {
        primaryColor: darkThemeBaseColor,
        primaryColorHover: darkThemeBaseColor,
        baseColor,
      },
    },
    'light-electric': {
      primary: {
        primaryColor: brandColor,
        primaryColorHover: hoverColorDarken,
        baseColor: darkThemeBaseColor,
      },
      secondary: {
        primaryColor: contrastHighColor,
        primaryColorHover: contrastHighColorDarken,
        baseColor: darkThemeBaseColor,
      },
      tertiary: {
        primaryColor: contrastHighColor,
        primaryColorHover: contrastHighColorDarken,
        baseColor,
      },
    },
  };

  return colors[theme][variant];
};

const linkButtonPadding = `${pxToRemWithUnit(11)} ${pxToRemWithUnit(15)} ${pxToRemWithUnit(11)} ${pxToRemWithUnit(39)}`;

export const getRootStyle: GetStyleFunction = (hideLabel: boolean): JssStyle => {
  return {
    padding: hideLabel ? 0 : linkButtonPadding,
  };
};

export const getIconStyle: GetStyleFunction = (hideLabel: boolean): JssStyle => {
  return hideLabel
    ? {
        left: '50%',
        top: '50%',
        transform: 'translate3d(-50%, -50%, 0)',
      }
    : {
        left: pxToRemWithUnit(11),
        top: pxToRemWithUnit(11),
        transform: 'translate3d(0,0,0)',
      };
};

export const getLabelStyle: GetStyleFunction = (hideLabel: boolean): JssStyle => {
  return hideLabel
    ? {
        width: 1,
        height: 1,
        margin: '0 0 0 -1px',
        overflow: 'hidden',
        textIndent: -1,
      }
    : {
        width: '100%',
        height: 'auto',
        margin: 0,
        overflow: 'visible',
        textIndent: 0,
      };
};

export const getSlottedLinkStyle: GetStyleFunction = (hideLabel: boolean): JssStyle => {
  return hideLabel
    ? {
        position: 'absolute',
        ...getInsetStyle(),
        padding: 0,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textIndent: '99999px',
      }
    : {
        position: 'static',
        ...getInsetStyle('auto'),
        padding: linkButtonPadding,
        overflow: 'visible',
        whiteSpace: 'normal',
        textIndent: 0,
      };
};

export const getLinkButtonStyles = (
  variant: LinkButtonVariant,
  hideLabel: BreakpointCustomizable<boolean>,
  isDisabledOrLoading: boolean,
  hasSlottedAnchor: boolean,
  theme: ThemeExtendedElectric
): Styles => {
  const isDarkTheme = isThemeDark(theme);
  const isTertiary = variant === 'tertiary';
  const { primaryColor, primaryColorHover, baseColor } = getVariantColors(variant, theme);
  const { disabledColor } = getThemedColors(theme);
  const iconLabelColor = isDisabledOrLoading ? (isTertiary ? disabledColor : 'rgba(255,255,255,0.55)') : baseColor;

  return {
    ':host': {
      display: 'inline-flex',
      verticalAlign: 'top',
      outline: addImportantToRule(0),
    },
    root: {
      display: 'flex',
      width: '100%',
      minWidth: pxToRemWithUnit(48),
      minHeight: pxToRemWithUnit(48),
      position: 'relative',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      outline: 'transparent none',
      appearance: 'none',
      cursor: isDisabledOrLoading ? 'not-allowed' : 'pointer',
      textDecoration: 'none',
      textAlign: 'left',
      border: '1px solid currentColor',
      backgroundColor: isTertiary ? 'transparent' : 'currentColor',
      color: isDisabledOrLoading ? disabledColor : primaryColor,
      transition: ['background-color', 'border-color', 'color'].map(getTransition).join(','),
      ...(!hasSlottedAnchor && {
        ...buildResponsiveStyle(hideLabel, getRootStyle),
        ...getFocusStyle(),
      }),
      ...(!isDisabledOrLoading && {
        '&:hover, &:active': {
          color: primaryColorHover,
          ...(isTertiary && {
            backgroundColor: 'currentColor',
            '& $label, & $icon': {
              color: isDarkTheme ? lightThemeBaseColor : darkThemeBaseColor,
            },
          }),
        },
      }),
    },
    icon: {
      position: 'absolute',
      width: pxToRemWithUnit(24),
      height: pxToRemWithUnit(24),
      color: iconLabelColor,
      pointerEvents: 'none',
      ...buildResponsiveStyle(hideLabel, getIconStyle),
    },
    label: {
      display: 'block',
      boxSizing: 'border-box',
      color: iconLabelColor,
      ...buildResponsiveStyle(hideLabel, getLabelStyle),
    },
    ...(hasSlottedAnchor && {
      '::slotted': addImportantToEachRule({
        '&(a)': {
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          lineHeight: 'inherit',
          outline: 'transparent solid 1px',
          outlineOffset: '3px',
          ...buildResponsiveStyle(hideLabel, getSlottedLinkStyle),
        },
        '&(a::-moz-focus-inner)': {
          border: 0,
        },
        '&(a:focus)': {
          outlineColor: primaryColor,
        },
        '&(a:hover:focus)': {
          outlineColor: primaryColorHover,
        },
        '&(a:focus:not(:focus-visible))': {
          outlineColor: 'transparent',
        },
      }),
    }),
  };
};
