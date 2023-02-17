import { getMediaQueryMin } from '../mediaQuery';
import { gridGap } from './gridGap';
import { gridWidthMin } from './gridWidthMin';
import { gridWidthMax } from './gridWidthMax';
import { gridSafeZoneBase } from './gridSafeZoneBase';
import { gridSafeZoneXXL } from './gridSafeZoneXXL';
import { gridFullColumnStart } from './gridFullColumnStart';
import { gridExtendedColumnStart } from './gridExtendedColumnStart';
import { gridBasicColumnStart } from './gridBasicColumnStart';
import { gridNarrowColumnStart } from './gridNarrowColumnStart';
import { gridNarrowColumnEnd } from './gridNarrowColumnEnd';
import { gridBasicColumnEnd } from './gridBasicColumnEnd';
import { gridExtendedColumnEnd } from './gridExtendedColumnEnd';
import { gridFullColumnEnd } from './gridFullColumnEnd';
import {
  _cssVariableGridBasicSpanOneHalf,
  _cssVariableGridBasicSpanOneThird,
  _cssVariableGridBasicSpanTwoThirds,
  _cssVariableGridExtendedSpanOneHalf,
  _cssVariableGridNarrowSpanOneHalf,
  _cssVariableGridSafeZone,
} from './gridShared';

const outerColumn = `minmax(0, calc(var(${_cssVariableGridSafeZone}) - ${gridGap}))`;
const column = 'minmax(0, 1fr)';
const getColumns = (repeat: number): string => (repeat > 1 ? `repeat(${repeat}, ${column})` : column);
const getColumnSpan = (span: number): string => `span ${span}`;
const getGridTemplateColumns = (layout: 'mobile' | 'desktop') =>
  layout === 'mobile'
    ? `[${gridFullColumnStart}] ${outerColumn} [${gridExtendedColumnStart} ${gridBasicColumnStart} ${gridNarrowColumnStart}] ${getColumns(
        6
      )} [${gridNarrowColumnEnd} ${gridBasicColumnEnd} ${gridExtendedColumnEnd}] ${outerColumn} [${gridFullColumnEnd}]`
    : `[${gridFullColumnStart}] ${outerColumn} [${gridExtendedColumnStart}] ${getColumns(
        1
      )} [${gridBasicColumnStart}] ${getColumns(2)} [${gridNarrowColumnStart}] ${getColumns(
        8
      )} [${gridNarrowColumnEnd}] ${getColumns(2)} [${gridBasicColumnEnd}] ${getColumns(
        1
      )} [${gridExtendedColumnEnd}] ${outerColumn} [${gridFullColumnEnd}]`;

export const gridStyle = {
  [_cssVariableGridSafeZone]: gridSafeZoneBase,
  [_cssVariableGridExtendedSpanOneHalf]: getColumnSpan(3),
  [_cssVariableGridBasicSpanOneHalf]: getColumnSpan(3),
  [_cssVariableGridBasicSpanOneThird]: getColumnSpan(2),
  [_cssVariableGridBasicSpanTwoThirds]: getColumnSpan(4),
  [_cssVariableGridNarrowSpanOneHalf]: getColumnSpan(3),
  display: 'grid',
  gridGap,
  gridTemplateColumns: getGridTemplateColumns('mobile'),
  minWidth: gridWidthMin,
  maxWidth: gridWidthMax,
  margin: 0,
  padding: `0 calc(50% - ${gridWidthMax} / 2)`,
  boxSizing: 'content-box',
  [getMediaQueryMin('s')]: {
    [_cssVariableGridExtendedSpanOneHalf]: getColumnSpan(7),
    [_cssVariableGridBasicSpanOneHalf]: getColumnSpan(6),
    [_cssVariableGridBasicSpanOneThird]: getColumnSpan(4),
    [_cssVariableGridBasicSpanTwoThirds]: getColumnSpan(8),
    [_cssVariableGridNarrowSpanOneHalf]: getColumnSpan(4),
    gridTemplateColumns: getGridTemplateColumns('desktop'),
  },
  [getMediaQueryMin('xxl')]: {
    [_cssVariableGridSafeZone]: gridSafeZoneXXL,
  },
} as const;
