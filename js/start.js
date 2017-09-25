
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

if(location.hash == ""){ 		

  location.hash="drop"
  location.reload(true)


 }else{
		executeApp(location.hash.substring(1));
 }
	

});
