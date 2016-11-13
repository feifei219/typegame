//兼容性的通过类名获取元素
//第一个参数 classname 表示类名
//第二个参数 context 表示获取的范围
function getClass(classname,context){
	context=context||document;
	if(document.getElementsByClassName){
		return  context.getElementsByClassName(classname)
	}else{
		var all=context.getElementsByTagName("*")
		var newarr=[];
		for (var i = 0; i < all.length; i++) {
			 if(check(all[i].className,classname)){
			 	newarr.push(all[i])
			 }
		};
	}
	return newarr;
}

//在某个长字符串中是否包含一个短字符串
function check(lstr,str){
	var arr=lstr.split(" ")
	for (var i = 0; i < arr.length; i++) {
		if(arr[i]==str){
			return true;
		}
	};
	return false;
}


//兼容性的获取或者设置元素的内容
//第一个参数 ele 表示要操作的元素
//第二个参数 text 表示要设置的内容
//如果只是获取则不需要传值

 function text(ele,text){
     	if (text!=undefined) {
     		if (document.getElementsByClassName) {
	             ele.textContent=text;
	     	}else{
	     		 ele.innerText=text;
	     	}
	    }else {
	     	if (document.getElementsByClassName) {
	            return ele.textContent;
	     	}else{
	     		return ele.innerText;
	     	}
	    }
}


//兼容性的获取某一元素的样式
//ele 要获取样式的元素
//attr 要获取的具体的样式
 function getStyle(ele,attr){
     if (window.getComputedStyle) {
        return window.getComputedStyle(ele,null)[attr];
     }else{
        return ele.currentStyle[attr];
     }
 }


 //动画函数 
 //obj 要进行动画的对象 
 //attrobj  属性以及目标值对象 
 //dur 持续的时间  可以不传 
 //callback 

// function animate(obj,attrobj,dur,callback){
//  			var speed={};
//  			for(var i in attrobj){
//  				var old=getStyle(obj,i);
//  				old=parseInt(old);
//  				speed[i]=(attrobj[i]-old)*60/dur;
//  			}
//  			var t=0;
//  			obj.t=setInterval(function(){
// 	 			for(var i in attrobj){
// 	 				var now=parseFloat(getStyle(obj,i));
// 	 				now+=speed[i];
// 	 				obj.style[i]=now+"px";
// 	 			}
// 	 			t+=60;
// 	 			if(t>=dur){
// 	 				clearInterval(obj.t);
// 	 				for(var i in attrobj){
// 	 					obj.style[i]=attrobj[i]+"px";
// 	 				}	
// 	                if(callback){
// 						callback.call(obj);
// 					}
// 	 			}
//  		    },60)
//  		}

        
// 区分 类名  id  标签名
//context表示获取的范围
function $(selector,context){
	if(typeof selector=="string"){
		context=context||document;
		
		//正则  消除空格  ^代表开始  $代表结束   g代表全局
		selector=selector.replace(/^\s+|\s+$/g,"");

		if (selector.charAt(0)==".") {
			return getClass(selector.slice(1),context);

		}else if(selector.charAt(0)=="#"){
			return document.getElementById(selector.slice(1));
		}else{
			return context.getElementsByTagName(selector);
		}
	}else if(typeof selector=="function"){
		// window.onload=selector;
		addEvent(window,"load",selector)
	}
	
}


//节点

//只获取一个元素的所有子节点
	function getChildren(obj){
		var arr=obj.childNodes;
		var newarr=[];
		for (var i = 0; i < arr.length; i++) {
			if(arr[i].nodeType==1){
				newarr.push(arr[i])
			}
		}
		return newarr;
	}
//获取第一个子节点
	function getFirst(obj){
		return getChildren(obj)[0];
	}
//获取最后一个子节点
	function getLast(obj){
		var arr=getChildren(obj);
		return arr[arr.length-1];
	}
//获取下一个子节点
	function getNext(obj){
		var next=obj.nextSibling;
		if(next==null){
			return null;
		}
		while(next.nodeType!=1){
			next=next.nextSibling;
			if(next==null){
				return null;
			}
		}
		return next;
	}

