function jsonStr(data){
    var arr=[];

    data.t=Math.random();
    for(var name in data){
        arr.push(name+'='+data[name]);
    }

    return arr.join('&');
}
function ajax(json){
    json=json|| {};
    if(!json.url)return;
    json.type=json.type || 'GET';
    json.cbName=json.cbName || 'cb';
    json.time=json.time || '3000';
    json.data=json.data || {};

    if(window.XMLHttpRequest){
        var oAjax=new XMLHttpRequest();
    }else{
        var oAjax=new ActiveXObject('Microsoft.XMLHTTP');
    }

    switch(json.type.toUpperCase()){
       case 'GET':
            oAjax.open('GET',json.url+'?'+jsonStr(json.data),true);
            oAjax.send();
            fnReady();
            break;
       case 'POST':
            oAjax.open('POST',json.url,true);
            oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
            oAjax.send(jsonStr(json.data));
            fnReady();
            break;
       case 'JSONP':
               var fnName='jsonp'+Math.random();
               fnName=fnName.replace('.','');

               window[fnName]=function (json1){
                   json.success && json.success(json1);

                   clearTimeout(json.timer);
                   oHead.removeChild(oS);
               };

               json.data[json.cbName]=fnName;

               var arr=[];
               for(var name in json.data){
                   arr.push(name+'='+json.data[name]);
               }

               var oS=document.createElement('script');
               var oHead=document.getElementsByTagName('head')[0];
               oS.src=json.url+'?'+arr.join('&');
               oHead.appendChild(oS);
            break;
    }

    function fnReady(){
        oAjax.onreadystatechange=function(){
            if(oAjax.readyState==4){
                if(oAjax.status>=200 && oAjax.status<300 || oAjax.status==304){
                    json.success && json.success(oAjax.responseText);
                    clearTimeout(json.timer);
                }else{
                    json.error && json.error(oAjax.status);
                    clearTimeout(json.timer);
                }
            }
        };
    }

    json.timer=setTimeout(function(){
        oAjax.onreadystatechange=null;
        alert('网络超时')
    },json.time);

}
var $={};
$.ajax=ajax;