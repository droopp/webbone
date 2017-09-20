
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

    	if (o.get("login") != "admin" || o.get("passwd")!="admin123"){

    		$("#d_v_button").notify("Bad login or passwd!","error")
    	}else{

			executeApp("drop")

    	}
    }
});


Render(new LabelView(o,"label"),"app");
Render(new LabelView(o,"desc"),"app");

//Render(new MemoView(o,"memo"),"app");


Render(new InputView(o,"v_login"),"app");
Render(new InputView(o,"v_passwd"),"app");

Render(new v_b(o,"v_button"),"app");



