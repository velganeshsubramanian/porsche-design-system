import { expect, type Page, test } from '@playwright/test';
import {
  baseThemes,
  openAllSelectWrapper,
  setNativePopoversToAllowMultipleOpen,
  setContentWithDesignSystem,
} from '../../helpers';
import { type Theme } from '@porsche-design-system/utilities-v2';

const component = 'select-wrapper';
const viewportWidth = 1760;

const scenario = async (page: Page, theme: Theme, withinTable: boolean = false): Promise<void> => {
  const getSelectWrapper = (direction: string): string => {
    return `<p-select-wrapper direction=${direction}>
      <select label="Direction ${direction}">
        <option value="a">Option A</option>
        <option value="b">Option B</option>
        <option value="c">Option C</option>
        <option value="d">Option D</option>
        <option value="e">Option E</option>
        <option value="f">Option F</option>
        <option value="g">Option G</option>
        <option value="h">Option H</option>
        <option value="i">Option I</option>
        <option value="j">Option J</option>
        <option value="k">Option K</option>
      </select>
    </p-select-wrapper>`;
  };

  const markup = () =>
    `<p-table caption="select wrapper" style="margin-top: 50vh">
      <p-table-head>
        <p-table-head-row>
          <p-table-head-cell
            style="position: relative; height: 800px; outline: 1rem solid rgba(0, 0, 255, 0.1); outline-offset: -1rem"
            class="playground"
          >${getSelectWrapper('down')}
          </p-table-head-cell>
        </p-table-head-row>
      </p-table-head>
    </p-table>
    <p-table caption="select wrapper" style="margin-top: 50vh">
      <p-table-head>
        <p-table-head-row>
          <p-table-head-cell
            style="position: relative; height: 800px; outline: 1rem solid rgba(0, 0, 255, 0.1); outline-offset: -1rem"
            class="playground"
          >${getSelectWrapper('up')}
          </p-table-head-cell>
        </p-table-head-row>
      </p-table-head>
    </p-table>
    <p-table caption="select wrapper" style="margin-top: 80vh">
      <p-table-head>
        <p-table-head-row>
          <p-table-head-cell
            style="position: relative; height: 800px; outline: 1rem solid rgba(0, 0, 255, 0.1); outline-offset: -1rem"
            class="playground"
          >${getSelectWrapper('auto')}
          </p-table-head-cell>
        </p-table-head-row>
      </p-table-head>
    </p-table>`;

  await setContentWithDesignSystem(page, markup(), { forceComponentTheme: theme });

  // Override listeners to avoid native popovers being closed
  await page.evaluate(() => {
    window.addEventListener('resize', (e) => e.stopImmediatePropagation(), true);
    window.addEventListener('scroll', (e) => e.stopImmediatePropagation(), true);
  });

  await page.setViewportSize({ width: viewportWidth, height: 1000 });
  await setNativePopoversToAllowMultipleOpen(page);
  await openAllSelectWrapper(page);
};

// executed in Chrome only
test.describe(component, async () => {
  test.skip(({ browserName }) => browserName !== 'chromium');

  baseThemes.forEach((theme) => {
    test(`should have no visual regression on select-wrapper within table component for viewport ${viewportWidth} with theme ${theme}`, async ({
      page,
    }) => {
      await scenario(page, theme, true);
      await expect(page.locator('#app')).toHaveScreenshot(
        `${component}-${viewportWidth}-overview-within-table-theme-${theme}.png`
      );
    });
  });
});
