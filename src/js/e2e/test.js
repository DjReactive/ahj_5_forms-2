import puppeteer from 'puppeteer';

jest.setTimeout(30000);
describe('INN/ORGN from', () => {
  let browser = null;
  let page = null;
  const baseUrl = 'http://localhost:8888';
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 50,
      devtools: true,
    });
    page = await browser.newPage();
  });
  afterAll(async () => {
    await browser.close();
  });

  test('Add Item', async () => {
    await page.goto(baseUrl);
    const widjet = await page.$('.widjet');
    const buttonAdd = await widjet.$('.button');
    await buttonAdd.click();
    const popup = await page.waitForSelector('.popup');
    const inputName = await page.$('#name');
    const inputPrice = await page.$('#price');
    await inputName.type('Test Item 1');
    await inputPrice.type(String(1235));
    const saveBut = await popup.$('[data-action=save]');
    await saveBut.click();
  });

  test('Edit Item', async () => {
    const widjet = await page.$('.widjet');
    const buttonEdit = await widjet.$('#edit-id-1');
    await buttonEdit.click();
    const popup = await page.waitForSelector('.popup');
    const inputName = await page.$('#name');
    const inputPrice = await page.$('#price');
    await inputName.type('(edited)');
    await inputPrice.type('12000');
    const saveBut = await popup.$('[data-action=save]');
    await saveBut.click();
  });

  test('Remove Item', async () => {
    const widjet = await page.$('.widjet');
    const buttonEdit = await widjet.$('#remove-id-1');
    await buttonEdit.click();
  });
});
