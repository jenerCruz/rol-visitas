const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {

    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage({
        viewport: {
            width: 1600,
            height: 1400
        }
    });

    const url = 'https://TUUSUARIO.github.io/TUREPO/';

    await page.goto(url, {
        waitUntil: 'networkidle'
    });

    await page.waitForTimeout(5000);

    const imageData = await page.evaluate(async () => {
        return await exportToImage(true);
    });

    const base64 = imageData.replace(
        /^data:image\/png;base64,/,
        ''
    );

    fs.writeFileSync(
        path.join(__dirname, 'horario.png'),
        Buffer.from(base64, 'base64')
    );

    console.log('Imagen generada');

    await browser.close();

})();
