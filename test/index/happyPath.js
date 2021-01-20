const assert = require('assert').strict;

const nock = require('nock');

const { handler } = require('../../src/index');

describe('index.js', function() {
  describe('happy path', function() {
    before(function() {
      nock('http://www.example.com')
        .get('/resource')
        .reply(200, 'domain matched');
    });

    it('should return all assertions worked', async function() {
      const event = {
        steps: [
          {
            url: 'http://www.example.com/resource',
            method: 'get',
            assertions: [
              {
                type: 'equals',
                value: 'status',
                expectedValue: 200,
              },
              {
                type: 'equals',
                value: 'body',
                expectedValue: 'domain matched',
              },
            ],
          },
        ],
      };

      await handler(event, null, (err, res) => {
        if (err) {
          console.error(err);
          assert.equal(true, false);
        }

        const data = JSON.parse(res.body);
        console.log(data.results[0].assertions);
        data.results[0].assertions.forEach((assertion) => {
          assert.ok(assertion.result);
        })
      });
    });
  });
});