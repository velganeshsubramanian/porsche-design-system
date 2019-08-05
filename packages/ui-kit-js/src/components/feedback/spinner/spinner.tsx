import { JSX, Component, Prop, h } from '@stencil/core';
import cx from 'classnames';
import { prefix } from '../../../utils/prefix';

@Component({
  tag: 'p-spinner',
  styleUrl: 'spinner.scss',
  shadow: true
})
export class Loader {
  /** Predefined spinner sizes. */
  @Prop() public size?: 'x-small' | 'small' | 'medium' | 'large' = 'small';

  /** Adapts the spinner color when used on dark background. */
  @Prop() public theme?: 'light' | 'dark' = 'light';

  /** A visually hidden aria-label text to improve accessibility which describes the function behind the loader. */
  @Prop() public allyLabel?: string = undefined;

  public render(): JSX.Element {
    const spinnerClasses = cx(
      prefix('spinner'),
      prefix(`spinner--${this.size}`),
      this.theme === 'dark' && prefix('spinner--theme-dark')
    );
    const imageClasses = prefix('spinner__image');
    const bgClasses = prefix('spinner__bg');
    const fgClasses = prefix('spinner__fg');

    return (
      <span class={spinnerClasses} aria-busy='true' aria-live='polite' aria-label={this.allyLabel}>
        <svg class={imageClasses} viewBox='0 0 48 48' role='img'>
          <circle class={bgClasses} cx='50%' cy='50%' r='21' />
          <circle class={fgClasses} cx='50%' cy='50%' r='21' />
        </svg>
      </span>
    );
  }
}
