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
"use strict";

var _Promise = require("babel-runtime/core-js/promise")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});
function seedLoop(seed, taskFn) {
  var seedPromise = _Promise.resolve(seed);

  return seedPromise.then(taskFn).then(function (wrapper) {
    if (wrapper.done) {
      return wrapper.seed;
    }

    return seedLoop(wrapper.seed, taskFn);
  });
}

exports["default"] = seedLoop;
module.exports = exports["default"];