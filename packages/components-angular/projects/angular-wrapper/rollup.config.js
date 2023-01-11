import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import generatePackageJson from 'rollup-plugin-generate-package-json';

const rootDir = '../..';
const projectDir = 'projects/angular-wrapper';
const outputDir = 'dist/angular-wrapper';

const typescriptOpts = {
  tsconfig: `${projectDir}/tsconfig.json`,
};

const external = [
  '@porsche-design-system/components-js',
  '@porsche-design-system/components-js/jsdom-polyfill',
  '@porsche-design-system/components-js/partials',
  '@porsche-design-system/components-js/utilities/js',
];

// identical with rollup.config.js from components-vue
// 1 input, 2 output formats
// typings are generated via separate tsc command since @rollup/plugin-typescript can't handle it properly
const buildConfig = (packagePath) => {
  const relativePackagePath = packagePath.split('/').pop();

  return {
    input: `${projectDir}/src/${packagePath}.ts`,
    external,
    output: [
      {
        dir: `${outputDir}/${packagePath}`,
        format: 'cjs',
        plugins: [
          generatePackageJson({
            baseContents: {
              main: `${relativePackagePath}.js`,
              module: `esm/${relativePackagePath}.js`,
              types: `${relativePackagePath}.d.ts`,
              sideEffects: false,
            },
          }),
        ],
      },
      {
        dir: `${outputDir}/${packagePath}/esm`,
        format: 'esm',
      },
    ],
    plugins: [
      // TODO: only copy stuff once when needed instead of twice (= for each sub package)
      copy({
        targets: [
          {
            src: `${projectDir}/src/utilities/scss.scss`,
            dest: `${outputDir}/utilities`,
          },
          // TODO: stop copying unrelated files into the root of the package when bundling sub packages
          { src: `${rootDir}/LICENSE`, dest: outputDir },
          { src: `${rootDir}/OSS_NOTICE`, dest: outputDir },
          { src: `${rootDir}/packages/components/CHANGELOG.md`, dest: outputDir },
        ],
      }),
      typescript(typescriptOpts),
    ],
  };
};

export default [
  ...['partials', 'utilities/js'].map(buildConfig),
  {
    input: `${projectDir}/src/jsdom-polyfill.ts`,
    external,
    output: {
      file: `${outputDir}/jsdom-polyfill/index.js`,
      format: 'cjs',
    },
    plugins: [typescript(typescriptOpts)],
  },
];
