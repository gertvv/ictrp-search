var express = require('express');
var bodyParser = require('body-parser');
var SearchkitExpress = require('./searchkit-express');
var app = express();
app.use(bodyParser.json());

SearchkitExpress({
  host: 'https://search-ictrp-v2hdjzj6bb5ejij3pauigo2xk4.eu-central-1.es.amazonaws.com',
  index: 'ictrp-2017-w19',
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
