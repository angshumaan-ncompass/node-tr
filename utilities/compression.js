var zlib = require("zlib");

const compress = async (res) => {
    return new Promise((resolve, reject) => {
        var response = JSON.stringify(res);
        var compressed = zlib.inflate(response, (error, result) => {
            return resolve(result);
        });
    });
};

const compressGzip = async (res) => {
    return new Promise((resolve, reject) => {
        var response = JSON.stringify(res);
        var compressed = zlib.gzip(response, (error, result) => {
            return resolve(result);
        });
    });
};

module.exports = { compress, compressGzip };