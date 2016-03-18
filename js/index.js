window.onload=function(){
	var canvas=document.querySelector('#canvas');
	var canvas1=document.querySelector('#canvas1');
	var ctx=canvas.getContext('2d');
	var ctx1=canvas1.getContext('2d');

	//创建棋盘
	var createqipan=function(){
		//清除原先的画板
		ctx1.clearRect(0,0,600,600);
		//画15根横线
		for(var i=0;i<15;i++){
			ctx1.beginPath();
			ctx1.moveTo(20,i*40+20.5);
			ctx1.lineTo(580,i*40+20.5);
			ctx1.stroke();
		}
		//画15根竖线
		for(var i=0;i<15;i++){
			ctx1.beginPath();
			ctx1.moveTo(i*40+20.5,20);
			ctx1.lineTo(i*40+20.5,580);
			ctx1.stroke();
		}
		//画棋盘四点
		var z=[140.5,460.5];
		for(var i=0;i<z.length;i++){
			for(var j=0;j<z.length;j++){
				ctx1.beginPath();
				ctx1.arc(z[i],z[j],4,0,Math.PI*2);
				ctx1.fill();
			}
		}
		//画棋盘中点
		ctx1.beginPath();
		ctx1.arc(300.5,300.5,4,0,Math.PI*2);
		ctx1.fill();
	}
	createqipan();
	//下落棋子
	var luozi=function(x,y,color){
		var zx=x*40+20.5;
		var zy=y*40+20.5;

		var white=ctx.createRadialGradient(zx-7,zy-7,1,zx,zy,18);
		white.addColorStop(0.3,"#fff");
		white.addColorStop(1,"#ccc");

		var black=ctx.createRadialGradient(zx-7,zy-7,1,zx,zy,18);
		black.addColorStop(0.1,"#ccc");
		black.addColorStop(1,"#000");

		ctx.fillStyle=color?black:white;
		ctx.beginPath();
		ctx.arc(zx,zy,18,0,Math.PI*2);
		ctx.fill();
	}
	//luozi(3,3,true);
	//luozi(4,4,false);

	var judge=function(x,y,color){
		var shuju=filter(color);//将白棋 黑棋 分别存放在一个新对象内
		var tx,ty,hang=1,shu=1,zuoxie=1,youxie=1;

		//当(x,y)附近的棋子与(x,y)的棋子颜色一致时,逐步判断
		//xy(tx-1,ty) 返回值为qizi对象中的值
		//while(shuji[xy(tx-1,ty)] 当下落的棋子的左边有相同颜色棋子的时候存储在r对象中.shuji[xy(tx-1,ty)]返回值为真,执行循环体
		tx=x;ty=y;while(shuju[xy(tx-1,ty)]){tx--;hang++};
		tx=x;ty=y;while(shuju[xy(tx+1,ty)]){tx++;hang++};
		if(hang>=5){return true;}

		tx=x;ty=y;while(shuju[xy(tx,ty-1)]){ty--;shu++};
		tx=x;ty=y;while(shuju[xy(tx,ty+1)]){ty++;shu++};
		if(shu>=5){return true;}

		tx=x;ty=y;while(shuju[xy(tx+1,ty-1)]){tx++;ty--;zuoxie++};
		tx=x;ty=y;while(shuju[xy(tx-1,ty+1)]){tx--;ty++;zuoxie++};
		if(zuoxie>=5){return true;}

		tx=x;ty=y;while(shuju[xy(tx+1,ty+1)]){tx++;ty++;youxie++};
		tx=x;ty=y;while(shuju[xy(tx-1,ty-1)]){tx--;ty--;youxie++};
		if(youxie>=5){return true;}
	}
	var xy=function(x,y){
		return x+'_'+y;
	}
	var filter=function(color){
		var r={};
		for(var i in qizi){
			if(qizi[i]==color){
				r[i]=qizi[i];
			}
		}
		return r;
	}

	var flag=localStorage.x?false:true;//该谁落子
	//var flag=true;
	var qizi={};
	var t1;
	var p;
	canvas.onclick=function(e){
		p=0;
		clearInterval(t1);
		//console.log(p)
		var x=Math.round((e.offsetX-20.5)/40);
		var y=Math.round((e.offsetY-20.5)/40);
		if(qizi[x+'_'+y]){return;}
		luozi(x,y,flag);
		
		qizi[x+'_'+y]=flag?'black':'white';

		if(flag){
			if(judge(x,y,'black')){
				alert("黑棋赢");
				if(confirm("是否再来一盘")){
					localStorage.clear();
					location.reload();
					qizi={};
					flag=true;
					return;
				}
				else{
					canvas.onclick=null;
				}
			}
		}
		else{
			if(judge(x,y,'white')){
				alert("白棋赢");
				if(confirm("是否再来一盘")){
					localStorage.clear();
					location.reload();
					qizi={};
					flag=true;
					return;
				}
				else{
					canvas.onclick=null;
				}
			}
		}
		flag=!flag;
		
		drawClock();
		t1=setInterval(drawClock,1000);
		localStorage.da=JSON.stringify(qizi);
		//落黑子时本地存储数据x=1,落白子时清除本地数据x=1
		if(!flag){
			localStorage.x=1;
		}
		else{
			localStorage.removeItem('x');
		}
	}
		//localStorage  本地保存数据
    	//JSON.stringify(obj)对象转字符串
   		//JSON.parse(str)字符串转对象
/*	*/	huiqi.onclick=function(){
			da=JSON.parse(localStorage.da);
			if(JSON.stringify(da)==0){
				huiqi.onclick=null;
				return;
			}
			var xyqizi=[];
			var colorqizi=[];
			for(var i in da){
				xyqizi.push(i);
				colorqizi.push(da[i]);
			}
			xyqizi.pop();
			colorqizi.pop();
			for(var i=0;i<colorqizi.length;i++){
				var x=xyqizi[i].split('_')[0];
				var y=xyqizi[i].split('_')[1];
				luozi(x,y,(colorqizi[i]=='black')?true:false);
				if((colorqizi[i]=='black')?true:false){
					localStorage.x=1;
				}
				else{
					localStorage.removeItem('x');
				}
			}
			da={};
			for(var i=0;i<xyqizi.length;i++){
				var x=xyqizi[i].split('_')[0];
				var y=xyqizi[i].split('_')[1];
				da[x+'_'+y]=colorqizi[i];
				if((colorqizi[i]=='black')?true:false){
					localStorage.x=1;
				}
				else{
					localStorage.removeItem('x');
				
				}
			}
			localStorage.da=JSON.stringify(da);
			location.reload();

		}
	

	/*如果本地存储过程中有棋盘数据 读取这些数据并绘制到棋盘中 页面刷新时不会更新 可以保留上次的棋盘*/
	if(localStorage.da){
		qizi=JSON.parse(localStorage.da);
		for(var i in qizi){
			var x=i.split('_')[0];
			var y=i.split('_')[1];
			luozi(x,y,(qizi[i]=='black')?true:false);
		}
	}
	

	chongzhi.onclick=function(){
		localStorage.clear();
		location.reload();
	 }
	


//钟表
//创建表盘
	var canvas2=document.querySelector("#canvas2");
	var ctx2=canvas2.getContext('2d');
	p=0;
	var drawClock=function(){
		ctx2.clearRect(0,0,200,200);
		ctx2.save();
		ctx2.translate(100,100);

			//画表盘
			ctx2.save();
			ctx2.strokeStyle="#2af";
			ctx2.lineWidth=8;
			ctx2.beginPath();
			ctx2.arc(0,0,80,0,Math.PI*2);
			ctx2.stroke();
			ctx2.restore();

			//画刻度
			ctx2.save();
			ctx2.strokeStyle="white";
			ctx2.lineWidth=4;
			ctx2.lineCap='round';
			for(var i=1;i<61;i++){
				ctx2.rotate(Math.PI/30);
				ctx2.beginPath();
				if(i%5==0){
					ctx2.lineWidth=3;
					ctx2.moveTo(64,0);
				}
				else{
					ctx2.lineWidth=2;
					ctx2.moveTo(68,0);
				}
				ctx2.lineTo(72,0);
				ctx2.stroke();
			}
			ctx2.restore();

			//画秒针
			ctx2.save();
			//console.log(p);
			ctx2.rotate(Math.PI/30*p);
			p++;
			//console.log(x)
			ctx2.lineWidth=2;
			ctx2.strokeStyle="red";
			ctx2.lineCap='round';
			ctx2.beginPath();
			ctx2.moveTo(0,10);
			ctx2.lineTo(0,-60);
			ctx2.stroke();
			ctx2.restore();

			//画圆圈
			ctx2.save();
			ctx2.lineWidth=2;
			ctx2.strokeStyle='white';
			ctx2.beginPath();
			ctx2.moveTo(2,0);
			ctx2.arc(0,0,2,0,Math.PI*2);
			ctx2.stroke();
			ctx2.restore();

			// //画分针
			// ctx2.save();
			// ctx2.lineCap='round';
			// ctx2.strokeStyle='blue';
			// ctx2.lineWidth=3;
			// ctx2.beginPath();
			// ctx2.moveTo(0,10);
			// ctx2.lineTo(0,-52);
			// ctx2.stroke();
			// ctx2.restore();

			// //画时针
			// ctx2.save();
			// ctx2.lineWidth=4;
			// ctx2.lineCap='round';
			// ctx2.beginPath();
			// ctx2.moveTo(0,10);
			// ctx2.lineTo(0,-42);
			// ctx2.stroke();
			// ctx2.restore();

		ctx2.restore();
	}
	drawClock();
	
	
}