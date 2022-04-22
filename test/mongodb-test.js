//CRUD create read update delete

const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
const { MongoClient, ObjectId } = require('mongodb');

const url = `mongodb://RitaAppworks:Rita0209!@52.21.239.102:27017/`;
const dbName = 'task-manager';
// const id = new ObjectId();
// console.log(id);
// console.log(id.getTimestamp());

MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log('unable to connect');
  }
  const db = client.db(dbName);
  console.log('connect!');

  //delete
  // db.collection('users')
  //   .deleteOne({ age: 30 })
  //   .then((result) => {
  //     console.log(result);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  // update

  // db.collection('tasks')
  //   .updateMany(
  //     { completed: false },
  //     {
  //       $set: {
  //         completed: true,
  //       },
  //     }
  //   )
  //   .then((result) => {
  //     console.log(result.modifiedCount);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  // db.collection('users')
  //   .updateOne(
  //     { _id: new ObjectId('625252aeb76315c848797b10') },
  //     {
  //       $inc: {
  //         age: 1,
  //       },
  //     }
  //   )
  //   .then((result) => {
  //     console.log(result);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  //read

  // db.collection('users').findOne(
  //   { _id: new ObjectId('625252aeb76315c848797b10') },
  //   (error, user) => {
  //     if (error) {
  //       return console.log('unable to fetch');
  //     }
  //     console.log(user);
  //   }
  // );
  // db.collection('users')
  //   .find({ age: 27 })
  //   .toArray((error, users) => {
  //     console.log(users);
  //   });

  // create

  db.collection('users').insertOne(
    {
      name: 'Rita',
      age: 26,
    },
    (error, result) => {
      if (error) {
        return console.log('unable to insert user');
      }
      console.log(result.insertedId);
    }
  );
  db.collection('users').insertMany(
    [
      {
        name: 'Henry',
        age: 30,
      },
      {
        name: 'Cherry',
        age: 27,
      },
    ],
    (error, result) => {
      if (error) {
        return console.log('unable to insert documents');
      }
      console.log(result.insertedIds);
    }
  );
  db.collection('tasks').insertMany(
    [
      {
        description: 'Python',
        completed: true,
      },
      {
        description: 'Java',
        completed: false,
      },
    ],
    (error, result) => {
      if (error) {
        return console.log('unable to insert documents');
      }
      console.log(result.insertedIds);
    }
  );
});
