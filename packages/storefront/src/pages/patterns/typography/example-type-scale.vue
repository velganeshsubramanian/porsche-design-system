<template>
  <div class="main-app">
    <div class="type-scale">
      <p-headline ref="largeTitle" variant="large-title">{{ dummyHeading }}</p-headline>
      <p-headline ref="headline1" variant="headline-1">{{ dummyHeading }}verhaftet.</p-headline>
      <p-headline ref="headline2" variant="headline-2">{{ dummyHeading }}</p-headline>
      <p-headline ref="headline3" variant="headline-3">{{ dummyHeading }}</p-headline>
      <p-headline ref="headline4" variant="headline-4">{{ dummyHeading }}</p-headline>
      <p-headline ref="headline5" variant="headline-5">{{ dummyHeading }}</p-headline>
      <p-headline ref="headlineInherit" variant="inherit" style="font-size: 50px">{{ dummyHeading }}</p-headline>

      <p-text ref="textXSmall" size="x-small">{{ dummyText }}</p-text>
      <p-text ref="textSmall" size="small">{{ dummyText }}</p-text>
      <p-text ref="textMedium" size="medium">{{ dummyText }}</p-text>
      <p-text ref="textLarge" size="large">{{ dummyText }}</p-text>
      <p-text ref="textXLarge" size="x-large">{{ dummyText }}</p-text>
      <p-text ref="textInherit" size="inherit" style="font-size: 50px">{{ dummyText }}</p-text>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { componentsReady } from '@porsche-design-system/components-js';

  @Component
  export default class ExampleTypeScale extends Vue {
    public dummyHeading =
      'Jemand musste Josef K. verleumdet haben, denn ohne dass er etwas Böses getan hätte, wurde er eines Morgens verhaftet.';
    public dummyText =
      'Jemand musste Josef K. verleumdet haben, denn ohne dass er etwas Böses getan hätte, wurde er eines Morgens verhaftet. »Wie ein Hund!« sagte er, es war, als sollte die Scham ihn überleben. Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem ungeheueren Ungeziefer verwandelt.';

    async mounted(): Promise<void> {
      await componentsReady();
      this.setTypeScaleInfoOnRefs();
      window.addEventListener('resize', this.setTypeScaleInfoOnRefs);
    }

    unmounted() {
      window.removeEventListener('resize', this.setTypeScaleInfoOnRefs);
    }

    private setTypeScaleInfoOnRefs(): void {
      for (const host of Object.values(this.$refs)) {
        const el = (host as HTMLElement).shadowRoot?.lastElementChild as HTMLElement;
        const { fontSize, lineHeight } = window.getComputedStyle(el);

        (host as HTMLElement)?.setAttribute('data-font-size', fontSize);
        (host as HTMLElement)?.setAttribute('data-line-height', lineHeight);
        (host as HTMLElement)?.setAttribute('data-viewport-width', window.innerWidth + 'px');
      }
    }
  }
</script>

<style scoped lang="scss">
  @use '@porsche-design-system/components-js/styles' as *;

  .type-scale {
    @include pds-grid;
    > * {
      grid-column: 2 / span 14;
    }
    @include pds-media-query-min('l') {
      > :nth-child(odd) {
        grid-column: 2 / span 7;
      }
      > :nth-child(even) {
        grid-column: 9 / span 7;
      }
    }
  }

  p-headline,
  p-text {
    &::before {
      @include pds-text-x-small;
      display: block;
      content: 'p-headline - variant: "' attr(variant) '" | ' attr(data-font-size) '/' attr(data-line-height) ' | '
        attr(data-viewport-width) '';
      color: deeppink;
    }
  }

  p-text::before {
    content: 'p-text - size: "' attr(size) '" | ' attr(data-font-size) '/' attr(data-line-height) ' | '
      attr(data-viewport-width) '';
  }
</style>
