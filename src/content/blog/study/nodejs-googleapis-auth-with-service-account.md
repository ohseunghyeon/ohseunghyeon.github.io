---
title: nodejs googleapis에서 service account로 auth 하기
date: 2020-04-23T03:55:37.541Z
description: 
category: study
---

## 서비스 어카운트 json 파일 사용하여 인증하기

```javascript
const { google } = require('googleapis');

const credentials = require('json-file-that-you-downloaded-on-google-console.json');

const jwt = new google.auth.JWT({
  scopes: [
    'https://www.googleapis.com/auth/analytics',
    'https://www.googleapis.com/auth/analytics.manage.users',
    'https://www.googleapis.com/auth/analytics.edit',
  ],
});

jwt.fromJSON(credentials);

// you can also set auth here
const analytics = await google.analytics({ version: 'v3' });

const list = await analytics.management.accounts.list({
  auth: jwt,
});
```

## 서비스 어카운트 정보를 사용하여 인증하기

```javascript
const { google } = require('googleapis');
const credentials = require('json-file-that-you-downloaded-on-google-console.json');

const jwt = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: [
    'https://www.googleapis.com/auth/analytics',
    'https://www.googleapis.com/auth/analytics.manage.users',
    'https://www.googleapis.com/auth/analytics.edit',
  ],
});

jwt.fromJSON(credentials);

// you can also set auth here
const analytics = await google.analytics({ version: 'v3' });

const list = await analytics.management.accounts.list({
  auth: jwt,
});
```

## Oauth2 token으로 인증하기

```javascript
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2({
  clientId: 'client-id',
  clientSecret: 'client-secret',
});

oauth2Client.setCredentials({
  access_token: 'access_token' // optional
  refresh_token: 'refresh_token',
});

// This function will refresh accessToken. you can use this when you didn't put
// access_token for setCredentials method
// await oauth2Client.getAccessToken()

const analytics = await google.analytics({ version: 'v3' });
const list = await analytics.management.accounts.list({
  auth: oauth2Client,
});
```
