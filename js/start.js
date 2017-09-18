
$( document ).ready(function() {

EditEnable = 0;


// center app on resize
if (EditEnable==0){
	$("#app").css({left:($(window).width()-1146)/3 + "px"});
	$(window).resize(function(){
		$("#app").css({left:($(window).width()-1146)/3 + "px"});
	});
}

//entry point

if(typeof intiReq != 'object' ){ 		

 intiReq = {func:"executeApp",
 			params:{
                		name:"login",
                		id:"login"
 			}}


 }else{
		location.hash = JSON.stringify(intiReq);
 }

	if (location.hash!=""){
		intiReq = JSON.parse(location.hash.substring(1));
	}

							if (intiReq.func =="openEntity"){
								openEntity(intiReq.params);
								
							}else{ 
							
								//call with params
									o = newAppObject(intiReq.params);	
									addToAppRequest(o);			
									executeApp(intiReq.params.name);
							}
	

});
