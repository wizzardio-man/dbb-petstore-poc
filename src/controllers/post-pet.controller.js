const { makePostCall } = require('../api/api');

const petEntity = 'pet';

const postPet = (body, headers = {'Content-Type': 'application/json'}) => {
    return makePostCall(petEntity, body, headers);
}

module.exports = {
    postPet
}