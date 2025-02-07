<template>
  <div v-if="links.length > 1" class="toc">
    <p-heading size="medium" tag="h2">Table of Contents</p-heading>
    <ul>
      <li v-for="(link, index) in links" :key="index">
        <p-link-pure :href="link.href" :icon-source="returnIcon" v-on:click="onLinkClick(link, $event)">{{
          link.title
        }}</p-link-pure>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { paramCase } from 'change-case';
  import { componentsReady } from '@porsche-design-system/components-js';
  import { getAnchorLink } from '@/utils';

  type Link = { href: string; title: string };

  @Component
  export default class TableOfContents extends Vue {
    links: Link[] = [];
    returnIcon = require('../assets/icon-return.svg');

    mounted(): void {
      // cut off trailing `#` character
      const currentUrl = getAnchorLink('').slice(0, -1);

      this.links = Array.from<HTMLElement>(this.$el.parentElement!.parentElement!.querySelectorAll('h2')).map((h2) => {
        const { innerText } = h2;
        const id = paramCase(innerText);
        const href = currentUrl + '#' + id;

        // add anchor link to headline
        const link = document.createElement('p-link-pure');
        /* eslint-disable @typescript-eslint/no-explicit-any */
        (link as any).size = 'inherit';
        (link as any).innerText = '#';
        (link as any).title = 'Link to this heading';
        (link as any).icon = 'none';
        (link as any).href = encodeURI(href);
        /* eslint-enable */
        link.addEventListener('click', (e) => {
          this.onLinkClick({ title: '', href }, e);
        });

        h2.append(link);
        h2.id = id;
        // enable programmatic focusing, so that keyboard users don't break flow when using TOC
        h2.tabIndex = -1;

        return {
          href,
          title: innerText,
        };
      });

      componentsReady().then(this.scrollToAnchorLink);
    }

    private scrollToAnchorLink(): void {
      const { hash } = window.location;

      if (hash) {
        const headline = this.$el.parentElement!.parentElement!.querySelector(hash) as HTMLElement;

        window.scrollTo({
          top: headline.offsetTop,
          behavior: window.matchMedia('(prefers-reduced-motion)').matches ? 'auto' : 'smooth',
        });
        headline.focus({ preventScroll: true });
      }
    }

    private onLinkClick(link: Link, e: MouseEvent): void {
      const { altKey, ctrlKey, metaKey, shiftKey } = e;
      if (metaKey || altKey || ctrlKey || shiftKey) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      window.history.pushState(null, '', link.href);
      this.scrollToAnchorLink();
    }
  }
</script>

<style scoped lang="scss">
  .toc {
    margin-top: 4rem;
  }

  p-heading {
    margin-bottom: 1rem;
  }

  li {
    list-style: none;
  }
</style>
