# promise-seedloop [![Build Status](https://travis-ci.org/CascadeEnergy/promise-seedloop.svg?branch=master)](https://travis-ci.org/CascadeEnergy/promise-seedloop)

> Helper function for doing chained loops of asynchronous tasks with promises.


## Install

```
$ npm install --save promise-seedloop
```

## Usage

**seedLoop(seed, taskFn) => Promise**

The `taskFn` must return a "wrapper" object whose keys are:

- `wrapper.seed` will be passed to the next invocation of the taskFn.
- `wrapper.done` can be used to stop the loop when `wrapper.done == true`.

Here's the most simple count to ten example.

```javascript
import loop from 'promise-seedloop';

function countToTen(count) {
  const done = count > 10;
  const seed = done ? count : count + 1;

  return {done, seed};
}

loop(1, countToTen).then((result) => {
  console.log(result); // 11, the first value which was over 10.
});
```

Here's a more complex example doing pagination requests. This example uses dynamodb as an example because it's a
particularly foolish database for pagination where seedloop can come in handy.

```javascript
import dynamoDbPromised from 'aws-promised/dynamoDb';
import loop from 'promise-seedloop';

const dynamoDb = dynamoDb({region: 'us-west-2'});

function getPageOfItems(params) {
  return dynamoDb
    .scanPromised(params)
    .then((data) => {
      // here is where you might do something with data.Items (the page of data).
      // Whatever you do might even be asynchronous, just return a promise which
      // eventually resolves to a "wrapper" object like below.
        
      let done = false;
      params.ExclusiveStartKey = data.LastEvaluatedKey;
      
      // When there is no LastEvaluatedKey in the response, we've reached
      // the end of the results and should terminate the loop.
      if (!data.LastEvaluatedKey) {
        done = true;
      }
      
      return {
        seed: params,
        done
      };
    });
}

const initialParams = {TableName: 'my-dynamo-table'};

loop(initialParams, getPageOfItems)
  .then(() => {
    console.log('done, went through all pages of data');
  });
```
