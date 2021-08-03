const errors = require("./errors.json");
const {download} = require("util");

(async () => {
    for (const error of errors) {
        console.log(error);
        if (error.url)
            await download(error.url, `./items/test/${error.name}.png`);
    }
})();