var express = require('express');
var app= express();
var http=require('http').Server(app);

var fs=require('fs');
var datebase={};
// info 查看图片所有信息
//info.ctime  修改日期  change time
//info.mtime  拍摄日期(无改动)  modify time
//info.atime access time 

fs.readdir('./public/images/',function(err,files){
	for (var i = 0; i < files.length; i++) {
		fs.stat('./public/images/'+files[i],function(i){
			return function(err,info){
				var mtime =info.mtime;
				var key = mtime.getFullYear()+'-'+mtime.getMonth()+'-'+mtime.getDate();
				if (!datebase[key]) {
					datebase[key]=[];
				}
				datebase[key].push(files[i]);
				console.log(datebase);
			};
		}(i));
	}		
});

app.use(express.static('public'));//让public这个文件可以通过 / 直接访问
app.get('/',function(req,res){
	res.sendFile(__dirname+'/index.html');
});
var datebase={
	// '2015-10-26':['1.jpg','2.jpg','3.jpg'],
	// '2015-10-25':['4.jpg','5.jpg','6.jpg'],
	// '2015-10-24':['7.jpg','8.jpg','9.jpg'],
	// '2015-10-23':['10.jpg','11.jpg','12.jpg'],
	// '2015-10-22':['13.jpg','14.jpg','15.jpg'],
	// '2015-10-21':['16.jpg','17.jpg','18.jpg'],
	// '2015-10-27':['19.jpg','20.jpg','21.jpg'],
	// '2015-10-28':['22.jpg','23.jpg','24.jpg'],
	// '2015-10-30':['28.jpg','29.jpg','30.jpg'],
	// '2015-10-20':['31.jpg','32.jpg','33.jpg'],
	// '2015-10-29':['25.jpg','26.jpg','27.jpg']
};
app.get('/daypicture',function(req,res){
	// console.log(req.query.day);
	if (datebase[req.query.day]) {
		res.json(datebase[req.query.day]);
	}else{
		res.send('none');
	}
	// json -->{} [] [{}]  {[]}
	// send -->14 '按时'
});
http.listen(80,function(){
	console.log('listening on *:3000');
});
