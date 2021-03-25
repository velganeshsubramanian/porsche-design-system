import { JSX, Host, Component, Prop, h, Element, forceUpdate } from '@stencil/core';
import {
  getHTMLElementAndThrowIfUndefined,
  getPrefixedTagNames,
  getTagName,
  initAttributePropChangeListener,
  insertSlottedStyles,
  isLabelVisible,
  isMessageVisible,
  isRequired,
  mapBreakpointPropToPrefixedClasses,
  prefix,
  setAriaAttributes,
} from '../../../utils';
import type { BreakpointCustomizable, FormState } from '../../../types';

@Component({
  tag: 'p-checkbox-wrapper',
  styleUrl: 'checkbox-wrapper.scss',
  shadow: true,
})
export class CheckboxWrapper {
  @Element() public host!: HTMLElement;

  /** The label text. */
  @Prop() public label?: string = '';

  /** The validation state. */
  @Prop() public state?: FormState = 'none';

  /** The message styled depending on validation state. */
  @Prop() public message?: string = '';

  /** Show or hide label. For better accessibility it's recommended to show the label. */
  @Prop() public hideLabel?: BreakpointCustomizable<boolean> = false;

  private input: HTMLInputElement;

  public connectedCallback(): void {
    this.addSlottedStyles();
  }

  public componentWillLoad(): void {
    this.setInput();
    initAttributePropChangeListener(this.input, ['checked', 'indeterminate', 'disabled'], () => forceUpdate(this.host));
  }

  public componentDidLoad(): void {
    this.setAriaAttributes();
  }

  public componentDidUpdate(): void {
    this.setAriaAttributes();
  }

  public render(): JSX.Element {
    const { checked, indeterminate, disabled } = this.input;
    const labelClasses = prefix('checkbox-wrapper__label');
    const fakeCheckboxClasses = {
      [prefix('checkbox-wrapper__fake-checkbox')]: true,
      [prefix('checkbox-wrapper__fake-checkbox--checked')]: checked || indeterminate,
      [prefix('checkbox-wrapper__fake-checkbox--disabled')]: disabled,
      [prefix(`checkbox-wrapper__fake-checkbox--${this.state}`)]: this.state !== 'none',
    };
    const iconClasses = {
      [prefix('checkbox-wrapper__icon')]: true,
      [prefix('checkbox-wrapper__icon--checked')]: checked || indeterminate,
    };
    const labelTextClasses = {
      [prefix('checkbox-wrapper__label-text')]: true,
      [prefix('checkbox-wrapper__label-text--disabled')]: disabled,
      ...mapBreakpointPropToPrefixedClasses('checkbox-wrapper__label-text-', this.hideLabel, ['hidden', 'visible']),
    };
    const messageClasses = {
      [prefix('checkbox-wrapper__message')]: true,
      [prefix(`checkbox-wrapper__message--${this.state}`)]: this.state !== 'none',
    };

    const PrefixedTagNames = getPrefixedTagNames(this.host);

    return (
      <Host>
        <label class={labelClasses}>
          {isLabelVisible(this.host, this.label) && (
            <PrefixedTagNames.pText class={labelTextClasses} tag="span" color="inherit" onClick={this.labelClick}>
              {this.label || <slot name="label" />}
              {isRequired(this.input) && <span class={prefix('checkbox-wrapper__required')} />}
            </PrefixedTagNames.pText>
          )}
          <span class={fakeCheckboxClasses}>
            <PrefixedTagNames.pIcon
              class={iconClasses}
              name={indeterminate ? 'minus' : 'check'}
              theme="dark"
              size="inherit"
              aria-hidden="true"
            />
            <slot />
          </span>
        </label>
        {isMessageVisible(this.host, this.message, this.state) && (
          <PrefixedTagNames.pText class={messageClasses} color="inherit" role={this.state === 'error' ? 'alert' : null}>
            {this.message || <slot name="message" />}
          </PrefixedTagNames.pText>
        )}
      </Host>
    );
  }

  private setInput(): void {
    this.input = getHTMLElementAndThrowIfUndefined(this.host, 'input[type="checkbox"]');
  }

  /*
   * This is a workaround to improve accessibility because the input and the label/description/message text are placed in different DOM.
   * Referencing ID's from outside the component is impossible because the web component’s DOM is separate.
   * We have to wait for full support of the Accessibility Object Model (AOM) to provide the relationship between shadow DOM and slots
   */
  private setAriaAttributes(): void {
    setAriaAttributes(this.input, {
      label: this.label,
      message: this.message,
      state: this.state,
    });
  }

  private labelClick = (event: MouseEvent): void => {
    /**
     * we only want to simulate the checkbox click by label click
     * for real shadow dom, else the native behaviour works out of the box.
     * also we don't want to click to the input, if a link is clicked.
     */
    if (this.host.shadowRoot?.host && (event.target as HTMLElement).closest('a') === null) {
      this.input.focus();
      this.input.click();
    }
  };

  private addSlottedStyles(): void {
    const tagName = getTagName(this.host);
    const style = `${tagName} a {
      outline: none transparent !important;
      color: inherit !important;
      text-decoration: underline !important;
      -webkit-transition: color .24s ease !important;
      transition: color .24s ease !important;
      outline: transparent solid 1px !important;
      outline-offset: 1px !important;
    }

    ${tagName} a:hover {
      color: #d5001c !important;
    }

    ${tagName} a:focus {
      outline-color: currentColor !important;
    }

    ${tagName} a:focus:not(:focus-visible) {
      outline-color: transparent !important;
    }`;

    insertSlottedStyles(this.host, style);
  }
}
