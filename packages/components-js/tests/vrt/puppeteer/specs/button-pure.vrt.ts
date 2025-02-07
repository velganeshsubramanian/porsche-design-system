import {
  forceFocusHoverState,
  forceFocusState,
  forceHoverState,
  getThemedBodyMarkup,
  GetThemedMarkup,
  setContentWithDesignSystem,
} from '../helpers';
import {
  defaultViewports,
  getVisualRegressionStatesTester,
  getVisualRegressionTester,
  vrtTest,
} from '@porsche-design-system/shared/testing';

it.each(defaultViewports)('should have no visual regression for viewport %s', async (viewport) => {
  expect(await vrtTest(getVisualRegressionTester(viewport), 'button-pure', '/#button-pure')).toBeFalsy();
});

it('should have no visual regression for :hover + :focus-visible', async () => {
  const vrt = getVisualRegressionStatesTester();
  expect(
    await vrt.test('button-pure-states', async () => {
      const page = vrt.getPage();

      const head = `<style>
        body { display: grid; grid-template-columns: repeat(2, 50%); }
        p-button-pure:not(:last-child) { margin-right: 16px; }
        div div:not(:first-of-type) { margin-top: 16px; }
      </style>`;

      const getElementsMarkup: GetThemedMarkup = (theme) => `
        <div>
          <p-button-pure theme="${theme}">Label default</p-button-pure>
          <p-button-pure theme="${theme}" loading="true">Label loading</p-button-pure>
        </div>
        <div>
          <p-button-pure theme="${theme}" align-label="left">Label align left</p-button-pure>
          <p-button-pure theme="${theme}" align-label="left" icon="logo-delicious">Label align left</p-button-pure>
        </div>
        <div>
          <p-button-pure theme="${theme}" hide-label="true">Without label</p-button-pure>
        </div>
        <div>
          <p-button-pure theme="${theme}" active="true">Label active</p-button-pure>
        </div>
        <div>
          <p-button-pure theme="${theme}" icon="none">Label icon none</p-button-pure>
        </div>
        <div>
          <p-button-pure theme="${theme}" style="padding: 1rem">Label with custom click-area</p-button-pure>
          <p-button-pure theme="${theme}" hide-label="true" style="padding: 1rem">Label with custom click-area</p-button-pure>
        </div>
        <div>
          <p-button-pure theme="${theme}" stretch="true">Label stretch</p-button-pure>
        </div>
        <div>
          <p-button-pure theme="${theme}" align-label="left" stretch="true">Label stretch align left</p-button-pure>
        </div>`;

      await setContentWithDesignSystem(page, getThemedBodyMarkup(getElementsMarkup), {
        injectIntoHead: head,
      });

      await forceHoverState(page, '.hover p-button-pure >>> button');
      await forceFocusState(page, '.focus p-button-pure'); // native outline should not be visible
      await forceFocusState(page, '.focus p-button-pure >>> button');
      await forceFocusHoverState(page, '.focus-hover p-button-pure >>> button');
    })
  ).toBeFalsy();
});
