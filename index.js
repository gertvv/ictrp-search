var express = require('express');
var bodyParser = require('body-parser');
var SearchkitExpress = require('./searchkit-express');
var app = express();
app.use(bodyParser.json());

SearchkitExpress({
  host: process.env['ES_HOST'],
  index: process.env['ES_INDEX'],
  aws: {
    key: process.env['AWS_ACCESS_KEY_ID'],
    secret: process.env['AWS_SECRET_ACCESS_KEY'],
    sign_version: 4
  },
  queryProcessor: function(query, req, res){
    return query;
  }
}, app);

app.listen(3001, function() {
  console.log('http://localhost:3001');
});
