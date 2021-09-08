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

Follow.prototype.validate = async function (action) {
  // Check username is exist
  let accountExists = await usersCollection.findOne({username: this.followedUsername});
  if (accountExists) {
    this.followedId = accountExists._id;
  } else {
    this.errors.push('You can not follow a username is not exists');
  }

  let doesFollowAlreadyExist = await followsCollection.findOne({
    followedId: this.followedId,
    authorId: new ObjectID(this.authorId),
  });

  if (action == 'create') {
    if (doesFollowAlreadyExist) {
      this.errors.push('You are already following this user');
    }
  }

  if (action == 'delete') {
    if (!doesFollowAlreadyExist) {
      this.errors.push('You cannot stop following someone you do not already follow.');
    }
  }

  if (this.followedId.equals(this.authorId)) {
    this.errors.push('You cannot follow yourself.');
  }
};

Follow.prototype.create = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    await this.validate('create');

    if (!this.errors.length) {
      await followsCollection.insertOne({followedId: this.followedId, authorId: new ObjectID(this.authorId)});
      resolve();
    } else {
      reject(this.errors);
    }
  });
};

Follow.prototype.delete = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    await this.validate('delete');

    if (!this.errors.length) {
      await followsCollection.deleteOne({followedId: this.followedId, authorId: new ObjectID(this.authorId)});
      resolve();
    } else {
      reject(this.errors);
    }
  });
};

Follow.isVistorFollowing = async function (followedId, visitorId) {
  let followDoc = await followsCollection.findOne({followedId: followedId, authorId: new ObjectID(visitorId)});
  if (followDoc) {
    return true;
  } else {
    return false;
  }
};

module.exports = Follow;
