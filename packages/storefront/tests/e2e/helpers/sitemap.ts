import { baseURL } from './index';
import * as fs from 'fs';
import * as path from 'path';
import { Page } from '@playwright/test';

// exclude URLS which should not be checked -> include all links which lead to downloads because puppeteer cant handle that
const whitelistedUrls: string[] = [
  'https://github.com/porsche-design-system/porsche-design-system',
  'https://cdn.ui.porsche.com/porsche-design-system/font/v1/Porsche_Next_WebOTF_Lat-Gr-Cyr.zip',
  'https://sitepoint.com/introduction-wai-aria/',
  'https://adabook.com/',
  'https://etsi.org/deliver/etsi_en/301500_301599/301549/02.01.02_60/en_301549v020102p.pdf',
];

const console = require('console'); // workaround for nicer logs

const sitemapFixturePath = path.resolve(__dirname, '../fixtures/sitemap.json');
const sitemapResultPath = path.resolve(__dirname, '../results/sitemap.json');

export const getSitemap = (): string[] => {
  // read fixture/sitemap.json
  const fileContent = fs.readFileSync(sitemapFixturePath, 'utf8');
  return JSON.parse(fileContent);
};

export const getInternalUrls = (): string[] => {
  return (
    getSitemap()
      .filter((link) => link.startsWith('/'))
      // drop "base" links that are redirected to first tab
      .filter((link, i, array) => !array.some((x) => x.startsWith(link + '/')))
  );
};

export const getExternalUrls = (): string[] => {
  return getSitemap().filter((link) => !link.startsWith('/'));
};

export const buildSitemap = async (page: Page): Promise<string[]> => {
  console.log('Building sitemap...');
  fs.mkdirSync(path.dirname(sitemapResultPath), { recursive: true });

  await page.goto(baseURL);

  // initial scan on front page without duplicates
  let allUrls = (await scanForUrls(page)).filter((x, i, array) => array.indexOf(x) === i);

  for (let i = 0; i < allUrls.length; i++) {
    const href = allUrls[i];

    // follow internal urls only
    if (href.startsWith('/')) {
      console.log(`Crawling url ${i + 1}/${allUrls.length}...`);
      await page.goto(`${baseURL}${href}`);

      const newLinks = await scanForUrls(page);
      // get rid of duplicates
      allUrls = allUrls.concat(newLinks).filter((x, i, array) => array.indexOf(x) === i);
    }
  }

  // filter out porsche design system pull request urls, otherwise we'd need to re-run CI all the time
  allUrls = allUrls
    .sort()
    .filter((link) => !link.startsWith('https://github.com/porsche-design-system/porsche-design-system/pull/'));
  const internalUrls = allUrls.filter((link) => link.startsWith('/'));
  const externalUrls = allUrls.filter((link) => !link.startsWith('/'));

  console.log(`Finished building sitemap.json with only ${allUrls.length} urls`);
  console.log(`– Internal urls: ${internalUrls.length}`);
  console.log(`– External urls: ${externalUrls.length}`);

  // write results/sitemap.json
  // we only care about internalUrls, since we do nothing with external ones and they just cause an additional CI run when extending the changelog
  fs.writeFileSync(sitemapResultPath, JSON.stringify(allUrls, null, 2));
  return allUrls;
};

const mapAsync = <T, U>(array: T[], callbackFn: (value: T, index: number, array: T[]) => Promise<U>): Promise<U[]> =>
  Promise.all(array.map(callbackFn));

const filterAsync = async <T>(
  array: T[],
  callbackFn: (value: T, index: number, array: T[]) => Promise<boolean>
): Promise<T[]> => {
  const filterMap = await mapAsync(array, callbackFn);
  return array.filter((value, index) => filterMap[index]);
};

const scanForUrls = async (page: Page): Promise<string[]> => {
  const bodyLinks = await page.locator('body [href]').all();

  // get rid of toc links since anchor links lead to the same page they where found on
  const bodyLinksWithoutToc = await filterAsync(bodyLinks, async (link) => {
    return (await link.evaluate((x) => x.parentElement?.parentElement?.className)) !== 'toc';
  });

  const bodyHrefs: string[] = await mapAsync(bodyLinksWithoutToc, (link) => link.getAttribute('href'));

  return bodyHrefs
    .map((url) => (!url.startsWith('http') && !url.startsWith('/') ? `/${url}` : url)) // add leading slash for links within markdown
    .filter((url) => !whitelistedUrls.includes(url)) // get rid of whitelisted urls
    .filter((url) => (url.startsWith('/') ? !url.includes('#') : true)); // get rid of internal anchor links
};
