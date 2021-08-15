let User = function(data) {
  this.data = data
}

User.prototype.validate = function () {

}


User.prototype.register = function() {
    // Step #1: Validate user data
    console.log('Hello')

    // Step #2: Only if there are no validation errors 
    // then save the user data into a database
    
}

module.exports = User