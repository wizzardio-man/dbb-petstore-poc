const { loadFeature, defineFeature } = require('jest-cucumber');
const { getDefaultPetEntity, getRandomInt } = require('../utils/random/pet.random');
const { postPet } = require('../controllers/post-pet.controller');

const feature = loadFeature('src/features/post-pet.feature');

let body;
let requestResult;
let xmlBody;

defineFeature(feature, ( test ) => {
    const whenSendPostRequestWithBody = (when) => {
        when('I send a POST request to API endpoint', () => {
            requestResult = postPet(body);
        });
    }

    const thenResponseStatusCodeShouldBe = (then) => {
        then(/^the response status code should be (\d+)$/, code => {
            requestResult.then(response => 
                expect(response.status).toBe(parseInt(code, 10)));
        })
    }

    beforeEach(() => {

    });

    test('Valid Request', ({ given, when, then, and }) => {
        given('I have a valid request body', () => {
            body = getDefaultPetEntity();
        });

        whenSendPostRequestWithBody(when);

        thenResponseStatusCodeShouldBe(then);

        and('the response body should contain the created entry details', async () => {
            const response = await requestResult;
            const { data } = response;
            const definedId = data.id;
            expect(data).toEqual({ ...body, id: definedId });
        });
    });

    /**
     * Currently, sending empty body will lead to 200 response without an issue.
     * Not sure it is expected.
     */
    test('Request with Empty Body', ({ given, when, then, and }) => {
        given('I have an empty request body', () => {
            body = {};
        });

        whenSendPostRequestWithBody(when);

        thenResponseStatusCodeShouldBe(then);

        and('the response body should contain an error message indicating the missing fields', async () => {
            const response = await requestResult;
            const { data } = response;
            const definedId = data.id;
            expect(data).toEqual({ 
                photoUrls: [],
                tags: [],
                id: definedId 
            });
        });
    });

    /**
     * When I try to send
     * request with Name or Status fields type = Number
     * in swagger I get error message propKeynameerrorValue must be a string
     * 
     * but via axios and postman - OK, it works without an issue.
     * 
     * The same with Category and Tags objects.
     * 
     * Looks like an API has no validators
     */
    test('Request with incorrect data type', ({ given, when, and }) => {
        given(/^I have a body with incorrect data type (.*) for field (.*)$/, (type, value) => {
            body = getDefaultPetEntity();
            const modifiedValueByType = type === 'INT' ? getRandomInt() : '';
            body[value] = parseInt(modifiedValueByType, 10);
        });

        whenSendPostRequestWithBody(when);

        // expected to catch an error
        and('the response body should contain an error message indicating incorrect data type', async () => {
            const result = await requestResult;
        })
    });

    test('Valid Request with Additional Fields', ({ given, when, then, and }) => {
        given('I have a request body with additional fields', () => {
            body = getDefaultPetEntity();
            body.additional = 'additional';
        });

        whenSendPostRequestWithBody(when);

        thenResponseStatusCodeShouldBe(then);

        and('the response body should not contain additional fields', async () => {
            const response = await requestResult;
            const { data } = response;
            expect(data.hasOwnProperty('additional')).toBe(false);
        });
    });

    test('Valid Request with XML body', ({ given, when, then, and }) => {
        given('I have a valid request body in XML format', () => {
            xmlBody = `
            <Pet>
                <id>0</id>
                <Category>
                    <id>0</id>
                    <name>string</name>
                </Category>
                <name>doggie</name>
                <photoUrls>
                    <photoUrl>string</photoUrl>
                </photoUrls>
                <tags>
                    <Tag>
                        <id>0</id>
                        <name>string</name>
                    </Tag>
                </tags>
                <status>available</status>
            </Pet>`;
        });

        when('I send a POST request with an XML body', async () => {
            requestResult = postPet(xmlBody, {'Content-Type': 'application/xml'});
        });

        thenResponseStatusCodeShouldBe(then);

        /**
         * Not sure why this is the body when I use XML
         * {
                id: 9223372036854318000,
                name: 'doggie',
                photoUrls: [ 'string' ],
                tags: [],
                status: 'available'
            }
         */
        and('the response body should contain XML fields', async () => {
            const response = await requestResult;
            const { data } = response;
            const definedId = data.id;
            expect(data).toEqual({ ...getDefaultPetEntity(), id: definedId });
        });
    });
});
