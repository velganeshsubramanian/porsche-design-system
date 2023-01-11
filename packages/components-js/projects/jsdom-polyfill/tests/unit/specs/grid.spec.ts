import { componentsReady } from '@porsche-design-system/components-js';

const getMarkup = (): string => {
  return `<p-grid>
  <p-grid-item size="6"></p-grid-item>
  <p-grid-item size="6"></p-grid-item>
</p-grid>`;
};

it('should have initialized shadow dom', async () => {
  document.body.innerHTML = getMarkup();
  expect(await componentsReady()).toBe(3);

  const els = document.body.querySelectorAll('*');
  expect(els.length).toBe(3);
  els.forEach((el) => {
    expect(el.shadowRoot).not.toBeNull();
    expect(el.className).toBe('hydrated');
  });
});
