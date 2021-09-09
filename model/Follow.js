const usersCollection = require('../db').db().collection('users');
const followsCollection = require('../db').db().collection('follows');
const User = require('../model/User');
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

Follow.getFollowersById = function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      let followers = await followsCollection
        .aggregate([
          {$match: {followedId: id}},
          {$lookup: {from: 'users', localField: 'authorId', foreignField: '_id', as: 'userDoc'}},
          {
            $project: {
              username: {$arrayElemAt: ['$userDoc.username', 0]},
              email: {$arrayElemAt: ['$userDoc.email', 0]},
            },
          },
        ])
        .toArray();
      followers = followers.map((follower) => {
        let user = new User(follower, true);
        return {
          username: follower.username,
          avatar: user.avatar,
        };
      });
      resolve(followers);
    } catch (e) {
      reject(e);
    }
  });
};

Follow.getFollowingById = function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      let followingList = await followsCollection
        .aggregate([
          {$match: {authorId: id}},
          {$lookup: {from: 'users', localField: 'followedId', foreignField: '_id', as: 'userDoc'}},
          {
            $project: {
              username: {$arrayElemAt: ['$userDoc.username', 0]},
              email: {$arrayElemAt: ['$userDoc.email', 0]},
            },
          },
        ])
        .toArray();
      followingList = followingList.map((followingItem) => {
        let user = new User(followingItem, true);
        return {
          username: followingItem.username,
          avatar: user.avatar,
        };
      });
      resolve(followingList);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = Follow;
