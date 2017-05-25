ICTRP search frontend
===

Assumes [ICTRP](http://www.who.int/ictrp/en/) data are loaded into an ElasticSearch instance. See [ictrp-retrieval](https://github.com/gertvv/ictrp-retrieval/).

Configuration
---

Set the following environment variables:

 - `AWS_ACCESS_KEY_ID`
 - `AWS_SECRET_ACCESS_KEY`
 - `ES_HOST`
 - `ES_INDEX`

Running for development
---

 - Install dependencies: `nmp install`
 - Run the server: `npm run server`
 - Run the client: `npm run client`

Running in production
---

 - Install dependencies: `npm install`
 - Build the client: `npm run build`
 - Run the server: `npm run server [listen-port]`
