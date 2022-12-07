import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import { TAG_NAMES } from '@porsche-design-system/shared';
import { Framework } from '@porsche-design-system/storefront/src/models';
import { Browser } from 'puppeteer';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Document {
    // Extend Document interface, so we don't have to cast it on any
    porscheDesignSystem: { [key: string]: { prefixes: string[] } };
  }
}

// TODO: make headless before PR
const width = 1366;
const height = 768;
const tagNames = TAG_NAMES;
const reportFolderName = 'reports';

// TODO: define correct return types
const crawlComponents = async (page: puppeteer.Page): Promise<any> => {
  const porscheDesignSystem = await page.evaluate(async (tagNames): Promise<any> => {
    const porscheDesignSystem = document.porscheDesignSystem;
    const consumedPdsVersions = Object.keys(porscheDesignSystem);

    const consumedPrefixesForVersions: { [key: string]: string[] } = Object.entries(porscheDesignSystem).reduce(
      (result, [key, value]) => ({
        ...result,
        [key]: value.prefixes,
      }),
      {}
    );

    const consumedTagNamesForVersions: { [key: string]: string[] } = Object.entries(consumedPrefixesForVersions).reduce(
      (result, [version, prefixes]) => {
        const pdsComponentsSelector = prefixes
          .map((prefix) => {
            return prefix ? tagNames.map((tagName) => `${prefix}-${tagName}`) : tagNames;
          })
          .join();
        // TODO: get the set properties
        const pdsElements = Array.from(document.querySelectorAll(pdsComponentsSelector));
        // TODO: get and count the tag names with prefixes - and also without prefixes?
        const usedTagNames = pdsElements.map((el) => el.tagName.toLowerCase());

        return {
          ...result,
          [version]: usedTagNames,
        };
      },
      {}
    );

    return {
      consumedPdsVersions,
      consumedPrefixesForVersions,
      consumedTagNamesForVersions,
    };
  }, tagNames);

  return porscheDesignSystem;
};

const crawlWebsites = async (browser: Browser): Promise<void> => {
  const customerWebsiteMap: Record<string, string> = {
    'porsche.com': 'https://porsche.com',
    'finder.porsche.com': 'https://finder.porsche.com',
    'shop.porsche.com': 'https://shop.porsche.com',
    'porsche.com-swiss': 'https://www.porsche.com/swiss/de',
  };

  for (const websiteName in customerWebsiteMap) {
    const websiteUrl = customerWebsiteMap[websiteName];
    const page = await browser.newPage();

    // await page.setViewport({ width: width, height: height });

    await page.goto(websiteUrl, {
      waitUntil: 'networkidle0',
    });

    console.log('Crawling Page ' + page.url());

    const crawlResults = await crawlComponents(page);

    // TODO: delete old reports?
    fs.writeFileSync(
      `./${reportFolderName}/report-${websiteName}-${new Date().toJSON().slice(0, 10)}.json`,
      JSON.stringify(crawlResults, null, 4)
    );

    await page.close();
  }
};
const startBrowser = async (): Promise<void> => {
  try {
    const browser = await puppeteer.launch({
      headless: false, // The browser is visible
      ignoreHTTPSErrors: true,
      args: [`--window-size=${width},${height}`], // new option
    });

    await crawlWebsites(browser);

    console.log('Success - please check reports');
    browser.close();
  } catch (err) {
    console.log('Could not create a browser instance => : ', err);
  }
};

startBrowser();
