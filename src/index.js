const assert = require('assert').strict;

const axios = require('axios');

const { isValidInput } = require('./validateInput');

async function handler(event, context, callback) {
  if (!isValidInput(event)) {
    callback('Invalid input.', null);
  }

  let steps = event.steps;
  const promisedResults = steps.map(async (step) => {
    const response = await axios.request({
      method: step.method,
      url: step.url,
      data: step.payload,
      headers: step.headers,
    });

    const assertionResults = step.assertions.map((assertion) => {
      let assertionResult = false;
      let value = null;
      if (assertion.value === 'body') {
        value = response.data;
      }
      if (assertion.value === 'status') {
        value = response.status;
      }

      if (assertion.type === 'equals') {
        try {
          assert.deepStrictEqual(value, assertion.expectedValue);
          assertionResult = true;
        } catch (err) {
          assertionResult = false;
        }
      }

      if (assertion.type === 'exists') {
        try {
          assert.ok(value);
          assertionResult = true;
        } catch (err) {
          assertionResult = false;
        }
      }

      return {
        ...assertion,
        result: assertionResult,
      };
    });

    return {
      ...step,
      assertions: assertionResults,
    };
  });

  const results = await Promise.all(promisedResults);

  const data = {
    statusCode: 200,
    body: JSON.stringify({
      results,
    }),
  };
  callback(null, data);
}

module.exports = {
  handler,
};