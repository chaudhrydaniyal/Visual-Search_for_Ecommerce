const puppeteer = require('puppeteer');



async function scrape(url) {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const el2 = await page.evaluate( () => {
        return Array.from(document.querySelectorAll('h2 > .a-link-normal')).map(partner => partner.getAttribute('href'));
    })

    const el1 = await page.evaluate( () => {
        return Array.from(document.querySelectorAll('img[class="s-image"]')).map(partner => partner.getAttribute('src'));
    })
   
    browser.close();
    console.log(el2)
    console.log(el1)
    console.log(el2.length)
    console.log(el1.length)



    return {el2, el1};
    
}





module.exports = {
    scrape
}
