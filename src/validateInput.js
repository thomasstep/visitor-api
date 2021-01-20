/*

{
  steps: [
    {
      url: URL,
      payload: JSON/object,
      method: 'get' | 'post',
      headers: JSON/object,
      assertions: [
        {
          type: 'equals' | 'exists',
          value: 'body' | 'status',
          expectedValue: String | Number
        }
      ]
    },
    ...
  ]
}

*/

function isValidAssertion(assertion) {
  if (
    ['equals', 'exists'].includes(assertion.type)
    && ['body', 'status'].includes(assertion.value)
    && ['string', 'number'].includes(typeof assertion.expectedValue)
  ) {
    return true;
  }

  console.error('Invalid assertion.');
  return false;
}

function areValidAssertions(assertions) {
  let valid = true;
  assertions.forEach((assertion) => {
    if(!isValidAssertion(assertion)) {
      valid = false;
    }
  });
  return valid;
}

function isValidStep(step) {
  // First check for valid URL
  let url = false;
  if (step && step.url) {
    try {
      url = new URL(step.url);
    } catch (err) {
      console.error(err);
    }
  }

  // Check subsequent types
  if (
    url
    && ['undefined', 'object'].includes(typeof step.payload)
    && ['get', 'post'].includes(step.method)
    && ['undefined', 'object'].includes(typeof step.headers)
    && Array.isArray(step.assertions)
    && areValidAssertions(step.assertions)
  ) {
    return true;
  }

  console.error('Invalid step.');
  return false;
}

function areValidSteps(steps) {
  let valid = true;
  steps.forEach((step) => {
    if(!isValidStep(step)) {
      valid = false;
    }
  });
  return valid;
}

function isValidInput(event) {
  if (
    event
    && event.steps
    && Array.isArray(event.steps)
    && areValidSteps(event.steps)
  ) {
    return true;
  }

  console.error('Invalid input.');
  return false;
}

module.exports = {
  isValidInput,
};