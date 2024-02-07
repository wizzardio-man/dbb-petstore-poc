require('dotenv').config();
const axios = require('axios');

const makePostCall = (entiry, body, headers) => {
    const baseUrl = process.env.BASE_URL;
    const version = process.env.API_VERSION;
    const url = `${baseUrl}/${version}/${entiry}`;
    return axios.post(url, body, { headers });
}

module.exports = {
    makePostCall
}