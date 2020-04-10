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

 - Install dependencies: `yarn install`
 - Run the server: `yarn run server`
 - Run the client: `yarn run client`

Running in production
---

 - Install dependencies: `yarn install`
 - Build the client: `yarn run build`
 - Run the server: `yarn run server [listen-port]`
