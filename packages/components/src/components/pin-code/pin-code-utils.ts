import type { FormState } from '../../utils/form/form-state';
import type { Styles } from 'jss';
import { consoleWarn, getTagNameWithoutPrefix, setAttributes } from '../../utils';

export const PIN_CODE_TYPES = ['number', 'password'] as const;
export type PinCodeType = (typeof PIN_CODE_TYPES)[number];

export const PIN_CODE_LENGTHS = [4 as number, 6 as number] as const;
export type PinCodeLength = (typeof PIN_CODE_LENGTHS)[number];

export type PinCodeUpdateEvent = { value: string[] };

export type PinCodeState = FormState;

export const removeSlottedSelector = (styles: Styles): Styles => {
  return Object.fromEntries(
    Object.entries(styles).map(([key, value]) => {
      value = typeof value === 'object' ? removeSlottedSelector(value as Styles) : value;
      return [key.replace(/::slotted\(([^,]+)\)/g, '$1'), value];
    }, {} as Styles)
  );
};

export const warnAboutTransformedInitialValue = (host: HTMLElement, length?: number): void => {
  const warningPrefix = `Property value on component ${getTagNameWithoutPrefix(host)}:`;
  consoleWarn(
    warningPrefix,
    length
      ? `Provided value has too many characters and was truncated to the max length of ${length}.`
      : 'Provided value contains characters that are not of type number, the value was therefore reset.'
  );
};

export const isInputSingleDigit = (input: string): boolean => /^\d$/.test(input);

export const hasInputOnlyDigits = (input: string): boolean => /^\d+$/.test(input);

export const getArrayOfInputValues = (pinCodeElements: HTMLInputElement[]): string[] =>
  pinCodeElements.map((el) => el.value);

// remove whitespaces and cut string if pasted value is longer than pin code length
export const getSanitizationValue = (value: string, length: number): string =>
  value.replace(/\s/g, '').slice(0, length);

export const initHiddenInput = (
  host: HTMLElement,
  name: string,
  value: string,
  disabled: boolean,
  required: boolean
): HTMLInputElement => {
  const hiddenInput = document.createElement('input');
  setAttributes(hiddenInput, {
    'aria-hidden': 'true',
    slot: 'hidden-input',
    tabindex: '-1',
  });
  syncHiddenInput(hiddenInput, name, value, disabled, required);
  host.prepend(hiddenInput);
  return hiddenInput;
};

export const syncHiddenInput = (
  hiddenInput: HTMLInputElement,
  name: string,
  value: string,
  disabled: boolean,
  required: boolean
): void => {
  setAttributes(hiddenInput, {
    name: name,
    value: value,
  });
  hiddenInput.toggleAttribute('disabled', disabled);
  hiddenInput.toggleAttribute('required', required);
};
