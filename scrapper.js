console.log("scrapper started... ");

const puppet = require("puppeteer");
const fs = require('fs');
const { download, formatName } = require("./utils")

const getArtwork = async (itemName, errors) => {
    console.log(`Searching for ${itemName}`);
    let error = null;
    let imageUrl = null;

    const browser = await puppet.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(`https://bulbapedia.bulbagarden.net/wiki/${itemName}`);
        await page.waitForSelector("table.roundy tbody tr:nth-child(2) td table tbody tr td a.image");

        imageUrl = await page.$eval("table.roundy tbody tr:nth-child(2) td table tbody tr td a.image img", image => image.src)
    } catch (err) {
        error = err;
    }

    browser.close()

    const originalName = itemName.replace(/_/g, "-").toLowerCase();
    if (imageUrl) {
        await download(imageUrl, `./items/artworks/${originalName}.png`)
    } else {
        errors.push({ name: originalName, url: imageUrl, error });
    }
}

(async () => {
    // the sprites are used to get the name of the objects.
    const files = await fs.readdirSync('./items/sprites/')
    const errors = []; // this will be filled with the items that are not found

    for (const file of files) {
        const formattedFile = formatName(file.split(".")[0])
        await getArtwork(formattedFile, errors);
    }

    fs.writeFileSync("./errors.json", JSON.stringify(errors));
})();
