const postsConllection = require("../db").db().collection("posts");

let Post = function (data) {
  this.data = data;
  this.errors = [];
};

Post.prototype.cleanUp = function () {
  // Check type of field
  if (typeof this.data.title != "string") {
    this.data.title = "";
  }
  if (typeof this.data.body != "string") {
    this.data.body = "";
  }
  if (typeof this.data.author != "string") {
    this.data.author = "";
  }
  this.data = {
    title: this.data.title.trim(),
    body: this.data.body,
    author: this.data.author,
  };
};

Post.prototype.validate = function () {
  if (this.data.title == "") {
    this.errors.push("You must provide a title");
  }
  if (this.data.title.length > 0 && this.data.title.length < 6) {
    this.errors.push("Title must be at least 6 characters.");
  }
  if (this.data.body == "") {
    this.errors.push("Content cannot be empty");
  }
};

Post.prototype.create = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    this.validate();

    if (!this.errors.length) {
      await postsConllection.insertOne(this.data);
      resolve();
    } else {
      reject(this.errors);
    }
  });
};

module.exports = Post;
