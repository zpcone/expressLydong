var express=require('express');
var path=require('path');
var fm=require('formidable');
var app=express();
var fs=require('fs')
var userController = require('../controller/user');


module.exports =  function(app){

	app.use(function(req, res, next) {
        res.locals.user = req.session.user;
        next();
    });

	app.get("/",function(req,res){
		res.render("index");
	});

	app.get("/signin",function(req,res){
		res.render("signin");
	});

	app.get("/signup",function(req,res){
		res.render("signup");
	});

	app.post("/signup",userController.signup);
	
	//头像上传
	app.get("/upload",function(req,res){
		res.render("upload");
	});

	app.post('/signin',userController.login);

	app.post('/upload',function(req,res){
		var userObj = req.session.user;
		var form = new fm.IncomingForm();
		form.uploadDir = path.join(__dirname,'../public/files');
		form.parse(req);
		form.on('file',function(field,file){
			var date = Date.now();
			files = fs.readdirSync(form.uploadDir);
			files.forEach(function(f,index){
				var reg = /(\D?)*(?=(\.png)$)/g;
				curPath = form.uploadDir + '\\' + f;
				if(curPath.match(reg)){
					if(curPath.match(reg)[0] == req.session.user.name){
						fs.unlinkSync(curPath);
					}
				}
			});
			fs.renameSync(file.path,path.join(form.uploadDir,''+date+req.session.user.name+'.png'));
			userController.updates(req,userObj.name,'./files/'+''+date+req.session.user.name+'.png');
			req.session.user.image = './files/'+''+date+req.session.user.name+'.png';	
			res.send('./files/'+''+date+req.session.user.name+'.png');
		});
		form.on('end',function(){
			console.log('upload success');	
		});
	});

	app.get('/logout',function(req,res){
		req.session.user = null;
		res.redirect('/');
	});	

	app.post("/randommes",userController.send_email);
		// res.render('idnex');
}