const { chromium } = require('playwright');

const fs = require('fs');

(async () => {

    try {

        const browser = await chromium.launch({
            headless: true
        });

        const page = await browser.newPage({
            viewport: {
                width: 1600,
                height: 1400
            }
        });

        page.on('console', msg => {
            console.log('BROWSER:', msg.text());
        });

        await page.goto(
            'http://127.0.0.1:8080/',
            {
                waitUntil: 'domcontentloaded'
            }
        );

        // Esperar a que exista el grid
        await page.waitForSelector('#schedule-grid');

        // Esperar a que cargue branches.json y genere horario
        await page.waitForTimeout(8000);

        // Verificar que exista la función
        const exists = await page.evaluate(() => {
            return typeof exportToImage === 'function';
        });

        if(!exists){

            throw new Error('exportToImage no existe');

        }

        const imageData = await page.evaluate(async () => {

            return await exportToImage(true);

        });

        if(!imageData){

            throw new Error('No se generó imagen');

        }

        const base64 = imageData.replace(
            /^data:image\/png;base64,/,
            ''
        );

        fs.writeFileSync(
            'horario.png',
            Buffer.from(base64, 'base64')
        );

        console.log('Horario generado correctamente');

        await browser.close();

    } catch(err){

        console.error(err);

        process.exit(1);

    }

})();
