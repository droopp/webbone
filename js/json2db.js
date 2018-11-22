/*
    Version: 0.1
	Author:  makarov
*/


//settings
var conection_data = {
	
	urlDb:"http://localhost:8080",
	urlMongo:"http://localhost:8080"

}


/*

Response object

	JSON object returned from db
			
*/

function get2Object(o) {

	//progressOn();
	//add userid 
	
	try{
	if (intiReq.params.user_id!=undefined){
		 user_id = intiReq.params.user_id;
		 o.root.params.user_id = user_id;
	}
	}catch(e){

	}

	//add user info
	
	try{
	if (intiReq.params.user_info!=undefined){
		  o.root.params.user_info = intiReq.params.user_info;
	}
	}catch(e){

	}

	  //
	  var xml2 ="";
	  try{
	  	//escape <> only if not exec.func
	  	if (o.root.name.indexOf("exec.")<0){
	  		 o.root.params = JSON.parse(JSON.stringify(o.root.params).replace(/</g,"&lt;").replace(/>/g,"&gt;"));
	  	}
	  	 
		 xml2 = json2xml({root:o.root});
	  }catch(e){
		$.notify(o.root.name + ": " + e, "error");	
		return;
	  }
	
	//fix &amp; makarov 29.02.2016
	xml2 = xml2.replace(/&#39;/g,"'");
	xml2 = xml2.replace(/&/g,"&amp;");
	
	var v_async = false;
	var filial = "";
	var deffered = "0";
	
	if (o.root.params.async!=undefined){
		v_async = o.root.params.async;
		
	}
	
	//deffered 
	if (o.root.params.deffered!=undefined){
		deffered = o.root.params.deffered;
		o.root.params.toLowerCase = false;
		
	}


	if (o.root.params.filial!=undefined){
		filial = o.root.params.filial;
		
	}else{
		try{
			if (intiReq.params.filial!=undefined){
				 filial = intiReq.params.filial;
				
			}
		}catch(e){

		}
		
	}

	var jqXHR = $.ajax({
						beforeSend: function (xhr) {
    						xhr.setRequestHeader ("Authorization", "JWT " + getCookie("access_token"));
						},
						type:"POST",
						url:conection_data.urlDb +  "/api/v1" + o.root.name,
						data:xml2,
						async:v_async,
						contentType:"text/plain; charset=utf-8",
					    dataType: "xml",
						success:function(r){		
							
							if (v_async!=false ){
									$.notify("ok", "success");	
							}
						
				    			
			    		},
						error:function(res){
							if (res.status!=401){
									 $.notify("error: " + JSON.stringify(res), "error");	
							}
						}
					});
					
	if (v_async!=false){
		return;
		
	}
		

	if (jqXHR.status == 401){
		location.hash = "login"
		location.reload(true)	
		return
	}else{
	  var response = jqXHR.responseText	
	}
	   

	//progressOff();

  //get from oracle
  
       //  external2.getXML=xml2;
       //  var response=external2.getXML

        //to lower
		if (o.root.params.toLowerCase!=false){
			response =   response.toLowerCase();
		}
		
    	  //response =   response.toLowerCase();
            var json = $.xml2json(response);
			
			//lower attribute{}
			/*var new_json={}	
			for(key in json){
			
				new_json[key.toLowerCase()] = json[key];

			}
			json = new_json;
			*/
			
			   //if error
               if (response==""){
              		 $.notify(o.root.name + ": no response from db", "error");
                     //return;
           	  	 }
			
			
             //if error
               if (response.indexOf('</error>')>0 && typeof json != 'object'){
              		 $.notify( o.root.name + ": " + json, "error");
                     return {error:json};
           	  	 }

            //if succsess
                 if (response.indexOf('</success>')>0){
              		 $.notify(json, "success");
           	  	 }


             //info

             if (json.information != undefined){
              		 $.notify(json.information, "info");
              }
		

            //to object
             if (typeof json != 'object'){
              json = {};
             }

   			return json;
}


/*

Response object

	JSON object returned from oracle
			
*/

function get2ObjectByTask(o) {


	var task_id = "";
	
	if (o.task_id!=undefined){
		task_id = o.task_id;
		
	}
	
	
	var jqXHR = $.ajax({
						type:"POST",
						url:conection_data.urlDb +  "/Soracle/Service?task_id=" + task_id,
						data:"<root></root>",
						async:false,
						contentType:"text/plain; charset=utf-8",
					    dataType: "xml",
						success:function(r){		
		
			    		},
						error:function(o){
						
									 $.notify(JSON.stringify(o), "error");	
							
						}
					}).responseText;
					
	
					
	var response = jqXHR;



        //to lower
		if (o.toLowerCase!=false){
			response =   response.toLowerCase();
		}
		
    	  //response =   response.toLowerCase();
            var json = $.xml2json(response);
			
			//lower attribute{}
			/*var new_json={}	
			for(key in json){
			
				new_json[key.toLowerCase()] = json[key];

			}
			json = new_json;
			*/
			
			   //if error
               if (response==""){
              		 $.notify("не получен ответ от db", "error");
                     //return;
           	  	 }
			
			
             //if error
               if (response.indexOf('</error>')>0 && typeof json != 'object'){
              		 $.notify(json, "error");
              		 throw true
                     return ;
           	  	 }

            //if succsess
                 if (response.indexOf('</success>')>0){
              		 $.notify(json, "success");
           	  	 }


             //info

             if (json.information != undefined){
              		 $.notify(json.information, "info");
              }
		

            //to object
             if (typeof json != 'object'){
              json = {};
             }

   			return json;
}



/*

Async request with callback
			
*/

function get2ObjectAsync(o,f) {
	
	//progressOn();

		//add userid 
	if (intiReq!=undefined){
		o.root.params.user_id = intiReq.params.user_id;
	}

	//add user info
		
	try{
	if (intiReq.params.user_info!=undefined){
		  o.root.params.user_info = intiReq.params.user_info;
	}
	}catch(e){

	}


	//


	var filial="";
	
	if (o.root.params.filial!=undefined){
		filial = o.root.params.filial;
		
	}else{
		try{
			if (intiReq.params.filial!=undefined){
				 filial = intiReq.params.filial;
				
			}
		}catch(e){

		}
		
	}

	var xml2 = json2xml({root:o.root});
	
	$.ajax({
						type:"POST",
						url:conection_data.urlDb + "/Soracle/Service?func=" + o.root.name + "&filial=" + filial,
						data:xml2,
						async:true,
						contentType:"text/plain; charset=utf-8",
					    dataType: "text",
						error:function(o){
						
									 $.notify(JSON.stringify(o), "error");	
							
						}
					}).done(function(data){		
							
						
								var response = data;

								if (o.root.params.toLowerCase!=false){
									response =   response.toLowerCase();
								}

								  //response =   response.toLowerCase();
									var json = $.xml2json(response);

							f(json);
							
				    			
			    		});
					
}


/*

Response object

	Script text returned from oracle
			
*/


function get2Script(o) {


	var xml2 = json2xml({root:o.root});

	var jqXHR = $.ajax({
						beforeSend: function (xhr) {
    						xhr.setRequestHeader ("Authorization", "JWT " + getCookie("access_token"));
						},
						type:"POST",
						url:conection_data.urlDb + "/Soracle/Service?func=" + o.root.name,
						data:xml2,
						async:false,
						contentType:"text/plain; charset=utf-8",
					    dataType: "xml",
					//	success:function(r){		
				    //			ajaxResponse = r;		
			    	//	},
						error:function(o){
							
									 $.notify(JSON.stringify(o), "error");	
							
						}
					}).responseText;
					
	var response = jqXHR;
	
	 var json = $.xml2json(response);
	 
	  //if error
               if (response.indexOf('</error>')>0){
              		 $.notify(json, "error");
                     return;
           	  	 }

            return json.script;
			
}			
			


/*

Request object
	root
		name: function name (pkg.function)
		params: 
			%param_name% : value,
			%param_name% : value,
			...
*/



function Request(n,p)
{
	
 	this.root = {
		name:n,
		params:p	
	}


	this.setParams=setParams;
	this.setParam = setParam;
	
	function setParams(p){
		
	    this.root.params=p;
	}
	
	function setParam(p,v){
		
	    this.root.params[p]=v;
	}
	
}


/*

Response object

	JSON object returned from mongo
			
*/


function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}


function get2Mongo(p, o) {
	
	var jqXHR = $.ajax({
						type:"POST",
						url:conection_data.urlMongo + p,
						data:JSON.stringify(o),
						async:false,
						contentType: "application/json; charset=utf-8",
					    dataType: "json",
						error:function(o){
							
								 //$.notify(JSON.stringify(o), "error");	
							
						}
					});
					

   			return jqXHR;
}




//makarov 30.11.2015
var d_lock = 0;
function get2Delphi(e){


//only one jscript function can run
if (d_lock ==1 ){
    return;
}else{
    d_lock = 1;
}


try{

var t=json2xml({root:e.root});

        external2.getXML=t;
        var n=external2.getXML;
		
		//get clear json from jscript
		if (e.root.name == "delphi"){
			
			return n;
		}
		
		
		var r=$.xml2json(n);
		
		if(n.indexOf("</error>")>0){
			return r
			}	
			
	 	if(typeof r!="object"){
			r={}
			}
			
			return r;
	
		}catch(e){	
				 $.notify("no delphi context..", "error");	
				 
		}finally{
			 d_lock = 0;
		}		
	
			
}
	
	





