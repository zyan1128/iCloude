window.onload=function(){

	var day=['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
	
	var $=function(id){
		return document.getElementById(id);
	};
	var $s=function(c){
		return document.getElementsByClassName(c);
	};
	var tlist=$s('tlist'),
		todayimg=$s('todayimg'),
		rightDay=$('rightDay'),
		allinfo=$('allinfo'),
		leftDate=$('leftDate'),
		topdate=$('topdate'),
		prev=$('prev'),
		nex=$('nex'),
		topdate=$('topdate'),
		border=$('border'),
		bigimg=$('bigimg');

	var date=new Date();
	var meiyuetianshu=[31,28,31,30,31,30,31,31,30,31,30,31];


	var addClass = function(el,s){
		var tmp = el.getAttribute('class').split(' ');
		var dict = {};
		for(i=0;i<tmp.length;i++){
			dict[tmp[i]] = true;
		}
		if(!dict[s]){
			el.setAttribute('class',el.getAttribute('class')+' '+s);
		}
	};
	var removeClass = function(el,s){
		var tmp = el.getAttribute('class').split(' ');
		var dict = {};
		for(i=0;i<tmp.length;i++){
			dict[tmp[i]] = true;
		}
		delete dict[s];
		var ns = '';
		for(var name in dict){
			ns += ' ' +  name;
		}
		el.setAttribute('class',ns);
	};
  	var isrunnian=function(year){
		if (year%4==0&&year%100!=0||year%400==0) {
			return true;
		}
		return false;
	};
	
  	var setmeiyuetianshu = function(year){
	    if( isrunnian(year) ){
	      	meiyuetianshu[1] = 29;
	    }
	};
	setmeiyuetianshu();

	var huarili=function(){
		setmeiyuetianshu();
		var i = 0;
		// 前一个月
		var tmp=date.getDate();
		date.setDate(1);
		var xingqi=date.getDay();
		date.setDate(tmp);

		L=xingqi==0?6:xingqi-1;
		var premonday;
		if (date.getMonth()-1 == -1) {
			premonday=31;
		}else{
			premonday=meiyuetianshu[date.getMonth()-1];
		}
		
		for (; i < L; i++) {
			tlist[i].innerHTML=premonday-(L-i-1);
			tlist[i].removeAttribute('id');
			tlist[i].style.color='#9A9A9A';
			tlist[i].setAttribute('prs',true);
		}
		
		// 当月
		for (; i <meiyuetianshu[date.getMonth()]+L; i++) {
			tlist[i].innerHTML=i-L+1;
			tlist[i].setAttribute('id','d'+(i-L+1));
			tlist[i].style.color='#3B3B3B';
			tlist[i].removeAttribute('prs');
			tlist[i].removeAttribute('net');
		};

		// 下一个月
		
		var D=i;
		var xia = (tlist.length-D)%7;
		console.log(D+xia,xia);
		for (; i <D+xia; i++) {
			tlist[i].innerHTML=i-D+1;
			tlist[i].removeAttribute('id');
			tlist[i].style.color='#9A9A9A';
			tlist[i].setAttribute('net',true);
		};

		for (; i < tlist.length; i++) {
			tlist[i].innerHTML='';
		};
	};
	huarili();


	var targetyear,targetmonth,targetdate;
	var previousDay=function(){
		var currentyear=date.getFullYear();
		var currentmonth=date.getMonth();
		var currentdate=date.getDate();

	
		targetdate=currentdate-1;
		if(targetdate==0){
			targetyear=currentyear;
			targetmonth=currentmonth-1;
			
			if (targetmonth==-1) {
				targetyear=currentyear-1;
				targetmonth=11;
			}
			if (targetmonth==1&&isrunnian(targetyear)) {
				meiyuetianshu[1]=29;
			}
			targetdate=meiyuetianshu[targetmonth];
		}else{
			targetmonth= currentmonth;
			targetyear=currentyear;
		}

		// console.log(targetyear,targetmonth,targetdate);
		date=new Date(targetyear,targetmonth,targetdate);
		// console.log(date.getFullYear(),date.getMonth()+1,date.getDate());
	};
	prev.onclick=function(){
		previousDay();
		huarili();
		onDateChange();
	};
	prev.onmousedown=function(e){
		e.preventDefault();
	};

	var nextDay=function(){
		var currentyear=date.getFullYear();
		var currentmonth=date.getMonth();
		var currentdate=date.getDate();

		targetdate=currentdate+1;
		targetmonth=currentmonth;
		if(targetdate>meiyuetianshu[targetmonth]){
			targetyear=currentyear;
			targetmonth=currentmonth+1;
			targetdate=1;
			if (targetmonth==12) {
				targetyear=currentyear+1;
				targetmonth=0;
			}
			if (targetmonth==1&&isrunnian(targetyear)) {	
				meiyuetianshu[1]=29;
			}	
		}else{
			targetmonth= currentmonth;
			targetyear=currentyear;
		}

		// console.log(targetyear,targetmonth,targetdate);
		date=new Date(targetyear,targetmonth,targetdate);
		// console.log(date.getFullYear(),date.getMonth()+1,date.getDate());
	};
	var shangyige;
	var onDateChange=function(){
		var le=document.getElementById('d'+date.getDate());
		if (shangyige) {
			removeClass(shangyige,'riqihover');
		}
		addClass(le,'riqihover');
		shangyige=le;
		var ss=date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日'+day[date.getDay()];
		allinfo.innerHTML=ss;
		leftDate.innerHTML=date.getDate();
		rightDay.innerHTML=day[date.getDay()];
		topdate.innerHTML=ss.slice(0,-3);
		qingqiutu();
		if (date.getDay()==0||date.getDay()==6) {
			timeline.style.background='#F3EFEF';
		}else{
			timeline.style.background='none';
		}

	};

	var ajax=function(o){
		var req = new XMLHttpRequest();
		req.open('get',o.url);
		req.send();
		req.onreadystatechange=function(){
			if (this.readyState==this.DONE&&this.status==200) {
				o.onsuccess(this.response);
			}
		}
	};
	var date2string=function(){
		return date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
	};
	
	var qingqiutu = function(){
		ajax({
			url:'http://localhost/daypicture?day='+date2string(),
			onsuccess:function(date){
				border.innerHTML='';
				if (date!='none') {
					date=JSON.parse(date);
					for (var i = 0; i < date.length; i++) {
						var img=document.createElement('img');
						img.setAttribute('class','todayimg');
						img.src= 'images/'+date[i];
						border.appendChild(img);
						
					}
					for (var i = 0; i < todayimg.length; i++) {
						todayimg[i].onclick = function(){
							bigimg.innerHTML='';
							var as=this.getAttribute('src');
							var im = document.createElement('img');
							bigimg.appendChild(im);
							bigimg.style.display='block';
							im.setAttribute('src',as);
							var close=document.createElement('div');
							close.setAttribute('id','closetu');
							close.innerHTML='x';
							bigimg.appendChild(close);
							close.onclick=function(){
								this.style.display='none';
								bigimg.style.display='none';
							}
	
						}
					}
				}	
			}
		});
	};
	gototoday.onclick=function(){
		location.reload();
	}
	
	onDateChange();
	nex.onclick=function(){
		nextDay();
		huarili();
		onDateChange();//根据日期更新页面显示,修改样式
	};
	nex.onmousedown=function(e){
		e.preventDefault();
	};
	tlist.onmousedown=function(e){
		e.preventDefault();
	};

	//日期点击时间
	for (var i = 0; i < tlist.length; i++) {
		tlist[i].onclick=function(){
			var a=date.getFullYear();
			var b=date.getMonth();
			var c=date.getDate();
			var x,y,z;//当前的year month date
			z=Number(this.innerHTML);
			if(this.hasAttribute('prs')){
				x=a;				
				y=b-1;
				if (y==-1) {
					x=a-1;
					y=11;
				}	
			}else if(this.hasAttribute('net')){
				x=a;
				y=b+1;
				if (y==12) {
					x=a+1;
					y=0;
				}
			}else{
				x=a;
				y=b;
			}
			date=new Date(x,y,z);
			huarili();
			onDateChange();
		};	
	}


	var timego = function(){
		var ty = new Date().getFullYear();
		var tm = new Date().getMonth()+1;
		var td = new Date().getDate();
		var th = new Date().getHours();
		var tmi = new Date().getMinutes();
		var shijian = ty+'年'+tm+'月'+td+'日';
		var h1 = new Date(ty,tm-1,td+1,0,0,0).valueOf() - new Date(ty,tm-1,td,0,0,0).valueOf();
		var h2 = new Date().valueOf() - new Date(ty,tm-1,td,0,0,0).valueOf();
		// console.log(h1,h2,h2/h1);
		NOWTIME.style.top = h2/h1*1344-13+'px';
		if (date.getMonth()==tm-1&&date.getFullYear()==ty) {
			document.getElementById('d'+td).style.color='red';
			if(topdate.innerHTML == shijian){
				NOWTIME.style.display = 'block';
				addClass(document.getElementById('d'+td),'jintian');
				document.getElementById('gototoday').style.color='#C7C7C7';
				document.getElementById('d'+td).style.color='#fff';

				if(th<=11){
					if(th<10){th='0'+th};
					if(tmi<10){tmi='0'+tmi};
					TIME.innerHTML ='上午'+th+':'+tmi;
				}else{
					th = th -12;
					if(th<10){th='0'+th};
					if(tmi<10){tmi='0'+tmi};
					TIME.innerHTML = '下午'+th+':'+tmi;
				}
			}else{
				removeClass(document.getElementById('d'+td),'jintian');
				NOWTIME.style.display = 'none';
				document.getElementById('gototoday').style.color='#FF3B30';
			}

		}
		
	}
	timego();
	var timerId = setInterval(timego,100);


};