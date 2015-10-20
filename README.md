# promise-seedloop [![Build Status](https://travis-ci.org/CascadeEnergy/promise-seedloop.svg?branch=master)](https://travis-ci.org/CascadeEnergy/promise-seedloop)

> Helper for doing chained loops of asynchronous tasks with promises.


## Install

```
$ npm install --save promise-seedloop
```

## Usage

Most simple count to ten example.

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

Pagination requests. This example uses dynamodb as an example because it's a particularly
foolish database for paginating.

```javascript
import dynamoDbPromised from 'aws-promised/dynamoDb';
import loop from 'promise-seedloop';

const dynamoDb = dynamoDb({region: 'us-west-2'});

function getPageOfItems(params) {
  return dynamoDb
    .scanPromised(params)
    .then((data) => {
      // here is where you might do something with data.Items (the page of data)
      // this thing you do, might even be asynchronous, just return a promise which
      // eventually resolves to a "wrapper" object like below.
      let done = false;
      params.ExclusiveStartKey = data.LastEvaluatedKey;
      
      if (!data.LastEvaluatedKey) {
        delete params.ExclusiveStartKey;
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
    console.log('done, processed all pages');
  });
```
