import assert from 'assert';
import {describe, it} from 'mocha';
import seedLoop from '../index';

describe('promise-seedloop', () => {
  it('should loop over a task until wrapper.done is true', (done) => {
    function countToTen(count) {
      const done = count > 10;
      const seed = done ? count : count + 1;

      return {done, seed};
    }

    seedLoop(1, countToTen).then((result) => {
      assert.equal(result, 11, 'last value is resolved');
      done();
    });
  });

  it('should be able to take promise as seed', (done) => {
    function countToTen(count) {
      const done = count > 10;
      const seed = done ? count : count + 1;

      return {done, seed};
    }

    const promiseSeed = Promise.resolve(1);

    seedLoop(promiseSeed, countToTen).then((result) => {
      assert.equal(result, 11, 'last value is resolved');
      done();
    });
  });
});