//获取上一个子节点
	function getPrev(obj){
		var prev=obj.previousSibling;
		if(prev==null){
			return null;
		}
		while(prev.nodeType!=1){
			prev=prev.previousSibling;
			if(prev==null){
				return null;
			}
		}
		return prev;
	}


//兼容的获取当前可视窗口对象

	function getWindow(){
		document.documentElement.scrollTop=1;
		if(document.documentElement.scrollTop==1){
			return document.documentElement;
		}else{
			return document.body;
		}
	}



//获取某一个元素的文档坐标

function  getPosition(obj){
	var left=obj.offsetLeft;
	var top=obj.offsetTop;
	var parent=obj.parentNode;
	// var parent=obj.offsetParent;
	while(parent.nodeName!="BODY"){
		if(getStyle(parent,"position")=="absolute"||getStyle(parent,"position")=="relative"){
			left+=parent.offsetLeft+parseInt(getStyle(parent,"borderLeftWidth"));
			top+=parent.offsetTop+parseInt(getStyle(parent,"borderTopWidth"));
		}
		parent=parent.parentNode;
		// parent=parent.offsetParent;
	}
	return {x:left,y:top}
}




//兼容的添加事件监听   注销事件


//参数一  表示 事件源
//参数一  表示 事件名称
//参数一  表示 处理程序

//添加
		function  addEvent(obj,event,handler){
			if(obj.addEventListener){
				obj.addEventListener(event,handler,false)
			}else{
				obj.attachEvent("on"+event,handler,false)
			}
		}


//注销
		function  removeEvent(obj,event,handler){
			if(obj.addEventListener){
				obj.removeEventListener(event,handler,false)
			}else{
				obj.detachEvent("on"+event,handler,false)
			}
		}


//给对象添加滚轮事件的函数
//obj 要添加事件的对象
//upfun 向上滚动要触发的回调函数
//downfun 向下滚动要触发的回调函数
function mousewheel(obj,upfun,downfun){
    if(obj.addEventListener){
   		obj.addEventListener("mousewheel",scrollfun,false)    //火狐
   		obj.addEventListener("DOMMouseScroll",scrollfun,false) //谷歌
    }else{
    	obj.attachEvent("onmousewheel",scrollfun)    //ie
    }
    function scrollfun(e){
 		var ev=e||window.event;   
 		var dir=ev.detail||ev.wheelDelta;
 		if(dir==-3||dir==120){      //谷歌 -3  上
 			upfun.call(obj)
 		}else if(dir==3||dir==-120){
 			downfun.call(obj)
 		}
    }
}



//hover
//判断某个元素是否包含有另外一个元素
function contains (parent,child) {
	if(parent.contains){
		return parent.contains(child) && parent!=child;
	}else{
		return (parent.compareDocumentPosition(child)===20);
	}
}

//判断鼠标是否真正的从外部移入，或者是真正的移出到外部；
function checkHover (e,target) {
	if(getEvent(e).type=="mouseover"){
		return !contains(target,getEvent(e).relatedTarget || getEvent(e).fromElement)&&
			!((getEvent(e).relatedTarget || getEvent(e).fromElement)===target)
	}else{
		return !contains(target,getEvent(e).relatedTarget || getEvent(e).toElement)&&
			!((getEvent(e).relatedTarget || getEvent(e).toElement)===target)
	}
}
//鼠标移入移出事件
/*
 obj   要操作的对象
 overfun   鼠标移入需要处理的函数
 outfun     鼠标移除需要处理的函数
 */
function hover (obj,overfun,outfun) {
	if(overfun){
		obj.onmouseover=function  (e) {
			if(checkHover(e,obj)){
				overfun.call(obj,e);
			}
		}
	}
	if(outfun){
		obj.onmouseout=function  (e) {
			if(checkHover(e,obj)){
				outfun.call(obj,e);
			}
		}
	}
}
function getEvent (e) {
	return e||window.event;
}