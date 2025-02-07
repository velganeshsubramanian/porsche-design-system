import * as fs from 'fs';
import * as path from 'path';
import * as globby from 'globby';
import { npmDistTmpSubPath } from '../projects/components-wrapper/environment';

const packageDir = path.resolve(__dirname, '..');

// TODO: this should happen during webpack build via define plugin
const readAndWriteFile = (targetFile: string): void => {
  const oldContent = fs.readFileSync(targetFile, 'utf8');
  const [, documentKey] = oldContent.match(/,document\[([a-z])]\.cdn=/) || [];
  const newContent = oldContent.replace(
    '"%%%CDN_BASE_URL_DYNAMIC%%%',
    `document${documentKey ? '[' + documentKey + ']' : '.porscheDesignSystem'}.cdn+"`
  );
  fs.writeFileSync(targetFile, newContent);

  console.log(`Updated: ${targetFile.replace(packageDir, '.')}`);
};

const replaceCdnBaseUrlDynamicPlaceholder = () => {
  const componentsJsUmdFilePath = require.resolve('@porsche-design-system/components-js');
  const componentsJsEsmFilePath = path.resolve(componentsJsUmdFilePath, '../esm/index.js');
  const packageDir = path.resolve(path.dirname(componentsJsUmdFilePath), '../..');
  const componentsJsIifeFilePath = path.resolve(
    path.dirname(componentsJsUmdFilePath),
    '../..',
    npmDistTmpSubPath,
    'index.js'
  );

  [
    componentsJsUmdFilePath, // core loader umd build
    componentsJsEsmFilePath, // core loader esm build
    componentsJsIifeFilePath, // temporary core loader used for getLoaderScript partial
    path.resolve(packageDir, globby.sync('./dist/components/porsche-design-system.v*')[0]), // core chunk on cdn
  ].forEach(readAndWriteFile);

  console.log(`Replaced: "%%%CDN_BASE_URL_DYNAMIC%%%" –> "document.porscheDesignSystem.cdn"`);
};

replaceCdnBaseUrlDynamicPlaceholder();
