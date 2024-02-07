Feature: POST /pet

Scenario: Valid Request
    Given I have a valid request body
    When I send a POST request to API endpoint
    Then the response status code should be 200
    And the response body should contain the created entry details

Scenario: Request with Empty Body
    Given I have an empty request body
    When I send a POST request to API endpoint
    Then the response status code should be 200
    And the response body should contain an error message indicating the missing fields

Scenario Outline: Request with incorrect data type
    Given I have a body with incorrect data type <Value_Type> for field <Field>
    When I send a POST request to API endpoint
    # Then the response status code should be 425
    And the response body should contain an error message indicating incorrect data type

    Examples:
        | Field  | Value_Type |
        | name   | INT        |
        | status | INT        |

Scenario: Valid Request with Additional Fields
    Given I have a request body with additional fields
    When I send a POST request to API endpoint
    Then the response status code should be 200
    And the response body should not contain additional fields

Scenario: Valid Request with XML body
    Given I have a valid request body in XML format
    When I send a POST request with an XML body
    Then the response status code should be 200
    And the response body should contain XML fields