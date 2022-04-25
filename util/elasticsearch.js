const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');
const client = new Client({
  node: 'https://52.21.239.102:9200',

  auth: {
    username: 'elastic',
    password: 'Rita0209!',
  },
  tls: {
    ca: fs.readFileSync('../http_ca.crt'),
    rejectUnauthorized: false,
  },
});

// check online
// async function clientInfo() {
//   const info = await client.info();
//   console.log(info);
// }

// clientInfo();

const jsonData = require('../test/posts_info.json');
dataset = [];

for (var i = 0; i < 100; i++) {
  data = {
    title: jsonData[i]['title'],
    content: jsonData[i]['content'],
  };
  dataset.push(data);
}

async function run() {
  await client.indices.create(
    {
      index: 'blog',
      body: {
        mappings: {
          properties: {
            id: { type: 'integer' },
            title: { type: 'text' },
            content: { type: 'text' },
          },
        },
      },
    }
    // { ignore: [400] }
  );

  const operations = dataset.flatMap((doc) => [
    { index: { _index: 'blog' } },
    doc,
  ]);

  // console.log(operations);
  const bulkResponse = await client.bulk({ refresh: true, operations });

  if (bulkResponse.errors) {
    const erroredDocuments = [];
    // The items array has the same order of the dataset we just indexed.
    // The presence of the `error` key indicates that the operation
    // that we did for the document has failed.
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        erroredDocuments.push({
          // If the status is 429 it means that you can retry the document,
          // otherwise it's very likely a mapping error, and you should
          // fix the document before to try it again.
          status: action[operation].status,
          error: action[operation].error,
          operation: body[i * 2],
          document: body[i * 2 + 1],
        });
      }
    });
    console.log(erroredDocuments);
  }

  const count = await client.count({ index: 'blog' });
  console.log(count);
}

run().catch(console.log);

//   // Let's search!
//   const result = await client.search({
//     index: 'game-of-thrones',
//     query: {
//       match: { quote: 'winter' },
//     },
//   });

//   console.log(result.hits.hits);
// }

// run().catch(console.log);
