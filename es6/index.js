/**
 * Should loop over a task function which returns a "wrapper" object
 * until wrapper.done is true. A seed value wrapper.seed is propagated to the
 * next run of the loop.
 *
 * todo/maybe? Reject if wrapper is not an object with done and seed keys.
 *
 * @param {Promise|*} seed
 * @param {Function} taskFn
 *
 * @returns {Promise.<*>}
 */
function seedLoop(seed, taskFn) {
  const seedPromise = Promise.resolve(seed);

  return seedPromise
    .then(taskFn)
    .then((wrapper) => {
      if (wrapper.done) {
        return wrapper.seed;
      }

      return seedLoop(wrapper.seed, taskFn);
    });
}

export default seedLoop;
