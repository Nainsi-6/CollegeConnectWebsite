const DataUriParser = require('datauri/parser');
const path = require('path');

const getDataUrl = (file) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname); // Get file extension
    return parser.format(extName, file.buffer).content; // Return Data URI
};

module.exports = getDataUrl;
