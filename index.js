const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const SearchkitExpress = require('./searchkit-express');
const app = express();
app.use(bodyParser.json());

const searchKitSettings = {
  host: process.env['ES_HOST'],
  index: process.env['ES_INDEX'],
  queryProcessor: function(query, req, res){
    return query;
  }
};
if (process.env['AWS_ACCESS_KEY_ID']) {
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
