const getDefaultPetEntity = () => {
    return {
        "id": 0,
        "category": {
            "id": 0,
            "name": "string"
        },
        "name": "doggie",
        "photoUrls": [
            "string"
        ],
        "tags": [
            {
                "id": 0,
                "name": "string"
            }
        ],
        "status": "available"
    }
}

const getRandomInt = () => {
    return Math.floor(Math.random() * (100 - 10 + 1)) + 10;
}

module.exports = {
    getDefaultPetEntity,
    getRandomInt
}
