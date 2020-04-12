const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const SearchkitExpress = require('./searchkit-express');
const request = require('request');
const app = express();
app.use(bodyParser.json());

function get(url) {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) return reject(error);
      if (response.statusCode != 200) return reject(`HTTP status: ${response.statusCode}`);
      resolve(body);
    });
  });
}

async function getAwsCredentials(url) {
  try {
    const host = process.env['AWS_CONTAINER_CREDENTIALS_HOST'] || 'http://169.254.170.2';
    const json = await get(`${host}${url}`);
    const info = JSON.parse(json);

    console.log(info);

    return {
      key: info.AccessKeyId,
      secret: info.SecretAccessKey,
      session: info.Token,
      sign_version: 4
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

const searchKitSettings = {
  host: process.env['ES_HOST'],
  index: process.env['ES_INDEX'],
  queryProcessor: function(query, req, res){
    return query;
  }
};

async function run() {
  const credentialsUrl = process.env['AWS_CONTAINER_CREDENTIALS_RELATIVE_URI'];
  if (credentialsUrl) {
    try {
      searchKitSettings.aws = await getAwsCredentials(credentialsUrl);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  } else if (process.env['AWS_ACCESS_KEY_ID']) {
    searchKitSettings.aws = {
      key: process.env['AWS_ACCESS_KEY_ID'],
      secret: process.env['AWS_SECRET_ACCESS_KEY'],
      sign_version: 4
    };
  }
  SearchkitExpress(searchKitSettings, app);

  app.use(express.static(path.join(__dirname, 'build')));

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

  const port = parseInt(process.argv[2]) || 3001;

  app.listen(port, function() {
    console.log('http://localhost:' + port);
  });
}

run();
