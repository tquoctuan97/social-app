const usersCollection = require('../db').db().collection('users');
const followsCollection = require('../db').db().collection('follows');
const ObjectID = require('mongodb').ObjectID;

let Follow = function (followedUsername, authorId) {
  this.followedUsername = followedUsername;
  this.authorId = authorId;
  this.errors = [];
};

Follow.prototype.cleanUp = function () {
  // Check typeof followedUsername is string
  if (typeof this.followedUsername != 'string') {
    this.followedUsername = '';
  }
};

Follow.prototype.validate = async function () {
  // Check username is exist
  let accountExists = await usersCollection.findOne({username: this.followedUsername});
  if (accountExists) {
    this.followedId = accountExists._id;
  } else {
    this.errors.push('You can not follow a username is not exists');
  }
};

Follow.prototype.create = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    await this.validate();

    console.log('followedId: ' + this.followedId);
    console.log('authorId: ' + this.authorId);

    if (!this.errors.length) {
      await followsCollection.insertOne({followedId: this.followedId, authorId: new ObjectID(this.authorId)});
      resolve();
    } else {
      reject();
    }
  });
};

module.exports = Follow;
