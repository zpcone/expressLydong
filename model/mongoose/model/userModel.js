var mongoose = require("mongoose");
var userSchema = require("../schema/userSchema");

var userModel = mongoose.model("user",userSchema);

module.exports = userModel;