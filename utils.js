const request = require('request');
const fs = require('fs');

function download(uri, filename) {
    return new Promise((resolve, reject) => {
        request.head(uri, function (err, res, body) {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve);
        });
    });
}

function formatName(name) {
    const nameparts = name.split("-");
    const formattedNameParts = nameparts.map(part => formattedPart = part.charAt(0).toUpperCase() + part.slice(1));
    const formattedItemName = formattedNameParts.join("_");
    return formattedItemName;
}

module.exports = { download, formatName }