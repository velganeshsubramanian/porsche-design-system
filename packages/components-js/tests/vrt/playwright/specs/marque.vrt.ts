import { expect, type Page, test } from '@playwright/test';
import {
  baseViewportWidth,
  forceFocusHoverState,
  forceFocusState,
  getBodyMarkup,
  type GetMarkup,
  type PrefersColorScheme,
  setContentWithDesignSystem,
} from '../helpers';
import { type Theme } from '@porsche-design-system/utilities-v2';

const component = 'marque';

const scenario = async (page: Page, theme: Theme, scheme?: PrefersColorScheme): Promise<void> => {
  const head = `
    <style>
      p-marque:not(:last-child) { margin-right: 0.5rem; }
    </style>`;

  const getElementsMarkup: GetMarkup = () => `
    <p-marque href="https://www.porsche.com"></p-marque>
    <p-marque href="https://www.porsche.com" style="padding: 1rem"></p-marque>`;

  await setContentWithDesignSystem(page, getBodyMarkup(getElementsMarkup), {
    injectIntoHead: head,
    forceComponentTheme: theme,
    prefersColorScheme: scheme,
  });

  await forceFocusState(page, '.focus p-marque'); // native outline should not be visible
  await forceFocusState(page, '.focus p-marque >>> a');
  await forceFocusHoverState(page, '.focus-hover p-marque >>> a');
};

// executed in Chrome only
test.describe(component, async () => {
  test.skip(({ browserName }) => browserName !== 'chromium');

  test(`should have no visual regression for :hover + :focus-visible with theme light`, async ({ page }) => {
    await scenario(page, undefined);
    await expect(page.locator('#app')).toHaveScreenshot(`${component}-${baseViewportWidth}-states-theme-light.png`);
  });
});
