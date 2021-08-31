import puppeteer from 'puppeteer';
import { element2selector } from 'puppeteer-element2selector';


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function forever(f) {
  while (true) {
    try {
      return await f();
    } catch (e) {
    }
  }
}

async function scrollAndClick(page: puppeteer.Page, selector: string) {
  const buttons = await page.$x(selector);
  for (const button of buttons) {
    const buttonSelector = await element2selector(button);
    await page.evaluate(({ buttonSelector }) => document.querySelector(buttonSelector).scrollIntoView(), { buttonSelector });
    try {
      await button.click();
      await delay(500);
      console.log(`clicked ${buttonSelector}`);
    } catch (e) {
      console.log(`couldn't click selector ${buttonSelector}`);
    }
  }
}

export async function generateCoupon(code: string, headless = true) {
  const browser = await puppeteer.launch({ headless, args: ['--no-sandbox','--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.goto('https://mcdonalds.hr/upitnik', {timeout: 1000 * 60 * 5});
    await forever(() => page.focus('#receiptCode'));
    await page.keyboard.type(code);
    const [start] = await forever(() => page.$x("//button[contains(., 'Start')]"));
    await start.click();
    await page.waitForXPath("//span[contains(., 'Vrlo zadovoljan')]", {timeout: 1000 * 60});
    await delay(3000);

    await scrollAndClick(page, "//span[contains(., 'Vrlo zadovoljan')]");
    await scrollAndClick(page, '//span[text()=\'Ne\']');
    await scrollAndClick(page, '//span[contains(., \'👍🏻\')]');
    await scrollAndClick(page, '//span[contains(., \'Vrlo vjerojatno\')]');
    await scrollAndClick(page, '//span[contains(., \'Definitivno bih preporučio\')]');
    await scrollAndClick(page, '//span[contains(., \'Muški\')]');
    await scrollAndClick(page, '//span[contains(., \'18-34\')]');
    await scrollAndClick(page, '//span[contains(., \'Dva puta mjesečno\')]');
    await scrollAndClick(page, "//input[@placeholder='Unesite tekst ovdje']");
    await page.keyboard.type('xxxxxxxx');
    await scrollAndClick(page, '//span[contains(., \'Pošalji\')]');

    await page.waitForXPath("//span[contains(., 'Ovaj kupon se može')]");
    await delay(1000);
    return page.url();
  } finally {
    await browser.close();
  }
}
