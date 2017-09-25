
EditEnable=0;

getAppSettings("login");




var o = newAppObject({
					  text:"Drop!",
					  desc:"Distributed Reliable Operations Platform",
					  login:"",
					  passwd:""
					 });


var v_b = ButtonView.extend({

    click:function(){

    	r = get2Mongo("/auth", {username:o.get("login") , 
    							password:o.get("passwd")})


    	if (r.status==401){

    		$("#d_v_button").notify("Bad login or passwd!","error")
    	}else{
 			
    		setCookie("access_token", r.responseJSON.access_token, {expires: 3600})	
			location.hash="drop"
			location.reload(true)

    	}
    }
});


Render(new LabelView(o,"label"),"app");
Render(new LabelView(o,"desc"),"app");

//Render(new MemoView(o,"memo"),"app");


Render(new InputView(o,"v_login"),"app");
Render(new InputView(o,"v_passwd"),"app");

Render(new v_b(o,"v_button"),"app");



