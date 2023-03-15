import * as getNamedSlotUtils from '../getNamedSlot';
import { getNamedSlotOrThrow } from './getNamedSlotOrThrow';

it('should call getNamedSlot() with correct parameters', () => {
  const spy = jest.spyOn(getNamedSlotUtils, 'getNamedSlot').mockReturnValue(document.createElement('a'));
  const host = document.createElement('div');
  const slotName = 'slot';

  getNamedSlotOrThrow(host, slotName);

  expect(spy).toBeCalledWith(host, slotName);
});

it('should throw error if there is no named slot', () => {
  const host = document.createElement('div');
  const slotName = 'slot';

  expect(() => getNamedSlotOrThrow(host, slotName)).toThrowErrorMatchingInlineSnapshot(
    `"Named slot 'slot' is missing on element div"`
  );
});

it('should return result of getNamedSlot()', () => {
  const mockedEl = document.createElement('button');
  jest.spyOn(getNamedSlotUtils, 'getNamedSlot').mockReturnValue(mockedEl);
  const host = document.createElement('div');

  expect(getNamedSlotOrThrow(host, 'slot')).toBe(mockedEl);
});
