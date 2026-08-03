---
title: Json gzip stream을 unzip하여 리턴하기
date: 2020-07-07T05:08:45.197Z
description: 
category: study
---

아마존 S3에서 gzip을 받을 일이 있어서 이를 unzip해서 리턴하는 함수를 작성했다.
언젠가 참고할 일이 있을까 하여 적어둠

```javascript
const gzipStream = await axios.default.request({
  url: error.response.headers.location,
  responseType: 'stream',
}).data;

const jsonData = await transformGzipStreamIntoJson(gzipstream)
```

```javascript
const zlib = require('zlib');
const util = require('util');
const stream = require('stream');

const { Writable } = stream;

const pipeline = util.promisify(stream.pipeline);

async function transformGzipStreamIntoJson(gzipStream) {
  const jsonStrArr = [];
  await pipeline(
    gzipStream,
    zlib.createGunzip(),
    new Writable({
      write(chunk, encoding, callback) {
        jsonStrArr.push(chunk.toString());
        callback();
      },
    }),
  );
  return JSON.parse(jsonStrArr.join(''));
}
```
