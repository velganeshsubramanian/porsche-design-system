import { devDependencies, dependencies } from '../../../../components-vue/package.json';
import { getExternalDependencies, getSharedImportConstants, removeSharedImport } from './helper';
import { convertMarkup } from '../../utils/formatting';
import type {
  DependencyMap,
  GetStackBlitzProjectAndOpenOptions,
  SharedImportKey,
  ExternalDependency,
} from '../../utils';
import type { PlaygroundDir, StackBlitzProjectDependencies } from '../../models';
import { initialStyles } from '@/lib/partialResults';

const componentNameRegex = /(export const )[a-zA-Z]+( = \(({[^}]+})?\): JSX.Element => {)/;

// TODO: this entire puzzle should be refactored into an object-oriented way so that there is a clear and clean structure
// as well as code flow, similar to our WrapperGenerator

export const replaceSharedImportsWithConstants = (markup: string, sharedImportKeys: SharedImportKey[]): string => {
  const sharedImportConstants = getSharedImportConstants(sharedImportKeys);

  return removeSharedImport(markup.replace(componentNameRegex, `${sharedImportConstants}$1App$2`));
};

export const extendMarkupWithAppComponent = (markup: string): string => {
  const convertedMarkup = convertMarkup(markup, 'vue').replace(/(\n)/g, '$1    ');
  const vueComponentsToImport = Array.from(convertedMarkup.matchAll(/<(P[a-zA-Z]+)/g)) // Returns array of all matches and captured groups
    .map(([, vueComponentName]) => vueComponentName)
    .filter((vueComponentName, idx, arr) => arr.findIndex((t) => t === vueComponentName) === idx) // Remove duplicates
    .join(', ');

  return `<script setup lang="ts">
  import { PorscheDesignSystemProvider, ${vueComponentsToImport} } from '@porsche-design-system/components-vue';
</script>

<template>
  <PorscheDesignSystemProvider>
    ${convertedMarkup}
  </PorscheDesignSystemProvider>
</template>
`;
};

export const getAppTsx = (
  markup: string,
  isExampleMarkup: boolean,
  sharedImportKeys: SharedImportKey[],
  pdsVersion: string // eslint-disable-line @typescript-eslint/no-unused-vars
): string => {
  const finalMarkup = isExampleMarkup
    ? replaceSharedImportsWithConstants(markup, sharedImportKeys)
    : extendMarkupWithAppComponent(markup);

  // local bundle isn't supported because of missing COOP/COEP headers
  // return convertImportPaths(finalMarkup, 'vue', pdsVersion);
  return finalMarkup;
};

export const getIndexHtml = (dir: PlaygroundDir, globalStyles: string) => {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Porsche Design System - Vue</title>

    <!-- prettier-ignore -->
    ${initialStyles}

    <style>
      html, body { margin: 0; padding: 0; }
      ${globalStyles}
    </style>
  </head>
  <body dir="${dir}">
    <div id="root"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`;
};

export const getMainTs = (): string => {
  return `import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.mount('#root');
`;
};

export const dependencyMap: Partial<DependencyMap<typeof dependencies>> = {
  imask: {
    'vue-imask': dependencies['vue-imask'],
  },
};

export const getDependencies = (
  externalDependencies: ExternalDependency[],
  pdsVersion: string
): StackBlitzProjectDependencies => {
  return {
    // local bundle isn't supported because of missing COOP/COEP headers
    // ...(isStableStorefrontReleaseOrForcedPdsVersion(pdsVersion) && {
    '@porsche-design-system/components-vue': pdsVersion || dependencies['@porsche-design-system/components-vue'],
    // }),
    vue: dependencies['vue'],
    ...getExternalDependencies(externalDependencies, dependencyMap),
  };
};

export const getVueProjectAndOpenOptions: GetStackBlitzProjectAndOpenOptions = (opts) => {
  const {
    markup,
    dir,
    description,
    title,
    globalStyles,
    sharedImportKeys,
    externalDependencies,
    // porscheDesignSystemBundle,
    pdsVersion,
  } = opts;

  // docs: https://developer.stackblitz.com/platform/webcontainers/project-config
  return {
    files: {
      // currently, requests from local CDN (localhost:3001) are blocked by webcontainers
      // because of missing COOP/COEP headers
      // https://webcontainers.io/guides/configuring-headers
      // therefore local bundle is not supported
      // ...porscheDesignSystemBundle,
      'src/App.vue': getAppTsx(markup, !!markup.match(componentNameRegex), sharedImportKeys, pdsVersion),
      'src/main.ts': getMainTs(),
      'index.html': getIndexHtml(dir, globalStyles),
      'style.css': '', // empty file seems to be required
      'vite.config.ts': `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
})
`,
      'package.json': `{
  "name": "porsche-design-system-vue",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "stackblitz": {
    "installDependencies": false,
    "startCommand": "yarn && yarn dev"
  },
  "dependencies": ${JSON.stringify(getDependencies(externalDependencies, pdsVersion))},
  "devDependencies": ${JSON.stringify({
    '@vitejs/plugin-vue': devDependencies['@vitejs/plugin-vue'],
    '@vitejs/plugin-vue-jsx': devDependencies['@vitejs/plugin-vue-jsx'],
    typescript: devDependencies['typescript'],
    vite: devDependencies['vite'],
    'vue-tsc': devDependencies['vue-tsc'],
  })}
}
`,
    },
    template: 'node',
    title,
    description,
    openFile: 'src/App.vue',
  };
};
