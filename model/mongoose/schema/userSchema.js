var mongoose = require("mongoose");
var bcryptjs = require("bcryptjs");

var SALT_WORK_FACTOR = 10;

var userSchema = new mongoose.Schema({
	name:{
		type:String,
		unique:true
	},
	password: {
		type:String
	},
	role:{
		type:Number,
		default:10
	},
	image:{
		type:String,
		default:"./files/pro-img.png"
	},
	email: {
		type:String
	},
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});
userSchema.pre("save",function(next){
	var user  = this;
	if(this.isNew){
		this.meta.createAt = Date.now();
		this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	bcryptjs.genSalt(SALT_WORK_FACTOR,function(err,salt){
		if(err){
			return next(err);
		}
		bcryptjs.hash(user.password,salt,function(err, hash){
			if(err){
				return next(err);
			}
			user.password = hash;
			next();
		})
	});
})


userSchema.statics = {
	findAll: function(cb){
		return this.find({}).sort('meta.createAt').exec(cb);
	},
	findById: function(id, cb){
		return this.findOne({ _id:id}).exec(cb);
	}
};

userSchema.methods = {
	comparePassword: function(password, cb){
		bcryptjs.compare(password, this.password, function(err, isMatch){
			if(err){
				return cb(err);
			}
			cb(null, isMatch);
		});
	}
};

module.exports = userSchema;