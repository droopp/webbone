/*
  makarov 13/12/26
  
  Base modul:
             1. saving model setting  Backbone.sync
             2. base widet and view object 

*/

//Edit privilegis
//if 1 then you make change position widget



var EditEnable = 0;


////////////////Router/////////////////////////
/*var Router = Backbone.Router.extend({

  routes: {
    "app/:query":        "app",  // #search/kiwis
  },

  app: function(query) {

    executeApp0(query);

  }

});

var router = new Router(); // Создаём контроллер
Backbone.history.start();  // Запускаем HTML5 History push    
*/

///////////////////////////SYNC Settings//////////////////////// 
 
//settings for model
Backbone.sync = function(method, model, options) {

   switch (method) {
            case "read": "";//read from oracle
                break;
            case "delete": ""; //delete from oracle
                break;
            case "update": ""; //update to oracle
                 // ;
                break;
        }

};

function leftTrim(s) {
	return s.replace(/^\s+/,"");
}



function isRussianCharacters(s) {
	return (s.replace(/[а-яА-Я]/g,"").length==0);
}


//model daya
var ModelData = Backbone.Model.extend({

 validate: function(attrs, options) {
            
  }

 });

function BuildMenuSetting(o){

 var menu = {actions:{values:[],labels:[]},back:{values:[],labels:[]},forw:{values:[],labels:[]},info:{values:[]}};
	var data = getJSONObject("get_entity_actions_by_objid",o);

    var tmp = parseItem(data.behavior.action);
		menu.actions.values =tmp.values;
		menu.actions.labels =tmp.labels;

     var tmp = parseItem(data.back.action);
		menu.back.values =tmp.values;
		menu.back.labels =tmp.labels;
        
     var tmp = parseItem(data.forw.action);
		menu.forw.values =tmp.values;
		menu.forw.labels =tmp.labels;
		
		
	//get info state
    
    for(key in data.info.action){
		
		menu.info.values.push(data.info.action[key]);
		
	}
     	
	//	menu.info.values = ["дата: " + context.systemdate,"юзер: " + context.user_id,"отделение: " + context.branch,"точка: " + o.id];
		

return menu;
}


function setComboCache(data) {
			
		for (i in data){ 

		if (data[i].root.src!=undefined){
		 var el = _.clone(data[i].root.src);

			if (!$.isArray(el)){
				el	= [];
				el.push(data[i].root.src);
			}	

			  combocache[AppName + i] = el;
		}	  
		
		}

	
}	

function getAttrSourceObjectAsync(attrs) {

	//run only change
	if (getAppModel(AppName).get("xchoose")!=undefined){
		vchoose = getAppModel(AppName).get("xchoose").replace(AppName,"");
		if (attrs.indexOf(vchoose) >= 0){
			attrs = [vchoose];	
		}else{
			return;
		}
		
	}

	var strfunc = " $.when(";
	
	//var vis =getAppModel(AppName).get("visible0");
	//if (vis==undefined){
		vis =getAppModel(AppName).get("visible");
	//}

	x_ch = getAppModel(AppName).get("xchoose");

	if (x_ch ==undefined){
		x_ch = "";
	}

	
	for (key in attrs){
		
		//getAppModel(AppName).set(attrs[key],"null",{silent:true});

	  //if ((vis[attrs[key]] == 1 && x_ch=="") || x_ch.indexOf(attrs[key])>0){	
	  if (vis[attrs[key]] == "1"){	
		strfunc = strfunc + "$.ajax({success: function(data){getAppModel(" +
			AppName + ").set('"+attrs[key].toString()+"',getJSONObject('get_attrs_source',{eobj_id:"+getAppModel(AppName).get("eobj_id")+",entity_key:'"+AppName+"',attr_key:'"+attrs[key]+"'})."+attrs[key]+");" +
           "}}),";
	  }
	  
	}
	
	strfunc = strfunc.substr(0,strfunc.length-1) + " ).then( function(){return;});"
	
  try{	
	eval(strfunc);
  }catch(e){
	  
  }

}





function IntArrToStrArr(arr,desc){
	
	var strArr = [];
	
	for (i in arr){
		strArr.push({
					value:arr[i].toString(),
					label:arr[i].toString(),
					desc:arr[i].toString()
				});		
	} 

	return strArr;
	
}

//makarov 24.09.2015 add overloading
function refreshElement(o, entity) {
	
	if (entity!=undefined){
		getAppModel(entity).set(getJSONObject("get_entity_chunck_by_objid",
											{eobj_id:getAppModel(entity).get("eobj_id"),attr:o}));
	}else{
		getAppModel(AppName).set(getJSONObject("get_entity_chunck_by_objid",
											{eobj_id:getAppModel(AppName).get("eobj_id"),attr:o}));
	}

}

function refreshEntity(o) {
	
	$.ajax({
	         cache:false, 
                 beforeSend: function() {
      			
                 	 createProgress();
      
                },
                complete: function(data, textStatus, xhr) {
						
					//get invalid
					var invalid = o.invalid;
							
						o = newAppObject(o);
						
						
					//refresh model	
						o.set(getJSONObject('get_entity_chunck_by_objid',{eobj_id:o.get("eobj_id"),toLowerCase:false}));
						o.set({invalid:invalid});	
					
					//redraw model 	
						o.set({is_render:false});	

						addToAppRequest(o);
						
						deleteProgress();
						
						executeApp(AppName);

						//makarov 31.05.2015
                 		indexLoadedScripts.pop();

                }
	});

}


function Question(text,f){

var ret;
var question_settings = {
     params:{
		id:"question",
		view_id:"question",
		//app_name: "scoring_request_bm",
		height: "180",
		heigth_p: "50",
		left_p: "387",
		modal: "true",
		target: "app",
		title: "?",
		top_p: "214",
		value: "text",
		width: "420",
		width_p: "38"
	
    }
};

app_settings["question"] = question_settings;	
	
//question?
 var o_q=  newAppObject({text:text});
 var o_q_v = DialogModalView.extend(
    {
        ok: function(){	 
       	  f();

        },

        cancel: function(){
           return;
        }


    });


 Render(new o_q_v(o_q,"question"),"app");	
}


function parseItem(o) {

var values = [];
var labels = [];

 if (!$.isArray(o) && o!=undefined){
	
  labels[0]  =  o.name;


  //comment and add to t_webxml_script for more complex script
  //add step key
  
  
 try{
  var req  = "{eobj_id:" + getAppModel(AppName).get("eobj_id") + ",step_key:'" + o.id + "'}";
 }catch(e){
	 
	//alert(e); 
 }

   if (o.execution_context == "database"){
              values[0]  =  "in_" + o.id;
			  
			 if (o.confirm_msg==undefined||o.confirm_msg==""){
			  
			    loadedScripts[values[0]]  = "$('.notifyjs-foo-base .yes').trigger('click'); var ret = getJSONObjectDeffered('" + o.func_name + "'," + req + ",function(ret){"+
			   								 "refreshEntity({eobj_id:" + getAppModel(AppName).get("eobj_id") + ",id:'" + AppName + "',invalid:ret.invalid});});";
			 }else{
				 
			    loadedScripts[values[0]]  = "$('.notifyjs-foo-base .yes').trigger('click'); Question('"+o.confirm_msg +"',function(){ "+
			  						      "var ret = getJSONObjectDeffered('" + o.func_name + "'," + req + ",function(ret){refreshEntity({eobj_id:" + getAppModel(AppName).get("eobj_id") + ",id:'" 
			  						      																					+ AppName + "',invalid:ret.invalid});}); }); ";
				 
				 
			 }						

   }else {
             values[0]  =  o.id;

   }
   

  
 }else{


   //comment and add to t_webxml_script for more complex script
  //add step key
  
for (input in o){
	
 try{
  var req  = "{eobj_id:" + getAppModel(AppName).get("eobj_id") + ",step_key:'" + o[input].id + "'}";
 }catch(e){
	 
	//alert(e); 
 }
	
   labels[input]  =  o[input].name;

if (o[input].execution_context == "database"){
              values[input]  =  "in_" + o[input].id;
			  
			 if (o[input].confirm_msg==undefined||o[input].confirm_msg==""){
			    loadedScripts[values[input]]  = "$('.notifyjs-foo-base .yes').trigger('click'); var ret = getJSONObjectDeffered('" +  
			    o[input].func_name + "'," + req + ",function(ret){refreshEntity({eobj_id:" + getAppModel(AppName).get("eobj_id") + ",id:'" + AppName + "',invalid:ret.invalid});});";
			 }else{
				 
			  loadedScripts[values[input]]  = "$('.notifyjs-foo-base .yes').trigger('click'); Question('"+o[input].confirm_msg +"',function(){ "+
			  						      "var ret = getJSONObjectDeffered('" + o[input].func_name + "'," 
			  						      + req + ",function(ret){refreshEntity({eobj_id:" + getAppModel(AppName).get("eobj_id") + ",id:'" + AppName + "',invalid:ret.invalid});});" +
  									      "}); ";

			 }	

   }else {
             values[input]  =  o[input].id;


   }


 }
}

return {values:values,labels:labels};

}

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

var AppName;


var newAppSettings = {};

var loadedScripts = {};
var indexLoadedScripts  =[];

//if tru draw buttons ok cancel
var drawButns = true;

//save new application settings
var setAppSettings = function(o){

 //set app name to Request
 
 o.app_name = AppName;

	return get2Object(new Request("/settings/save",o));

 };


var changedEntity = new ModelData({});
 //get request for entity
var getEntityRequest = function(name){

//save non visible attr
if (getAppModel(name).changedAttributes()){
	changedEntity.set(getAppModel(name).changedAttributes());
}

//if (changedEntity.attributes!=undefined){
//	var request = changedEntity.attributes;
//}else{
//	var request = o.attributes;
//}

//check for undefined
			var attr = changedEntity.attributes;
			var request = {};
			for(i in attr){

				if (attr[i]!=undefined && typeof attr[i]!='object') {
					request[i] = attr[i];
				}
			}


//request.eobj_id =o.get("eobj_id");

  delete request.disabled;
  delete request.invisible;
  delete request.aftersave_call;
  delete request.deffered_call;

	return request;

 };



 //get request for entity


var saveEntity = function(o){

	//call aftef save function		
		try{
			//31.05.2016 save only enntity
             if (getAppModel(AppName)==undefined){
                  return;
             };

			//add deffered_call
			if (getAppModel(AppName).has("aftersave_call")) {

			var func = getAppModel(AppName).get("aftersave_call").func;
			getAppModel(AppName).unset("aftersave_call",{silent:true});
			if (func != undefined){
				saveEntity();
				getAppModel(AppName).set({_x:1});
				func();
			}

			}
		}catch(e){
			 $.notify(e,"error");
		}
		//return func 
		if (func!=undefined){
			getAppModel(AppName).set("aftersave_call",func,{silent:true});
		}
	
	if (o==undefined){
		name = AppName;
	}else{
		name = o.id;
	};


	var req = getEntityRequest(name);
   	     req.eobj_id = getAppModel(name).get("eobj_id")
   	     if (req.eobj_id==undefined){
   	     	req.eobj_id=0;
   	     }
   	     //deadlock?
	  	 req.async=false;
	
	//makarov 23.06.2015 request throw queue 
        var ret = get2Object(new Request("save_entity_data",req));
		//refresh 
	//	addToAppRequest(o);
     //if (ret == undefined){
         changedEntity.clear()
      //}

	//close window 
	  is_shown = false;
 	 //hide notification
 	 $('.notifyjs-foo-base').trigger('notify-hide');

 	 	return ret;
 };



var saveEntityAttrs = saveEntity;




var newAppTemplate = {};

//save new application template
var setAppTemplate = function(n,o){

 //set app name to Request
 o.app_name = n;

	return get2Object(new Request("save_template",o));

 };


//get app params request
var getAppRequest = function(){

            for (var n = 0; n < model_Collection.length; n++) {
           //  alert(JSON.stringify(model_Collection.models[n].attributes));
                 var r = model_Collection.models[n].attributes;

         			 if ($("#" + r.id).attr("grid") != undefined) {
           				 var i = model_Collection.models[n];

                        // alert(i.get("id"));
                          // alert(JSON.stringify($("#" + r.id).jqGrid("getRowData")));
            		 		i.set(i.get("source"), $("#" + r.id).jqGrid("getRowData"))
       					 }
            }
        return model_Collection.toJSON();

}

//add app params request
var addToAppRequest = function(o){

	 model_Collection.remove(o);
     model_Collection.add(o);

}

//add app params request
var getAppModel = function(o){


try{
	 return model_Collection.get(o);
	}catch(e){
		
		return "";
	} 
	 

}



//save new application template
var setAppTemplate = function(n){

var ret;

for(var i=0; i<model_Collection.length; i++ ) {


var o =  model_Collection.models[i].attributes;

//if grid ..save model
 if ($("#" + o.id).attr("grid")!= undefined){

    var m = model_Collection.models[i];
   	 m.set(m.get("source"),$("#" + o.id).jqGrid('getRowData'));
}

//set template name to Request
 o.app_name = n;

	ret = get2Object(new Request("save_template",o));

   if (!$.isEmptyObject(ret)){
         alert(ret);
         return;
      }
 }

	return ret;

 };



var delAppTemplate = function(n){

	ret = get2Object(new Request("delete_template",{app_name:n}));

   if (!$.isEmptyObject(ret)){
  	   	   alert(ret);
         return;
      }

	return ret;

 };

var getAppTemplate = function(n){

//get template
    var o = {app_name:n};
	      newAppTemplate = get2Object(new Request("get_templates",o));

for(var i=0; i<model_Collection.length; i++ ) {

var o =  model_Collection.models[i];

    var mid =  o.get("id");
   //clear
    o.clear();
    //set
    o.set(newAppTemplate[mid].params);

 //   alert(JSON.stringify(newAppTemplate[o.get("id")].params));
 //    alert(JSON.stringify(o));
 }

 return newAppTemplate;



 };

//add month to date
var addMonth = function(d,n){

	return new Date.parseExact(d,"dd.MM.yyyy").addMonths(n-1).toString("dd.MM.yyyy");;

 };

 var lastDay = function(d){
		return new Date.parseExact(d,"dd.MM.yyyy").moveToLastDayOfMonth().toString("dd.MM.yyyy"); 

 };


 //get aplication settings

var app_settings;
var context;

var app_settings_chache = {};


function getContext(){
	
		//init context
 if (context==undefined){
	  context = get2Object(new Request("get_context",{}));
	   context = context.context;
	}   
		
}

var getAppSettings = function(o){

//get settings
   AppName = o;
    var o = {app_name:AppName,toLowerCase:false};
	 
//TODO immutable cache	 
	 if (app_settings_chache[AppName]==undefined){
		 app_settings =undefined;
	
 	
 //load from server	
 
 try{
		 var jqxhr = $.ajax({
			cache: false, 
			async:false,
            url:"app_settings/"+AppName+".xml", 
            dataType: "xml"
        });
			
		if (jqxhr.status ==200){
			app_settings = $.xml2json(jqxhr.responseText);
		}	
		
		
	}catch(e){
		
	}
 
		 
		 if (app_settings==undefined){
	      app_settings = get2Object(new Request("/settings/get",o));	  
		 } 
		 if (app_settings == undefined){
		 	return false
		 }
		  
		  app_settings_chache[AppName] = JSON.stringify(app_settings); 
	}else
	{
		app_settings = JSON.parse(app_settings_chache[AppName]);
		
	}
	
    	  	return app_settings;

 };

//new object obj_sequence++
var obj_sequence =0;
 //get aplication objects
var getAppObject = function(n,p){

 	if (getAppModel(p.id)!=undefined && getAppModel(p.id).get("eobj_id")==p.eobj_id){

         	return new ModelData(getAppModel(p.id).attributes);
     }else{
    
    	    // var app_obj.id = p.id;
    			  var app_obj = get2Object(new Request(n,p));
			//add request data
				for(key in p){	
				//not rewrite eobj_id
				 if (key!="eobj_id"){	
					app_obj[key] = p[key];
				 }	
				}
			//add prefix
			app_obj.prefix = p.id;
    	       	return new ModelData(app_obj);
    }

 };


 //get aplication script
var getScript = function(n,p){
	
	    var script;
	
		try{
		var jqxhr = $.ajax({
			cache: false, 
			async:false,
            url : "app_scripts/" +p.name+".js",
            dataType: "scipt"
           
        });
			
			
		if (jqxhr.status ==200){
			script = jqxhr.responseText;
		}	
		
		
	}catch(e){
		
	}

		
		if (script==undefined){
			//load from server
				  script = get2Script(new Request(n,p));
			
		}	
    	  	return script;
 };


//get aplication objects
var getJSONObject = function(n,p){
	
	
/*	$.ajax({
                 beforeSend: function() {
      
                 	 createProgress();
      
                },
                complete: function(data, textStatus, xhr) {
*/					
			 	 var app_obj = get2Object(new Request(n,p));
	
//					deleteProgress();	 
					return app_obj;
/*							
					
                }
	});	
*/	
	
	 
			

 };


 //get aplication objects
var getJSONObjectDeffered = function(n,p,f){

//only one jscript function can run
if (d_lock ==1 ){
    return;
}else{
    d_lock = 1;
}


	$.ajax({
                 beforeSend: function() {
      
                 	 createProgress();
      
                },
                complete: function(data, textStatus, xhr) {

						try{		
						
						 var app_obj = get2Object(new Request(n,p));
							deleteProgress();	 
							f(app_obj);
							//add step_error
							if (app_obj.error!=undefined){
								getAppModel(AppName).set({estep_error:app_obj.error});	
							}else{
								getAppModel(AppName).unset("estep_error");	
							};
							

						}finally{
							d_lock = 0;						
						}		
					
                }
	});	
	
	    
				
 };

 //new aplication objects
var newAppObject = function(o){


          if (o.id == undefined){
               obj_sequence++;
               o.id = "model_" + obj_sequence;
			 
           }
		   //add prefix
		    o.prefix = o.id;
		   

  	if (getAppModel(o.id)!=undefined){

          	return getAppModel(o.id);
     }else{
    	  	return new ModelData(o);
    }
 };

///////////////////////////Base Objects/////////DON'T TOUCH THIS!!!/////////////// 

//collection of model data
var ModelDataAll = Backbone.Collection.extend({
  model: ModelData
});

//Request collection
/*var RequestData = Backbone.Model.extend({
    defaults: new Request()
 });

var RequestDataAll = Backbone.Collection.extend({
  model: Request
}); 
*/
 
//view settings data

var ViewData = function(o){
  
  return o;
    
 };
/*
var ViewDataAll = Backbone.Collection.extend({
  model: ViewData
}); 
*/ 
 
//Edit View 

var st_m;
var BaseViewEdit = Backbone.View.extend({

            initialize: function(model,options){

                                 this.model = model;   
                                 this.options = options;
                                 

                                //  _.bindAll(this, "render");
                                // this.model.bind('change', this.render);
                                 
                               //  _.bindAll(this, 'openEssay');

                                // this.template =  _.template(this.options.template),  //if need save many differn template then 
                                                                                        //load it dynamically from viewdata object

                               //  this.model.fetch(); //feth from serve .. see Backbone.sync read
                                 
                                // this.listenTo(this.model, 'change', this.render);
                               //  this.listenTo(this.model, 'destroy', this.remove);

                                 this.render();
                             
                                 
                               },

            render: function() {
                            this.$el.html( this.template({m:this.model.toJSON(),v:this.options}));
                            this.UI();
                            return this;
                          }
                          
                          
                          
    

         
   });
   
  
//DialogFormViewEdit//////////////////////////////////////////////////         
var DialogFormViewEdit =  BaseViewEdit.extend({
            template: _.template(""+         
                              "<div id='d_<%=m.id%>' title='<%=m.title%>' >" +
                                    "<form>" +     
                                      "<fieldset>"      +
                                        "<% for(var inputs in m.rows) { %>" +
                                        "<label id='<%=m.rows[inputs].id %>'><%=m.rows[inputs].label %></label>"+
                                         "<input type='text' id='<%=m.rows[inputs].id %>' value='<%=m.rows[inputs].value %>' class='newedit text ui-widget-content ui-corner-all'>"+
                                        " <% } %>" +
                                      "</fieldset>"+
                                    " </form>"+
                              "</div>"
            ),


            UI: function() {


            newAppSettings["id"] = this.model.id;

            this.$("#d_" + this.model.id).dialog({
              
                          autoOpen: true,
                          height: 300,
                          width: 350,
                          modal: true,
                          buttons: {
                            "save":  function() {

                              //save settings

                          
                             $("input.newedit").each(function() {
                                

                                newAppSettings[$(this).attr('id')] =$(this).val();

                              });

                              //positions
                               var p = $("#d_" + newAppSettings.id);

                              // alert(p.attr("id"));

                                  newAppSettings["top_p"] = p.position().top;
                                  newAppSettings["left_p"] = p.position().left;
                                  newAppSettings["width_p"] = p.width();
                                  newAppSettings["heigth_p"] = p.height();

                                  setAppSettings(newAppSettings);
                              
                               $( this ).dialog( "close" );
                               
                            },
       
                            "cancel": function() {
                              $( this ).dialog( "close" );
                            }
                          }
                        });



            //alert(JSON.stringify(this.model))


            }

   });   



//view

var model_Collection = new ModelDataAll();
var renderObjAttr = true;
var BaseView = Backbone.View.extend({

            initialize: function(model,options){
                           
                                 this.model = model;

                                 //add model to collection

                                 if (this.model.get("tmpl") == true){

                                 	 model_Collection.remove(model);
                                 		 model_Collection.add(model);
                                 }

                                 this.options = app_settings[options];

                                 //if did't found
                                 if (this.options == undefined){
                                   this.options = def_options;
                                 }

                                // this.template =  _.template(this.options.template),  //if need save many differn template then
                                                                                        //load it dynamically from viewdata object

                               //  this.model.fetch(); //feth from serve .. see Backbone.sync read
                               //  this.model.bind('change', this.refresh, this);
                                
                                //!!!!!!!! DEVIDE 
								
								if (this.options.params["class"]!="" || renderObjAttr){
									if (this.options.params.source !=undefined && this.options.params.source!="" 
										&& (this.options.params["class"]=="reftableview" || this.options.params["class"]=="gridview")
									){
											 this.listenTo(this.model, 'change:'+ this.options.params.source, this.render);
									 }else{
										 
										 this.listenTo(this.model, 'change:'+ this.options.params.value, this.render); 
										
										//showSaveDialog	
										 //this.listenTo(this.model, 'change:'+ this.options.params.value, function(){
										 //	saveEntityAttrs(this.model);
										 //}); 
										
									 }
								
								}else{
									
									//if (this.options.params.value.slice(",").length>1){}
									 this.listenTo(this.model, 'change', this.render);
								}
								
                                
                                 this.listenTo(this.model, 'destroy', this.remove);

                                 this.render();

                               },

           render: function() {


					    focusedElementId = $(':focus').attr('id');

                        //for row
                            var newop = this.options.params;
                         //      alert(JSON.stringify(newop));
                       if (newop.value != undefined){

                                nv = newop.value;
                                cp = newop.label;
                                nv = nv.split(",");

                            if (nv.length> 1){
                                cp = cp.split(",");
                                newop.values = nv;
                                newop.labels = cp;
                            }
                       }

                      //  alert(JSON.stringify(newop));

                            this.$el.html( this.template({m:this.model.toJSON(),v:this.options.params}));
                            this.UI();
                            this.addUI();
                            this.Edit();
							
						   $('#' + focusedElementId).focus();
	
                            return this;
                          },

            //for complex views
            addUI:  function() {
				
				//ENTER TO TAB
				/*		
					this.$("#" + this.options.params.view_id).on("keypress", function(e) {
						/* ENTER PRESSED*/
				//	try{	
				//		if (e.keyCode == 13) {
				//			/* FOCUS ELEMENT */
				//			var inputs = $('input');
				//			var idx = inputs.index(this);
			//
			//				if (idx == inputs.length - 1) {
			//					inputs[0].select()
			//				} else {
			//					inputs[idx + 1].focus(); //  handles submit buttons
			//					//inputs[idx + 1].select();
			//				}
			//				return false;
			//			}
			//		}catch(e){}	
			//			});
			//	*/		
				
                //  applyDisabled(this.model,this.options.params);
                //  alert(this.$("#" + this.options.params.view_id).css('opacity', 0.7));

            },

            //edit widget on runtime              
            Edit:  function() {
            
            if (EditEnable == 1){
                         //button for open edit window
                          this.$("#d_" + this.options.params.view_id).prepend( "<button class = 'edit_comp ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-state-hover'>_edit_</button>" );
                        //  this.$("#d_" + this.options.params.view_id).css('width', '25%');
                          this.$("#d_" + this.options.params.view_id).css('backgroundColor', '#99FFCC');
                          this.$("#d_" + this.options.params.view_id).css('opacity', 0.7);
                          this.$("#d_" + this.options.params.view_id).draggable();
                          this.$("#d_" + this.options.params.view_id).resizable();


            }
			else{
           if (this.$("#d_" + this.options.params.view_id).attr("grid") == 'true'){
               this.$("#d_" + this.options.params.view_id).remove();
              }
            }


            }
   });


//saveModelForm()

function saveModelForm(o,m){
	
	    //ligth ok
		$("#d_correct_ok").css("opacity",1.0);		

	//hack for input guide view
		if (o.params["class"]!= "inputguideview"){	
         $("#d_" + o.params.view_id + " ._data").each(function() {
                 m.set($(this).attr('tag'),$(this).val());
				
          });
		}else{
			//if (m.changedAttributes()){
 				m.set(o.params.value,m.get("value_" + o.params.value));
			//}	
		}   

       //fix for input
   	   	if (o.params.source != undefined && o.params.source!= "" && 
			o.params.minlength != undefined && o.params.minlength!= "" &&
			o.params.mongo_req != "true" &&
			(o.params["class"] == "" ||o.params["class"]==undefined )
			
		){

        	 var value = m.get(o.params.value);
             var data;

            //if length min - don't request
             if (value.length>o.params.minlength){
          		  data =  get2Object(new Request(o.params.source,{mask:value, maxrows:2}));
            }

           // alert(JSON.stringify(data));

             if ($.isEmptyObject(data)){

              	m.clear();
                m.set(o.params.value,value);

             }else{
             	m.set(data);
             }
        } 
        
          //m.save();
          //m.validate(m.changedAttributes());
		  
		  //go to focus

         //to request

	     if (o.params["class"]!=undefined && o.params["class"]!= "" && m.changedAttributes()!= false){
			 
          changedEntity.set(m.changedAttributes());
		  
		   if (o.params["class"]=="inputguideview"){
		   changedEntity.set(o.params.value,m.get("value_"+o.params.value));
		  } 

		  changedEntity.set({eobj_id:getAppModel(AppName).get("eobj_id")});
 
         showSaveDialog(m);
         }

      m.save();   

 }

var is_shown = false;

function showSaveDialog(m){

if (!is_shown){
is_shown = true;

//add a new style 'foo'
$.notify.addStyle('foo', {
  html: 
    "<div>" +
      "<div  class='ui-widget-mymemo ui-corner-all'>" +
        "<div class='title' data-notify-html='title'/>" +
        "<div class='buttons'>" +
          "<button class='no'>нет</button>" +
          "<button class='yes' data-notify-text='button'></button>" +
        "</div>" +
      "</div>" +
    "</div>"
});

//listen for click events from this style
$(document).on('click', '.notifyjs-foo-base .no', function() {
  //programmatically trigger propogating hide event
    is_shown = false;
  $(this).trigger('notify-hide');

});
$(document).on('click', '.notifyjs-foo-base .yes', function() {
  //show button text

 if (is_shown){
 	//implicit save 19.10.2015
 	//saveEntityAttrs(m);
	saveEntityAttrs(getAppModel(AppName));
    }
    
   is_shown = false;
     
  //hide notification
  $(this).trigger('notify-hide');
});


$.notify({
  title: 'Сохранить изменения?',
  button: 'да!'

}, {
  style: 'foo',
  autoHide: false,
  position: 'rigth bottom',
  clickToHide: false
});

}

}

var renderModal = false
//render to app
function Render(v,page){

	  if (renderModal){
	  	page = "app2";
	  }

      $( "#" + page).append(v.el);
       //to do ..fix that f*cking problem  in GridView
      /* if (EditEnable == 0 && $( ".d_tmp_grid").text()!=""){
       alert("!");

           	$(  ".d_tmp_grid").css('width', '25%');
           var id = $( ".d_tmp_grid").attr("id");
           id = id.substring(6);
	 	  	$( "#d_" + id ).remove();
        }
      */  
};



/*
LabelView
MemoView
ButtonView
ComboBoxView
InputView		
DataPickerView
CheckBoxView
GridView
PivotView

*/


var prefix;


function initGroup() {

var groups = newAppObject({});
    Render(new TabBoxView(groups,"groups"),"app");
}


function initMenu() {

   var menu = newAppObject({});
   Render(new Menu2View(menu,"app_menu"),"app");
}




function getElementPosition(p,options){
	
	
	var allwidth = options.coln*options.dx;
	
	
	if (p==undefined){
		p = {x:options.x0,y:options.y0,add:0};
		
		
		//add column
		if 	(options.type == "gridview" || options.type == "reftableview"){

			p.y = +p.y + +options.dy;
			p.x = options.x0;
	
			p.add =2 * options.dx;
		}else{
			p.add = 0;
			
		if (p.x > allwidth){
			p.y = +p.y + +options.dy;
			p.x = options.x0;
			
		}
		}

		
	}else{
		
		p.x = +p.x + +options.dx + +p.add;

		//add column
		if 	(options.type == "gridview" || options.type == "reftableview"){

			p.y = +p.y + +options.dy;
			p.x = options.x0;
	
			p.add =2 * options.dx;
		}else{
			p.add = 0;

		if (p.cwidth==undefined){
			p.cwidth = 0;
		}	
			
		if (p.x + p.cwidth > allwidth){
			p.y = +p.y + +options.dy;
			p.x = options.x0;
			
		}
			
	  }	
	}

	//is static?
	if (options.isstatic=="true"){
			p.y = options.cy;
			p.x = options.cx;
		
	}
	

	return p;
	
}


function showGroup(name){

	 //lazy load if exist render_groups
   /* if (getAppModel(AppName).get("render_groups")!=undefined 
     && getAppModel(AppName).get("is_render_groups").indexOf("p_" + name)<0){
			getAppModel(AppName).set("is_render", false);
			getAppModel(AppName).set("render_groups", ["p_" + name]);
			RenderByObj(getAppModel(AppName));
			 //$("#groups").find("[target='"+name+"']").click();
    }
    */
 
    $("#p_" + name).show();

}


function hideGroup(name){
	
	// $("#groups").find("[target='"+name+"']").click();
	 $("#p_" + name).hide();

}

function disableGroup(name){

	var g_el  = $("#p_" + name).children("div").children();

		$.each(g_el, function( index, value ) {
			
			var el = $(value).attr("id").substr(2).replace(AppName,"");

			disableElement(el);
			
		});
}

function disableButtonGroup(name){

	var g_el  = $("#p_" + name).children("div").children();

		$.each(g_el, function( index, value ) {
			
			var el = $(value).attr("id").substr(2).replace(AppName,"");

			$("#btn_" + prefix + el).hide();
			
		});
}

function enableGroup(name){

	var g_el  = $("#p_" + name).children("div").children();

		$.each(g_el, function( index, value ) {
			
			var el = $(value).attr("id").substr(2).replace(AppName,"");

			enableElement(el);
			
		});
}



function showElement(name){

    var md = getAppModel(AppName);

   if (md.attributes.visible0[name]=="1"){

	md.attributes.visible[name] ="1";
	
	 $("#d_" + prefix + name).show();

	RefreshByObj(md,name);
	//md.attributes.visible[name] ="0";

    var gr_name = app_settings[prefix + name].params.target;
     stack_p = [];

	var g_el  = $("#" + gr_name).children("div").children();

		$.each(g_el, function( index, value ) {

      	var obj_setting = app_settings[$(value).attr("id").substr(2)];

		//fix for tables
		if (obj_setting==undefined){
			obj_setting = app_settings[$(value).parent().attr("id").substr(6)];
		}
		if (obj_setting==undefined){
			return;
		}


	    //template
	     var options = {x0:130,y0:60,dx:300,dy:45,coln:3,
			  						type:obj_setting.params["class"],
									cy:obj_setting.params.top_p,
									cx:obj_setting.params.left_p,
									isstatic:obj_setting.params.isstatic,
									cwidth:obj_setting.params.width
									};


			
		    stack_p.push({
				x:+$(value).css("left").replace("px",""),
				y:+$(value).css("top").replace("px","")
			});						

			 if (obj_setting.params.value == name){
			//	$(value).hide();
			//	stack_p.pop();	
			// }else{
		 	
			 	var p =  getElementPosition(stack_p[stack_p.length-1],options); 
			 	
	 			 var pr_y;
	 			 try{
					pr_y = stack_p[stack_p.length-2].y;
	 			 }catch(e){
	 			 	pr_y =p.y;
	 			 }

	 			 if (p.y - pr_y>options.dy +20){

					stack_p.pop();
					p.y =+pr_y + options.dy;  
					
	 			 	$("#" + gr_name).height($("#" + gr_name).height() - options.dy );
			
				$(value).css({top:p.y+"px",left:p.x + "px"});

			 }
			 }		 

		});	

   }

}

function normalizeStatic(name){

    var gr_name = name;//app_settings[prefix + name].params.target;
     stack_p = [];

	var g_el  = $("#" + gr_name).children("div").children();
	
	try{

	var flag = true;
	
	
	for(i=0;i<$("#" + gr_name).children("div").length;i++){
		if(+$(g_el[i]).css("top").replace("px","")<65){
					flag = false;
					return false; 
		}
		
	}
	/*	$.each(g_el,function(index){
			if(+$(g_el[index]).css("top").replace("px","")<65){
					flag = false;
					return false; 
					}
			});	
	*/
	if (flag){

	var dd;
	//$("#" + gr_name).height(70);

		$.each(g_el, function( index, value ) {

      	var obj_setting = app_settings[$(value).attr("id").substr(2)];

      	if (obj_setting!=undefined){
			
					if (dd==undefined){
						dd = obj_setting.params.top_p;

					}
					
					obj_setting.params.top_p = +obj_setting.params.top_p - +dd + 60;
					$(value).css({top:obj_setting.params.top_p +"px"});


      	}		
		});	

	    $("#" + gr_name).height(+$("#" + gr_name).height() - +dd +70);
      	$("#app").height(+$("#app").height() - +dd +70);	

	}
	}catch(e){
		
	}

}


function disableElement(el) {

	  var md = getAppModel(AppName);
   		  md.attributes.enabled[el]="0";
   	  var is_save = false;

   	  if (changedEntity.get(el)!=undefined){
       	is_save = true;
      }

        $("#" + prefix + el).attr("disabled","disabled");
        $("#btn_" + prefix + el).hide();
        //hack for combobox
        $("#d_" + prefix + el).find(".custom-combobox-toggle").hide();
       
       if ($("#d_" + prefix + el).find("input[type='checkbox']").length==1){
		//hach for checkbox
        md.trigger("change:" + el);
       }else{
       	tmp = md.get(el);
		md.set(el,"");
		md.set(el,tmp);
       }
       
       //delete from save
		if (!is_save){
			changedEntity.unset(el);
		}

}

function enableElement(el) {

	 var md = getAppModel(AppName);

	 if (md.attributes.enabled0[el]=="1"){
   		  md.attributes.enabled[el]="1";

   	  var is_save = false;
   	  if (changedEntity.get(el)!=undefined){
       	is_save = true;
      }

        $("#" + prefix + el).removeAttr("disabled");
         $("#btn_" + prefix + el).show();
         //hack for combobox
        $("#d_" + prefix + el).find(".custom-combobox-toggle").show();

  	  if ($("#d_" + prefix + el).find("input[type='checkbox']").length==1){
		//hach for checkbox
        md.trigger("change:" + el);
       }else{
       	tmp = md.get(el);
		md.set(el,"");
		md.set(el,tmp);
       }
       
       //delete from save
		if (!is_save){
			changedEntity.unset(el);
		}

	 }   
}


function hideElement(name){
	

    var md = getAppModel(AppName);

    //if (md.attributes.visible0[name]=="1"){

	md.attributes.visible[name] ="0";
	
	 $("#d_" + prefix + name).hide();

	RefreshByObj(md,name);

	//md.attributes.visible[name] ="1";

    var gr_name = app_settings[prefix + name].params.target;
     stack_p = [];

	var g_el  = $("#" + gr_name).children("div").children();

		$.each(g_el, function( index, value ) {

      	var obj_setting;
      	obj_setting = app_settings[$(value).attr("id").substr(2)];

		//fix for tables
		if (obj_setting==undefined){
			obj_setting = app_settings[$(value).parent().attr("id").substr(6)];
		}
		if (obj_setting==undefined){
			return;
		}

		
	    //template
	     var options = {x0:130,y0:60,dx:300,dy:45,coln:3,
			  						type:obj_setting.params["class"],
									cy:obj_setting.params.top_p,
									cx:obj_setting.params.left_p,
									isstatic:obj_setting.params.isstatic,
									cwidth:obj_setting.params.width
									};


			
		    stack_p.push({
				x:+$(value).css("left").replace("px",""),
				y:+$(value).css("top").replace("px","")
			});						

			 if (obj_setting.params.value == name){
			//	$(value).hide();
				stack_p.pop();	
			 }else{
		 	
			 	var p =  getElementPosition(stack_p[stack_p.length-1],options); 
			 	
	 			 var pr_y;
	 			 try{
					pr_y = stack_p[stack_p.length-2].y;
	 			 }catch(e){
	 			 	pr_y =p.y;
	 			 }

	 			 if (p.y - pr_y>options.dy+20 ){

					stack_p.pop();
					p.y =+pr_y + options.dy;  
					
	 			 	$("#" + gr_name).height($("#" + gr_name).height() - 20);
			
				$(value).css({top:p.y+"px",left:p.x + "px"});

			 }
			 }		 

		});	


	//md.attributes.visible[name] ="1";
   // }


}


function RefreshByObj(model,name) {

	prefix = model.get("prefix");

  var vis =model.get("visible");
  var stack_index = {};
  var tmp_stack = [];

//create models teamplate
  for (key in model.attributes){
	  
        key = prefix + key;          //need if different obj contain equals attributes
		
		 //var obj_setting = $.extend(true,{},app_settings[key]);

		var obj_setting = app_settings[key];
		
		
        //dinamic positionig  ?
        if (obj_setting != undefined){
				
		 if (vis[key.replace(prefix,"")] == "1" ){

		  try{ 
           if (stack_index[obj_setting.params.target] != undefined){
                 stack_p = stack_index[obj_setting.params.target];
           }else{
         		  stack_p = [];
           }
		  }catch(e){
			  
			//  continue;
		  }
  
			  var p = _.clone(stack_p[stack_p.length - 1]);
			  
			  
			  var options = {x0:130,y0:60,dx:300,dy:45,coln:3,
			  						type:obj_setting.params["class"],
									cy:obj_setting.params.top_p,
									cx:obj_setting.params.left_p,
									isstatic:obj_setting.params.isstatic,
									cwidth:obj_setting.params.width
									};

		     //fix for static poles
		     try{
  			  if (stack_index[obj_setting.params.target]==undefined){
					options.cy = options.y0;
  			  }	
		     }catch(e){
		     	
		     } 							
									
			  //console.log(obj_setting.params.view_id + "/" + JSON.stringify(getElementPosition(p,options)));
			  stack_p.push(getElementPosition(p,options));
			  stack_index[obj_setting.params.target] = stack_p; 	 
			  //console.log(obj_setting.params.target + "/ " +JSON.stringify(stack_p));
			  //
			 tmp_stack.push(obj_setting.params.target);	
				 
		 }
      }
}

//render model
for (key in model.attributes){
	
	     key = prefix + key;          //need if different obj contain equals attributes
		
		 //var obj_setting = $.extend(true,{},app_settings[key]);

		var obj_setting = app_settings[key];
		
		
        //dinamic positionig  ?
        if (obj_setting != undefined && vis[key.replace(prefix,"")] == "1" 
            && obj_setting.params.target == app_settings[prefix + name].params.target){
			
			
			//fix block heigth////////
			
			var gr = stack_index[obj_setting.params.target];
			var gr_height = gr[gr.length-1].y;
				$("#" + obj_setting.params.target).height(parseInt(gr_height) + 60);
				//console.log(parseInt(gr_height + 70));
			/////////////////////////
			
			try{
			  var new_p =stack_index[obj_setting.params.target].shift();
           		obj_setting.params.top_p = new_p.y;
            	obj_setting.params.left_p = new_p.x;
				
			}catch(e){
				
			//	console.log(obj_setting.params.target + obj_setting.params.value);
				
			}	

			

			$("#d_"+key).css({top:obj_setting.params.top_p+"px",left:obj_setting.params.left_p + "px"});
		
	}
}

}


function RenderByObj(model) {

	prefix = model.get("prefix");

      //clear error
   if (model.get("is_render")){
   	var vis = model.get("visible0");
   	var enb = model.get("enabled0");
     model.destroy();
  //    applyDisabled(model);
   //   applyValidation(model);
  //    return;
  		 model.set("visible0",_.clone(vis));
  		 model.set("visible",_.clone(vis));

  		 model.set("enabled0",_.clone(enb));
  		 model.set("enabled",_.clone(enb));
    }else{
    	//inital visible
		model.set("visible0",_.clone(model.get("visible")));
		model.set("enabled0",_.clone(model.get("enabled")));
    }

    model.set("is_render",true);



   	//initGroup();
   //	initMenu();

  //model.set({x:"x"},{validate:true});
  //  model.validate();

  var vis =model.get("visible");
  var stack_index = {};
  var tmp_stack = [];


//create models teamplate
  for (key in model.attributes){
	  
        key = prefix + key;          //need if different obj contain equals attributes
		
		 //var obj_setting = $.extend(true,{},app_settings[key]);

		var obj_setting = app_settings[key];
		
		
        //dinamic positionig  ?
        if (obj_setting != undefined){
				
		 if (vis[key.replace(prefix,"")] == 1){

		  try{ 
           if (stack_index[obj_setting.params.target] != undefined){
                 stack_p = stack_index[obj_setting.params.target];
           }else{
         		  stack_p = [];
           }
		  }catch(e){
			  
			//  continue;
		  }
  
			  var p = _.clone(stack_p[stack_p.length - 1]);
			  
			  
			  var options = {x0:130,y0:60,dx:300,dy:45,coln:3,
			  						type:obj_setting.params["class"],
									cy:obj_setting.params.top_p,
									cx:obj_setting.params.left_p,
									isstatic:obj_setting.params.isstatic,
									cwidth:obj_setting.params.width
									};
									
									
			  //console.log(obj_setting.params.view_id + "/" + JSON.stringify(getElementPosition(p,options)));
			  stack_p.push(getElementPosition(p,options));
			  stack_index[obj_setting.params.target] = stack_p; 	 
			  
			  //
			 tmp_stack.push(obj_setting.params.target);	
				 
		 }
      }
}


//render model
for (key in model.attributes){
	
	     key = prefix + key;          //need if different obj contain equals attributes
		
		 //var obj_setting = $.extend(true,{},app_settings[key]);

		var obj_setting = app_settings[key];
		
		
        //dinamic positionig  ?
        if (obj_setting != undefined && vis[key.replace(prefix,"")] == "1"){
        	 
            /*if (model.get("render_groups")!=undefined){
             if(model.get("render_groups").indexOf(obj_setting.params.target)<0){
            	continue;
             }
            }*/
			
			//fix block heigth////////
			
			var gr = stack_index[obj_setting.params.target];
			var gr_height = gr[gr.length-1].y;
				$("#" + obj_setting.params.target).height(parseInt(gr_height) + 60);
				//console.log(parseInt(gr_height + 70));
			/////////////////////////
			
			try{
			  var new_p =stack_index[obj_setting.params.target].shift();
           		obj_setting.params.top_p = new_p.y;
            	obj_setting.params.left_p = new_p.x;
				
			}catch(e){
				
			//	console.log(obj_setting.params.target + obj_setting.params.value);
				
			}	
	
		 if (obj_setting.params["class"] == "inputview"){
             	Render(new InputView(model,key),obj_setting.params.target);

         }else if(obj_setting.params["class"] == "datapickerview"){
              	Render(new DataPickerView(model,key),obj_setting.params.target);

         }else if(obj_setting.params["class"] == "labelview"){
              	Render(new LabelView(model,key),obj_setting.params.target);
         }
         else if(obj_setting.params["class"] == "memoview"){
              	Render(new MemoView(model,key),obj_setting.params.target);

         }
          else if(obj_setting.params["class"] == "comboboxview"){
			
			/* init script conflict while load  hide/ show
			var v = {el:"<div id='d_"+key+"' style =' background: #F0D3D3;position:absolute; top:" + obj_setting.params.top_p + 
																"px; left:" + obj_setting.params.left_p + "px;'>загружется...</div>"};

			if (EditEnable==0){
          	var strfunc  = "$.ajax({cache:false, beforeSend: function() {Render("+JSON.stringify(v) +",'" + obj_setting.params.target + "');},complete: function(data, textStatus, xhr) {" +
								"$('#d_"+key+"').remove();Render(new ComboBoxView(model,'"+key+"'),'" + obj_setting.params.target + "');}});	";
			
				  try{	
					eval(strfunc);
				  }catch(e){

				  }

			}else{
			*/
			try{
					Render(new ComboBoxView(model,key),obj_setting.params.target);
			}catch(e){
				$.notify(key + " stack error: " + e, "error");
			}
			//}
			
			
			//Render(new ComboBoxView(model,key),obj_setting.params.target);	

         }
           else if(obj_setting.params["class"] == "checkboxview"){
              	Render(new CheckBoxView(model,key),obj_setting.params.target);

         }
           else if(obj_setting.params["class"] == "gridview"){

              	Render(new GridViewE(model,key),obj_setting.params.target);
         }
		  else if(obj_setting.params["class"] == "reftableview"){
			  
              	Render(new GridViewE(model,key),obj_setting.params.target);
         }

          else if(obj_setting.params["class"] == "buttonview"){
              	Render(new ButtonView(model,key),obj_setting.params.target);

         }	
		 
		 else if(obj_setting.params["class"] == "comboboxdelphiview"){
              	Render(new ComboBoxDelphiView(model,key),obj_setting.params.target);

         }	
		 
		 else if(obj_setting.params["class"] == "inputguideview"){
              	Render(new InputGuideView(model,key),obj_setting.params.target);

         }	
		 else if(obj_setting.params["class"] == "icheckboxview"){
              	Render(new iCheckBoxView(model,key),obj_setting.params.target);

         }	 


	}

}

//fix block visible///////

    var uniq = _.uniq( tmp_stack );
   /* if (model.get("render_groups")!=undefined){
		uniq = model.get("render_groups");
		model.set("is_render_groups",_.uniq(uniq.concat(model.get("is_render_groups"))));
    }*/
	
	var block_height = 0;

    for (key in uniq){
     $( "#" + uniq[key].replace("p_","")).attr("checked", true);
     $("#" + uniq[key]).show();
	 
	 block_height = block_height + parseInt($("#" + uniq[key]).height());

	 //normalizeStatic 
	//if (EditEnable==0){ 
	 normalizeStatic(uniq[key]);
	//}
   }
   
   //add bottom
   $("#app").height(block_height + 100);
   
    $("#groups").buttonset("refresh");
    $("#groups").hide();

/////////////////////////

   error_list = {};
   setValidation(model);
   applyValidation(model);

	//clear change event
	model.off("change");
	//on change collect to changedEntity
	model.on("change", function() {

		//force save
		if (AppName != model.get("id")){
			saveEntityAttrs(getAppModel(AppName));
		}

		if (model.changedAttributes()){

			if(changedEntity.get("xchoose")!=undefined  ){
				changedEntity.clear();
			}
			changedEntity.set(model.changedAttributes());
		}	

		//fix visible0
		for (name in model.changedAttributes()){
			if(model.attributes.visible[name]=="0"){
			  if (AppName == model.get("id")){
				hideElement(name);
			  }	
			};
			//if(model.attributes.enabled[name]=="0"){
			//	disableElement(name);
			//};
		};
		
	});

   
   // applyDisabled(model);
         
}

function markError(el,message) {


        $("#" + el).css("border", "3px solid #FF4A4A ");
         $( "#d_" + el ).mouseenter(function() {
          $( "#error_" + el ).remove();
         		 $( "#d_" + el ).append( "<div id= 'error_" + el + "' class =' ui-corner-all ui-tooltip'  style='background-color:#FADEDE;width:180px;'><font style = 'font-size:12px '>" + message + "</font></div>" );
          		 $( "#error_" + el ).position({
 					 my: "left center",
  						at: "right center",
  						of: "#d_" + el
						});
						
						
				//setTimeout(function(){
				//	$( "#error_" + el ).remove();
				//	},3000);		
			 
						

         });

           $( "#d_" + el ).mouseleave(function() {
               $( "#error_" + el ).remove();

           });

         /* $( "#error_" + el ).mouseover(function() {
                    $( "#error_" + el ).remove();
          })
         */

}


function markRedFrame(el) {
      if ($("#" + el).length==0){
 		$("#d_" + el).children().children(".icheckbox_square-red").css("border", "3px solid #FF4A4A"); 
      }else{  
        $("#" + el).css("border", "3px solid #FF4A4A ");  
      }   

}


function markYellowFrame(el) {
      if ($("#" + el).length==0){
 		$("#d_" + el).children().children(".icheckbox_square-red").css("border", "3px solid #CCCC00"); 
      }else{  
        $("#" + el).css("border", "3px solid #CCCC00");  
      }   

}


function markBlueFrame(el) {
      if ($("#" + el).length==0){
 		$("#d_" + el).children().children(".icheckbox_square-red").css("border", "3px solid #5C97FA"); 
      }else{  
        $("#" + el).css("border", "3px solid #5C97FA");  
      }   

}


function markGreenFrame(el) {

    if ($("#" + el).length==0){ 
 		$("#d_" + el).children().children(".icheckbox_square-red").css("border", "3px solid #08af52"); 
      }else{  
        $("#" + el).css("border", "3px solid #08af52 ");  
      }   

}


function clearFrame(el) {

     if ($("#" + el).length==0){

 		$("#d_" + el).children().children(".icheckbox_square-red").css("border", "0px solid"); 
      }else{  
             $("#" + el).css("border","1px inset");
      }   

}



function markHint(el,message) {
	
		//justify

		var string ="";
		
		for(i=0;i<message.length;i=i+27){

			string = string + message.substr(i,27) + "<br>";
		};

         //$( "#d_" + el ).mouseenter(function() {
  
          $( "#error_" + el ).remove();
         		 $( "#d_" + el ).append( "<div id= 'error_" + el + "' class =' ui-corner-all ui-tooltip'  style='background-color:#D9EDF7;opacity:0.8;width:180px;text-align:'><font style = 'font-size:12px;'>" + string + "</font></div>" );
          		 $( "#error_" + el ).position({
 					 my: "left center",
  						at: "right center",
  						of: "#d_" + el
						});
						
						
				//setTimeout(function(){
			//		$( "#error_" + el ).remove();
			//		},5000);		
			 
						

        // });

           $( "#d_" + el ).mouseleave(function() {
               $( "#error_" + el ).remove();

           });

         /* $( "#error_" + el ).mouseover(function() {
                    $( "#error_" + el ).remove();
          })
         */

}


function setDisabled(el) {
        $("#" + el).attr("disabled","disabled");
}

var error_list = {};

function eraseError(el,message) {

        $("#" + el).css("border","2px inset");
        $("#error_" + el).remove();

}

function initValidation(data) {

 var attrs = data.attributes;	

 if(app_settings["validate"] == undefined){
	  return;
	  
  } 

  var code = app_settings["validate"].params;
  var prefix  =data.get("prefix");

     for (key in attrs){

     //if (key=="nv_family"){
     //	var gg = 1;
     //}	
     	
      var error = "";

        if(code[key]!= undefined){
             eval(code[key]);

        }else{
             error = ""
        };

               if (error!=""){
                 error_list[prefix + key] = error;
               }else{

                  delete error_list[prefix + key];
               }
     }
   
    


    for (key in error_list){
       markError(key,error_list[key]);

    }

}


function setValidation(data) {

 data.validate = function(attrs, options) {
	

 if(app_settings["validate"] == undefined){
	  return;
	  
  } 

  var code = app_settings["validate"].params;
  var prefix  =data.get("prefix");

     for (key in attrs){

        if (data.hasChanged(key) ){

      var error = "";

        if(code[key]!= undefined){

			//makarov 13.08.2015 set only not in changedEntity
        	if (changedEntity.get(key)==undefined){
        		 changedEntity.set(data.changedAttributes());
        	}
        	 //changedEntity.set(data.changedAttributes());
             eval(code[key]);
        }else{
             error = ""
        };

               if (error!=""){
                 error_list[prefix + key] = error;
               }else{

                  delete error_list[prefix + key];
               //   delete invalid[key]


               }
        }

     }

    for (key in error_list){
       markError(key,error_list[key]);

    }
  }


}


function setTableValidation(data) {


 if(app_settings["validate"] == undefined){
	  return;
	  
  } 
  var error = ""

  var code = app_settings["validate"].params;


  //var prefix  =data.get("prefix");

        if(code[data]!= undefined){
             eval(code[data]);
        }else{
             error = ""
        };

               if (error!=""){
                 error_list[prefix + data] = error;
               }else{
                  delete error_list[prefix + data];
               }

 }


function applyDisabled(data,view) {

     var enabled  = data.get("enabled");


      if (enabled != undefined){
        for (key in enabled){   ;
        	if (enabled[key] == 0){
                     setDisabled(prefix + key);
                       continue;
            }

       }
     }

}



function applyVisible(data) {

     var visible  = data.get("visible");
        for (key in visible){
        	if (visible[key] == 0){
                     setHide(prefix + key);
            }
       }

}




function applyValidation(data) {

 //get invalidate attributes
 

      var invalid  = data.get("invalid");
      var prefix  = data.get("prefix");


      			//clear previos error
       		   //	 for (key in error_list){
               // 	    eraseError(key);
               //    }
 //print others error_list


      if ($.isArray(invalid)){

       for (var i = 0; i < invalid.length; ++i){
               for (key in invalid[i]){
                	    eraseError(prefix + key.replace(data.get("eobj_id"),""));
                        markError(prefix + key.replace(data.get("eobj_id"),""),invalid[i][key]);
                        error_list[prefix + key.replace(data.get("eobj_id"),"")] = invalid[i][key];
			
                   }

       }

     }else{
              for (key in invalid){

					//$( "#target" ).focus();

                	    eraseError( prefix + key.replace(data.get("eobj_id"),""));
                        markError(prefix + key.replace(data.get("eobj_id"),""),invalid[key]);
                        error_list[prefix + key.replace(data.get("eobj_id"),"")] = invalid[key];

                   }
      }
	  

 try{
     for (key in invalid.others.error){
		 
						if (!$.isArray(invalid.others.error)){
							$.notify(invalid.others.error, "error");
							break;
						}
						

							//$( "#target" ).focus();
						$.notify(invalid.others.error[key], "error");
						
                	   
                   }

	}catch(e){
		
	}


//go to first error
delete error_list[prefix + "others"];
for (key in error_list){
	
	if ($("#" +key).length!=0){
	 goToByScroll(key);   
	 //break;
		 
	 }else{
			$.notify(error_list[key], "error"); 
		 
	 }  
	
  }

}

//collect Requests
/*ra = new RequestDataAll();

function include(o){  
  
  var od = new RequestData(o);
  
  if (!ra.findWhere(od.attributes.root.name))
   ra.add(o);
  
};
*/

// This is a functions that scrolls to #{blah}link
function goToByScroll(id){

  try{	
      // Remove "link" from the ID
    id = id.replace("link", "");
      // Scroll
    $('html,body').animate({
        scrollTop: $("#"+id).offset().top - 70},
        0);
  }catch(e){
  	
  }      
}


function go() { 
	createProgress ();
}

function progressOn() {
	

    timeoutId = setTimeout(go, 1000);

}

function progressOff() {
	deleteProgress();
    clearTimeout(timeoutId);
}

function createProgress(){

//check if already exist
//if ($(".progressbar").length==0){	
   $("#app").append("<div class='ui-widget-overlay' style='color: #000000;font-size: 50px;font-weight: 900; " +
    "font-family:Tahoma;z-index:9999;' id ='progressbar'></div>");
   
};

function deleteProgress(){
      $( "#progressbar").remove();  
};

var includeArr = new Array();
function include(o){  

      includeArr[includeArr.length+1] = o;
  
};  

///////////////////////////your widget////////////////////////

 //default setting

 def_options = {params:

  		{
          view_id:"view" + obj_sequence,
          label:"label",
          labels:["label1,label2"],
          title:"title",
          caption:"caption",
          text:"type text here",
          source:"",
          minlength:"3",
          value:"value",
          values:["value1,value2"],
		  mask:"",
          top_p:0,
          left_p:0,
        //  width_p:50,
          heigth_p:50,
		  target:"app"
        }

 }

//Label//////////////////////////////////////////////////

var LabelView =  BaseView.extend({

            template: _.template(""+
                                "<div id='d_<%=v.view_id%>' style ='position:absolute; top: <%=v.top_p%>px; left: <%=v.left_p%>px; width:<%=v.width_p%>px; height:<%=v.heigth_p%>px;' styleclass='ui-widget-content'>"+
                                 "<label> <font style = 'font-weight: <%=v.bold%>; color: <%=v.color%>;  font-size:<%=v.size%>px; background-color:<%=v.bgcolor%> '><%=m[v.value]%></font></label>"+
                                "</div>"
                            ),

              UI: function() {

               },


             events: {

                      'click'                 : "click",
                      'click button.edit_comp'                 : "edit",
                      'dblclick'              : "dblclick"

                    },

             click: function() {},

             edit: function() {


          //fix on tabs editing..

             if (!this.$("button.edit_comp").is( ":focus" )){
    	   	        return;
             }
             	

                // custom settings
                 if (EditEnable == 1){

                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id

                                }

                                ,{
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value

                                 }
                                ,{
                                  id:"size"
                                 ,label:"size"
                                 ,value:this.options.params.size

                                 }
                                  ,{
                                  id:"bold"
                                 ,label:"bold"
                                 ,value:this.options.params.bold

                                 }
                                ,{
                                  id:"color"
                                 ,label:"color"
                                 ,value:this.options.params.color

                                 }
                               ,{
                                  id:"bgcolor"
                                 ,label:"bgcolor"
                                 ,value:this.options.params.bgcolor

                                 }

                                ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }


                               ]
                        }
                      );
                        var vd =  new ViewData();
                        
                         Render(new DialogFormViewEdit(st_m,vd));

            }}

   });
   


//checkbox view//////////////////////////////////////////////////

var iCheckBoxView =  BaseView.extend({

            template: _.template(""+
                                "<div id='d_<%=v.view_id%>' style ='position:absolute; top: <%=v.top_p%>px; left: <%=v.left_p%>px; width:<%=v.width_p%>px; height:<%=v.heigth_p%>px' styleclass='ui-widget-content'>"+
                                 "<label>  <input type='checkbox' name='<%=v.view_id%>'><div style='position:absolute;left:30px;top:0px;width:<%=v.width_p%>px;' > <font style = 'font: <%=v.bold%>; color: <%=v.color%>; font-size:<%=v.size%>px '><%=v.label%></font><div></label>"+
                                "</div>"
                            ),

              UI: function() {
				  
				   var m  = this.model;
				   var noptions = this.options;
				   var save = this.save;
           		   var change = this.change;

				  //hack for editing 
				  if (EditEnable!=1){
				   this.$("input").iCheck({
							 checkboxClass: 'icheckbox_square-red',
								radioClass: 'iradio_square-red',
								increaseArea: '20%' // optional
					 });
				  }

				 if ( m.get(noptions.params.value)==0){
					  this.$("input").iCheck('uncheck');
				 }else{ 
					 this.$("input").iCheck('check');
				 } 
				  

				  	//disabled
					if (this.model.get("disabled")==true){
					  this.$('input').iCheck('disable');
					}else{
					   this.$('input').iCheck('enable');  
					}
					
				  //checked
					   this.$('input').on('ifChecked', function(event){
					   	$('[name='+noptions.params.view_id+']').focus();
						   m.set(noptions.params.value,"1");
						   	save(noptions,m);
							change();	
						});
				  //unchecked
				     this.$('input').on('ifUnchecked', function(event){
				     		$('[name='+noptions.params.view_id+']').focus();
						  m.set(noptions.params.value,"0");
						  	save(noptions,m);
							change();	
						});

				 //disabled fix

					 var enabled  = m.get("enabled");
					 
					try{
					  if (enabled!=undefined){
						 if (enabled[noptions.params.value] == "0"){
								 this.$('input').iCheck('disable');
						}
					 }
		
					}catch(e){
						
					}

					//if null set opacity 
					//disable now view in citrix
					//if (m.get(noptions.params.value)!="1" && m.get(noptions.params.value)!="0"){
					//	this.$('.icheckbox_square-red').css({opacity:0.1});
					//}
					
	
               },


             events: {

                      'click'                 : "click",
                      'click button.edit_comp'                 : "edit",
                      'dblclick'              : "dblclick"

                    },

             click: function() {},
			 
			 
			 save: function(o,m) {
         				   	  saveModelForm(o,m);
                              },

            change: function() {
         					 
                              },				

             edit: function() {

                // custom settings
                 if (EditEnable == 1){

                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id

                                }
								 ,{
                                  id:"label"
                                 ,label:"label"
                                 ,value:this.options.params.label

                                 }

                                ,{
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value

                                 }
                                ,{
                                  id:"size"
                                 ,label:"size"
                                 ,value:this.options.params.size

                                 }
                                  ,{
                                  id:"bold"
                                 ,label:"bold"
                                 ,value:this.options.params.bold

                                 }
                                ,{
                                  id:"color"
                                 ,label:"color"
                                 ,value:this.options.params.color

                                 }
								 ,{
                                  id:"isstatic"
                                 ,label:"isstatic"
                                 ,value:this.options.params.isstatic
                                 }
								 

                                ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }


                               ]
                        }
                      );
                        var vd =  new ViewData();
                        
                         Render(new DialogFormViewEdit(st_m,vd));

            }}

   }); 
   
  

//TextArea//////////////////////////////////////////////////
                                                                                                                                            
var TextAreaView =  BaseView.extend({

            template: _.template(""+
                                "<div id='d_<%=v.view_id%>' style ='position:absolute; top: <%=v.top_p%>px; left: <%=v.left_p%>px;width:<%=v.width_p%>px;  height:<%=v.heigth_p%>px' >"+
                                 "<textarea id='<%=v.view_id%>' style ='width:<%=v.width_p%>px;  height:<%=v.heigth_p%>px' ><%=m[v.value]%></textarea>"+
                                "</div>"
                            ),

              UI: function() {

              	 //var noptions = this.options;

              	// this.$("#" + noptions.params.view_id).resizable({handles: "se" });
				
               },

             events: {

                      'click'                 : "click",
                      'click button.edit_comp'                 : "edit",
                      'dblclick'              : "dblclick"

                    },


             edit: function() {

                // custom settings
                 if (EditEnable == 1){

                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                               {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id
                           
                                }

                                ,{
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value

                                 }
                                ,{
                                  id:"size"
                                 ,label:"size"
                                 ,value:this.options.params.size

                                 }

                                ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }

                               ]
                        }
                      );
                        var vd =  new ViewData();
                        
                         Render(new DialogFormViewEdit(st_m,vd));

              
            }}    

   });   


   

//Memo//////////////////////////////////////////////////
                                                                                                                                            
var MemoView =  BaseView.extend({

            template: _.template(""+
                                "<div id='d_<%=v.view_id%>' style ='position:absolute; top: <%=v.top_p%>px; left: <%=v.left_p%>px; width:<%=v.width_p%>px; height:<%=v.heigth_p%>px'>"+
                                 "<div class='ui-widget-mymemo ui-corner-all'  style ='width:<%=v.width_p%>px; height:<%=v.heigth_p%>px'><font style = 'font-size:<%=v.size%>px'><%=m[v.value]%></font></div>"+
                                "</div>"
                            ),

              UI: function() {
				
               },

             events: {

                      'click'                 : "click",
                      'click button.edit_comp'                 : "edit",
                      'dblclick'              : "dblclick"

                    },


             edit: function() {

                // custom settings
                 if (EditEnable == 1){

                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                               {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id
                           
                                }

                                ,{
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value

                                 }
                                ,{
                                  id:"size"
                                 ,label:"size"
                                 ,value:this.options.params.size

                                 }

                                ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }

                               ]
                        }
                      );
                        var vd =  new ViewData();
                        
                         Render(new DialogFormViewEdit(st_m,vd));

              
            }}    

   });


//Helper//////////////////////////////////////////////////
var Helper =  BaseView.extend({

            template: _.template("<div id='d_<%=v.view_id%>' style ='position:absolute; top: <%=v.top_p%>px; left: <%=v.left_p%>px; width:<%=v.width_p%>px; height:<%=v.heigth_p%>px'>"+
                                "<a title=''><div id='<%=v.view_id%>' class='ui-myhelp'>?</div>" +
                                "</a></div>"
                            ),

              UI: function() {
                    this.$("#" + this.options.params.view_id).tooltip({ content: this.options.params.value ,hide: { effect: "explode", duration: 400}, position: { my: "left+15 bottom", at: "right center" } });


               },

             events: {

                      'click'                 : "click",
                      'click button.edit_comp'                 : "edit",
                      'dblclick'              : "dblclick"

                    },


             edit: function() {

                // custom settings
                 if (EditEnable == 1){

                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                               {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id
                           
                                }

                                ,{
                                  id:"text"
                                 ,label:"text"
                                 ,value:this.options.params.text

                                 }
								 ,{
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value

                                 }
                                 ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }
                               ]
                        }
                      );
                        var vd =  new ViewData();
                        
                         Render(new DialogFormViewEdit(st_m,vd));

              
            }}    

   });





//BuutonView//////////////////////////////////////////////////    
var ButtonView =  BaseView.extend({
            
            
            template: _.template(""+
                                "<div id='d_<%=v.view_id%>' style ='position:absolute; top: <%=v.top_p%>px; left: <%=v.left_p%>px; width:<%=v.width_p%>px; height:<%=v.heigth_p%>px'>"+
                                "<button class='v_button' id='<%=v.view_id%>' ><font style = 'font-size:12px'><%=v.caption%></font></button>"+
                                "</div>"
                            ),

            UI: function() {
      
             this.$("#" + this.options.params.view_id).button();

            },
            
            
             events: {
                    
                      'click button.v_button'                 : "click",
                      'click button.edit_comp'                 : "edit",
                      'dblclick'              : "dblclick"
                    },             
                           
            
             click: function() {
                              },
                              

             edit: function() {
  
                // custom settings
                 if (EditEnable == 1){
                   
                      st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id
                           
                                }
                               ,{
                                  id:"caption"
                                 ,label:"caption"
                                 ,value:this.options.params.caption
                                 }
                                 ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }

                              
                                 
                               ]
                        }
                      );
                        var vd =  new ViewData(); 

                         Render(new DialogFormViewEdit(st_m,vd));
            }}
   });





//BuutonBackView//////////////////////////////////////////////////    
var BuutonBackView =  BaseView.extend({
            
            
            template: _.template(""+
                                "<div id='d_<%=v.view_id%>' style ='position:fixed; top: <%=v.top_p%>px; left: <%=v.left_p%>px; width:<%=v.width_p%>px; height:<%=v.heigth_p%>px'>"+
                                "</div>"
                            ),

            UI: function() {
			
				
				this.$( "#d_"+ this.options.params.view_id ).hover(
						  function() {
							  $( this ).css("opacity",1.0);
					
						  }
						);
						
				this.$( "#d_"+ this.options.params.view_id ).mouseleave(
						  function() {
						 
							  $( this ).css("opacity",.4);
					 
						  }
						);		
	
						

            },
            
            
             events: {
                    
                      'click'                 : "click"
                   
                    },             
                           
            
             click: function() {
                              }
   });

//ComboBoxView//////////////////////////////////////////////////


var combocache = [];

var ComboBoxView =  BaseView.extend({


            template: _.template(""+
                                "<div id='d_<%=v.view_id%>' class='_edata'  openwidth='<%=v.omwidth%>'  style ='position:absolute; top: <%=v.top_p%>px; left: <%=v.left_p%>px; width:<%=v.width_p%>px; height:<%=v.heigth_p%>px' styleclass='ui-widget-content'>"+
                               //  "<label><font style = 'font-size:12px'><%=v.label%></font></label>"+
                                  "<div id='label_<%=v.view_id%>' style='position:absolute;left:-120px;width:110px;text-align: right;font-size:12px;z-index:-2;' ><%=v.label%></div>" +
                                 "<div class='tooltip' title='<%=v.title%>'>" +
                                   "<select id='s_<%=v.view_id%>' class='_edata'>" +
                                  // "<option  code='<%=m[v.value]%>'><%=m[v.value]%></option>" +
                                   "</select>"+
                                  "</div>" +
                                "</div>"
                            ),

            UI: function() {
               
            var data;
            var datarow;
            var noptions = this.options;
            var save = this.save;
            var m  = this.model;
            var change = this.change;

            var selected;

          if (this.options.params.source.indexOf(".")<0){
            //local data
                  data = this.model.get(this.options.params.source);
            }else{
            //remote

				if (combocache[this.options.params.view_id] == undefined){
							
											//$.ajax({success: function(data){
					if(noptions.params["class"]=="" || noptions.params["class"]==undefined){
						datarow =  get2Object(new Request(noptions.params.source,{}));
					}else{
						datarow =  get2Object(new Request(noptions.params.source,{eobj_id:getAppModel(AppName).get("eobj_id"),entity_key:AppName,attr_key:noptions.params.value,toLowerCase:false}));
					}
				

        		  	// }});
	
						if (!$.isArray(datarow["src"]) && datarow["src"]!=undefined){
							
									 data = [];
 									 data.push(datarow["src"]);
						}else{
							   
						 if (datarow["src"]!=undefined){
 							data = datarow["src"];
						 }else{
						 	data = [{code:"",value:""}];
						 }	   
						 
						}	  
						  
						  
						  
						  combocache[this.options.params.view_id] = data;
						}else{
							
							data = combocache[this.options.params.view_id];
							
						}  
	      	}  

             //add childs
			 
			   var tstr =  "";

			  //add null 
			  if (this.model.get(this.options.params.value) === ""){
 					data.push({code:"",value:""});
			  }
			 
               for(var inputs in data){
				  
               
               if (this.model.get(this.options.params.value) != data[inputs].code){
				   
				 tstr  = tstr  +  "<option value='" + data[inputs].code + "'>" + data[inputs].value +"</option>";

               }else if (this.model.get(this.options.params.value)+"" == data[inputs].code){
					 
				 tstr  = "<option value='" + data[inputs].code + "'>" + data[inputs].value +"</option>" + tstr;
					selected = 	data[inputs].value;

                 }
               }

				//value not in combo
				 if (selected==undefined){
						 tstr = "<option value=''></option>" + tstr;
				 }

 	              

			  this.$( "#s_" + this.options.params.view_id + "._edata").append(tstr);   

          this.$( "#s_" + this.options.params.view_id).combobox(
                 {
    				  select: function( event, ui ) {
                             var select_var = $( "#s_" + noptions.params.view_id + " option:selected" ).val();

                            // m.set(noptions.params.value ,$( "#" + noptions.params.view_id + " option:selected" ).attr("value"));
                              
                             //if select_var is number  
                             if ($.isNumeric(select_var) && !(select_var.indexOf(".")>0) 
                             	 && (select_var.substr(0,1) != "0") && select_var.length < 10){ 
                              m.set(noptions.params.value,parseInt(select_var));
							  }else{
								 m.set(noptions.params.value,select_var); 
								  
							  }
                           //  alert(select_var);
                           //save
        				   // if (noptions.params.source.indexOf(".")<0){
        					    //local data

            		        //        m.set(noptions.params.value,select_var);

        					//	    }
                           //     alert(JSON.stringify(m));
                           //       m.save();
                                  change();
                                  save(noptions,m);
     			    }
     		      }

                );

	//	this.$( "#" + this.options.params.view_id).on( "open", function() {
 	///		alert("!");
//		});
						 
		/*	if (noptions.params.omwidth!=undefined || noptions.params.omwidth !=""){	
							$("a.ui-button").click(function(){

								$('.ui-menu').last().width(noptions.params.omwidth)

							})
			}
		*/			
  //disabled fix

    var enabled  = m.get("enabled");
	
	//if no data
		if (selected==undefined){
			selected = " ";
		}
	
	
	
  try{	
    if (enabled[noptions.params.value] == "0"){

              this.$( "#s_" + noptions.params.view_id).remove();
              this.$( "#d_" + noptions.params.view_id).append("<input id = '#'" + noptions.params.view_id + " disabled = 'disabled' value = '" + selected + "'></input>")
     }
   }catch(e){
	   
   }   
   
   
    try{	
    if (enabled == true){

              this.$( "#s_" + noptions.params.view_id).remove();
              this.$( "#d_" + noptions.params.view_id).append("<input id = '#'" + noptions.params.view_id + " disabled = 'disabled' value = '" + selected + "'></input>")
     }
   }catch(e){
	   
   }  


   				//add hint makarov 17.09.2015
				var val = this.$( "#d_" + noptions.params.view_id + " input").val();
				
				if (val==undefined){
					val="";
				}

   				if (
					(val.length>19 && (noptions.params.length=="" || noptions.params.length==undefined))
					|| (val.length>noptions.params.length/6 && noptions.params.length!="")
				  ){

				 	this.$("#d_" + noptions.params.view_id).mouseenter(
						function() {
									markHint(noptions.params.view_id,val);
						});
					
					
				}	 
   
   
   //hack
   
    this.$("input").attr("id",noptions.params.view_id);

  //change style
    var v_width=130
    if (noptions.params.length!="" && noptions.params.length!=undefined){
    	v_width=+noptions.params.length;
    	this.$("#"+noptions.params.view_id).css({"width":v_width});
    };

    this.$("#"+noptions.params.view_id).parent().find("a").css({"left":v_width+5,"top":"-20px" });
	this.$("#"+noptions.params.view_id).parent().find("a").removeClass("ui-button-icon-only"); 
	this.$("#d_"+noptions.params.view_id).css({"width":v_width+30});
              //  alert(this.$( "#d_" + this.options.params.view_id).remove());
               //   this.$(".tooltip").tooltip({ content: this.options.params.title ,hide: { effect: "explode", duration: 400}, position: { my: "left+15 center", at: "right center" } });
       
            },

            
            events: {
                    
                      'click'                 : "click",
                      'click button.edit_comp'                 : "edit",
                      'dblclick'              : "dblclick"


                    },


            click: function() {
                             
                              },

            change: function() {
                           
                              },

            save: function(o,m) {

         					  saveModelForm(o,m);

                              },

            edit: function() {

            
              
                // custom settings
                 if (EditEnable == 1){



                      st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id
                           
                                }

                                ,{
                                  id:"title"
                                 ,label:"title"
                                 ,value:this.options.params.title

                                 }

                                ,{
                                  id:"label"
                                 ,label:"label"
                                 ,value:this.options.params.label

                                 }
                                ,{
                                  id:"source"
                                 ,label:"source"
                                 ,value:this.options.params.source

                                 }
								 
							 ,{
                                  id:"isstatic"
                                 ,label:"isstatic"
                                 ,value:this.options.params.isstatic

                                 }


                                 ,{
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value

                                 }
                                ,{
                                  id:"length"
                                 ,label:"length"
                                 ,value:this.options.params.length

                                 }
                                ,{
                                  id:"omwidth"
                                 ,label:"omwidth"
                                 ,value:this.options.params.omwidth

                                 }
                                ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }

                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }
                               

                                 
                               ]
                        }
                      );
                        var vd =  new ViewData();
                        
                         Render(new DialogFormViewEdit(st_m,vd));
                        
              
            }}    

   });



//InputView//////////////////////////////////////////////////
var InputView =  BaseView.extend({


            template: _.template("" +

                                "<div id='d_<%=v.view_id%>' class='_edata'  style ='position:absolute; top: <%=v.top_p%>px; left: <%=v.left_p%>px;width:<%=v.width_p%>px;  height:<%=v.heigth_p%>px' styleclass='ui-widget-content'>"+
                               //   "<label><font style = 'font-size:12px'><%=v.label%></font></label>" +
                                 "<div id='label_<%=v.view_id%>' style='position:absolute;left:-140px;width:130px;top:4px;text-align: right;font-size:12px;z-index:-2;' ><%=v.label%></div>" +
                                  "<div id='i_<%=v.view_id%>' class='tooltip'  style='position:relative;float:left;' title='<%=v.title%>'>" +
                                   "<input id='<%=v.view_id%>' class='_data' tag='<%=v.value%>' title = '<%=v.title%>' style='width:<%=v.length%>px' value = '<%=m[v.value]%>'></input>"+
                                 "</div>" +
								 "<button id='btn_<%=v.view_id%>' class='myButton' > ></button>" +
                                "</div>"


                            ),

            UI: function() {
				
			  var cache = {};
              var noptions = this.options;
              var save = this.save;
              var m  = this.model;
              var change = this.change;

  			//disabled

  			if (noptions.params.label == "passwd"){
  				  this.$("#" + this.options.params.view_id).attr("type", "password");
			 
  			}

            if (this.model.get("disabled")==true){
              this.$("#" + this.options.params.view_id).attr("disabled","disabled");
			    this.$("#btn_" + this.options.params.view_id).remove();
            }else{

               this.$("#" + this.options.params.view_id).removeAttr("disabled");
			   
            }

            //fix ' instead of " makarov 11/05/2016
            try{
				if (m.get(noptions.params.value).toString().indexOf("'") >= 0){
					m.set(noptions.params.value, m.get(noptions.params.value).replace(/'/g,"&#39;"));
				}
            }catch(e){};
            
            //mask
              if (this.options.params.mask != undefined && this.options.params.mask !=""){  
			  
			  
			  var options =  { clearIfNotMatch: false,
							  onKeyPress: function(cep, event, currentField, options){
								  
								  if (cep.length==2 && (noptions.params.mask.indexOf(9) >= 0||noptions.params.mask.indexOf('Z') >= 0)){
									  $("#" + noptions.params.view_id).notify("для пропуска символа(если необходимо) нажмите ПРОБЕЛ","info");  
								  }	 
							  }
							};

					
										  
			  if (this.options.params.reverse_mask=="true"){

			  	options.reverse = true;
			  	options.clearIfNotMatch = false;
			  }

			  //fix float mask
			 try{
			 if (m.get(noptions.params.value).toString().indexOf(".")>0  &&
				  noptions.params.mask.replace(/[0-9]/g, "").replace(".","").trim() == ""
			  ){
			  	    var newval = m.get(noptions.params.value).toString() + "00";
			  	    newval = newval.substring(0,newval.indexOf(".") + 3);//.replace(".","");
			  	    
			  	    if (noptions.params.mask.indexOf(".")<0){
			  	    	noptions.params.mask = noptions.params.mask + ".00"
			  	    }
			  	    
					m.set(noptions.params.value,newval, {silent: false});
			  	    options.reverse = true;
			  	    this.$("#" + noptions.params.view_id).mask(noptions.params.mask,options);
					
			  }else if (m.get(noptions.params.value).toString().indexOf(".")<0  &&
				  noptions.params.mask.replace(/[0-9]/g, "").trim() == "." &&
				  m.get(noptions.params.value)!=""
			  ){
					noptions.params.mask = noptions.params.mask.replace(".00","");
					options.reverse = true;
			  //}else{
				//convert to string
				   // var newval = m.get(noptions.params.value).toString() + "0";
					//m.set(noptions.params.value,newval);	
			  };	

			  		  
			 }catch(e){}; 

				  this.$("#" + noptions.params.view_id).mask(noptions.params.mask,options);
				  if (m.hasChanged(noptions.params.value)){
				  	m.set(noptions.params.value,this.$("#" + noptions.params.view_id).val(), {silent: true});
				  };
              }

   				 this.$("#" + this.options.params.view_id).autocomplete({
					 
					 open: function() { 
               				 // After menu has been opened, set width
							 
						if (noptions.params.omwidth!=undefined || noptions.params.omwidth !=""){	 
							$('.ui-menu')
								.width(noptions.params.omwidth);
						}		
         			   } ,
								 

    				  minLength: this.options.params.minlength,
                      change: function( event, ui ){
						//m.clear();
                      	save(noptions,m);
						
							change();

                      },
					  select: function( event, ui ) {

			 					//m.clear();
								m.set("value_" + noptions.params.value,ui.item.value);
								m.set("desc_" + noptions.params.value,ui.item.desc);
								m.set(noptions.params.value,ui.item.label);

								$(this).val(ui.item.label);
								
								//03.06.15 replace save(noptions,m) to m.save
								//save(noptions,m);
								m.save();
								save(noptions,m);
								change();
								
								return false;
							  },
							  
					   focus: function(event, ui) {
     			
      					  return false;
    					},		  
							  

                      source: function( request, response ) {
						  
						 if (noptions.params.source==""){
							 return;
						 }
						  

        				var term = request.term;
                      
        					if ( term in cache ) {
        						  response( cache[ term ] );
        						  return;
       						   }

            var data;
            if (noptions.params.source.indexOf(".")<0 && noptions.params.mongo_req != "true"){
            //local data

                data = m.get(noptions.params.source);
				rdata = [];
             
         		$.each(data, function( index, value ) {
				
				
				var patt = new RegExp("^" + term,"i");
				var res = false;
					
							if (typeof value =='object'){

								res = patt.test(value.label);
								 
							}else{
								res = patt.test(value.label);
							
							}
								if (res){ 
									rdata.push(value);
								}

					 //over limit 
					  if (index>parseInt(noptions.params.maxrows)-2){
						 return false;
					  }
					  
					});
					
				 data = rdata;	

            }else{
            //remote

            
           if (noptions.params.mongo_req == "true"){
			   
			  var o = m.get(noptions.params.source); 
			  
			  //exclude tags
			 var excludestring = "";
			 if (o.mindexexclude!=undefined){
				 
				 excludestring = o.mindexexclude;
			 }

			  if (o.mindex != undefined){

				 var tags =  term;  
				 var newtags = "";
					tags = term.split(" ");

				  for (i in tags){
					  
					  if (tags[i]!="" 
					  		&& excludestring.indexOf(tags[i].toUpperCase() + " ")<0
							//&& tags[i].length>=noptions.params.minlength
							){
						//first word mus 		
					    if (i==0 && tags[i].length<noptions.params.minlength){
						   	 tags[i]="";
							
						}		
						 	 newtags = newtags + tags[i] + " ";

					  }
				  }
				  //exclude symbols 
					if (newtags=="" && tags.length == 1){
						
						if (excludestring.indexOf(term.toUpperCase())<0){
							newtags = term;
						}
					}  
				
				 o.mindex = "[" + leftTrim(newtags.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,"").toUpperCase()) + "]";
			  }else{
			  
			 	 o.index0 = "/^" +  leftTrim(term.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,"").toUpperCase()); 
			  }
			  //alert(JSON.stringify(o));
			  var req = _.clone(o);
			  delete req["mindexexclude"];
			  
			  //start sort 
			  if (req.startsort!=undefined){
				  var arr = term.replace(/\s+$/,"").split(" ");	
				  
				  if (arr.length < req.startsort){	  
					    delete req["sort"];  
				  }
				   delete req["startsort"];  
			  }
			  
			  //preexec func
			     //start sort 
			  if (req.preexec!=undefined){
				   req.search = term;
				   req.preexec(req);
				   delete req["preexec"];
				   delete req["search"];
			  }

			  data = JSON.parse(get2Mongo(req));
			  
			  //data= [{id:{d:"34"},label:"sdfs",desc:"sdfs"}]
			  
             // data =  get2Object(new Request(noptions.params.source,{mask:term, maxrows:noptions.params.maxrows}));
             // data = data[noptions.params.value];
           }else if (noptions.params.source!=""){
              data =  get2Object(new Request(noptions.params.source,{mask:term, maxrows:noptions.params.maxrows}));

			  //return one element
              if (!$.isArray(data[noptions.params.value])){
              	data[noptions.params.value] = [data[noptions.params.value]]
              }

               if (noptions.params.toUpperCase=="true"){
               //to Upper makarov 15.02.2016
				$.each(data[noptions.params.value], function(index, element) {
    				data[noptions.params.value][index] = element.toUpperCase()
				});
               }


              data = data[noptions.params.value];
           }
            }
			
			//add "else" pole
			
			if (data!=undefined){
				if (data.length == noptions.params.maxrows && noptions.params.maxrows>1){
					data.push({value:"",label:"",desc:"..Пожалуста уточните поиск.."});
					
				}
			}

             //        var data =  get2Object(new Request(noptions.params.source,{mask:term, maxrows:noptions.params.maxrows}));
            //         var data = data[noptions.params.value];

         			  cache[ term ] =  data;
        			  response( data );

    		    }
   			 });

		//button func
		var btn_func = noptions.params.btn_func;
			
			if (btn_func==undefined || btn_func==""){
				this.$("#btn_" + noptions.params.view_id).remove();
	
			}else{
			 //makarov add off click -- double eval func error
			 this.$("#btn_" + noptions.params.view_id).off("click").click(function() {

			 	//save entity beforeSend 22.04.2015
			 	try{
			 		saveEntityAttrs(getAppModel(AppName));
			 	}catch(e){
			 		$.notify(e,"error");
			 	}
	 
				if (btn_func.substr(0,2).toUpperCase() == "J_"){
				//run Delhi func	
				m.set("xchoose",noptions.params.value);
				
				var ret = runJScipt(btn_func);
				
				var o = newAppObject(ret);
			
				    o.set({id:btn_func}); 
					addToAppRequest(o);
					//reopen
					executeApp(AppName);	
				
				//run internal script
           	    }else if (btn_func.substr(0,3) == "in_"){   
           	    		 m.set("xchoose",noptions.params.value);
                         executeScript(btn_func);	
                         m.unset("xchoose")
				}else{
				//mark value
					m.set("xchoose",noptions.params.value);
 					 executeApp(btn_func);
					
				}

			  });
          
				
			}

     //disabled fix

   			 var enabled  = m.get("enabled");
			 
			try{
              if (enabled!=undefined){
   				 if (enabled[noptions.params.value] == "0"){
                         this.$("#" + this.options.params.view_id).attr("disabled","disabled");
                       if (noptions.params.always_btn!="true"){
                       	 this.$("#btn_" + this.options.params.view_id).remove();
                       }  
  				}
             }

			}catch(e){
				
			}
				//add title
				var val = m.get(noptions.params.value);
				
				if (val==undefined){
					val="";
				}
			
			//TODO hint	
			/*	if (val.length>parseInt(noptions.params.length) && (noptions.params.length!="" || noptions.params.length!=undefined)){
					
					 this.$("#" + this.options.params.view_id).tooltip({ content: val});
				}else 
			*/	
				if (
					(val.length>19 && (noptions.params.length=="" || noptions.params.length==undefined))
					|| (val.length>noptions.params.length/6 && noptions.params.length!="")
				  ){
				
					//this.$("#" + this.options.params.view_id).tooltip({ content: val});
					this.$("#d_" + noptions.params.view_id).mouseenter(
													function() {

													markHint(noptions.params.view_id,val);

														/*	
															$("#" + noptions.params.view_id).notify(
																		val,
																		"info",
																		 { 
																		   clickToHide: true,
																		   autoHide: true,
																		   autoHideDelay: 1500,
																		   hideDuration: 0
																		  } 
															);
														*/	
					});
					
					
				}	

            },
            
            events: {
                    
                      'click'                 : "click",
                      'click button.edit_comp'                 : "edit",
                      'dblclick'              : "dblclick"
                     
                    },


            click: function() {

                              },


            save: function(o,m) {
         				   	  saveModelForm(o,m);
                              },

            change: function() {

                              },

            edit: function() {

            
              
                // custom settings
                 if (EditEnable == 1){



                      st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id

                                }
                                ,{
                                  id:"title"
                                 ,label:"title"
                                 ,value:this.options.params.title

                                 }

                                ,{
                                  id:"source"
                                 ,label:"auto complete source"
                                 ,value:this.options.params.source

                                 }
                                ,{
                                  id:"minlength"
                                 ,label:"auto complete minlength"
                                 ,value:this.options.params.minlength

                                 }

                                ,{
                                  id:"maxrows"
                                 ,label:"auto complete maxrows"
                                 ,value:this.options.params.maxrows

                                 }

                             	,{
                                  id:"mask"
                                 ,label:"mask"
                                 ,value:this.options.params.mask

                                 }

								,{
                                  id:"reverse_mask"
                                 ,label:"reverse_mask"
                                 ,value:this.options.params.reverse_mask

                                 }

                                ,{
                                  id:"label"
                                 ,label:"label"
                                 ,value:this.options.params.label

                                 }
                                 ,{
                                  id:"mongo_req"
                                 ,label:"mongo_req"
                                 ,value:this.options.params.mongo_req

                                 }
								 ,{
                                  id:"btn_func"
                                 ,label:"btn_func"
                                 ,value:this.options.params.btn_func

                                 }
	    					   ,{
                                  id:"always_btn"
                                 ,label:"always_btn"
                                 ,value:this.options.params.always_btn

                                 }       
                                ,{
                                  id:"length"
                                 ,label:"length"
                                 ,value:this.options.params.length
                                 }
								 
								 ,{
                                  id:"isstatic"
                                 ,label:"isstatic"
                                 ,value:this.options.params.isstatic
                                 }
                                 ,{
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value

                                 }
                                 ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }
								,{
                                  id:"omwidth"
                                 ,label:"omwidth"
                                 ,value:this.options.params.omwidth

                                 }
                                ,{
                                  id:"toUpperCase"
                                 ,label:"toUpperCase"
                                 ,value:this.options.params.toUpperCase

                                 }

                               ]
                        }
                      );
                        var vd =  new ViewData();
                        
                         Render(new DialogFormViewEdit(st_m,vd));
                        
              
            }}    

   });




//DataPicker//////////////////////////////////////////////////

var DataPickerView =  BaseView.extend({

            template: _.template(""+
                                "<div id='d_<%=v.view_id%>' style ='position:absolute; top: <%=v.top_p%>px; left: <%=v.left_p%>px; width:<%=v.width_p%>px; height:<%=v.heigth_p%>px'>"+
                           		//"<label><font style = 'font-size:12px'><%=v.label%></font>" +
                               "<div id='label_<%=v.view_id%>' style='position:absolute;left:-120px;width:110px;text-align: right ;font-size:12px;z-index:-2;' ><%=v.label%></div>" +
                                "<input type='text' class='_data' tag='<%=v.value%>'  value = '<%=m[v.value]%>' id='<%=v.view_id%>'>" +
                                "</div>"

                            ),

            UI: function() {

                       var save = this.save;
                       var m  = this.model;
                       var change = this.change;
                       var noptions = this.options;



                    var options =  { 
  					//	onComplete: function(cep) {
   					//	 if (Date.parse(cep)==undefined){
   					//	 	$( "#" + noptions.params.view_id).val("");
   					//	 }
  					//	},
  						clearIfNotMatch: true
                    }	   

					//clear 
					if ((Date.parseExact(m.get(noptions.params.value),"dd.MM.yyyy")==undefined)){
							//$( "#" + noptions.params.view_id).val("");
							m.set(noptions.params.value,"");
					}


                    this.$( "#" + this.options.params.view_id).mask('00.00.0000',options);
   					 this.$( "#" + this.options.params.view_id).datepicker(
                     {
						 
					   beforeShow: function() {
												setTimeout(function(){
													$('.ui-datepicker').css('z-index', 1000);
												}, 0);
											},
      					showButtonPanel: true,
                        dateFormat:"dd.mm.yy",
						//showOn: "button",
   					   // buttonImage: "images/calendar.gif",
      				//	buttonImageOnly: true,
      				//	buttonText: "выбрать..",
						
                        numberOfMonths: parseInt(this.options.params.nmonth),
                        onSelect: function() {
                          	save(noptions,m)
                            change();

                        }
                     }




                     );

           //fix change event
         		   this.$( "#" + this.options.params.view_id).change (function () {
         			 	save(noptions,m)
                            change();
 		  		   });


              var enabled  = m.get("enabled");
			  
			 try{ 
   				 if (enabled[noptions.params.value] == "0"){
                         this.$("#" + this.options.params.view_id).attr("disabled","disabled");
  				}
			 }catch(e){
				 
			 }	


            },
            
            
             events: {
                    
                      'click'                 : "click",
                      'dblclick'              : "dblclick",
                      'click button.edit_comp'                 : "edit"
                    },


            click: function() {

                              },

            change: function() {

                              },


            //save model
            save: function(o,m) {
         					  saveModelForm(o,m);
                              },

             edit: function() {

                // custom settings
                 if (EditEnable == 1){
                   
                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id

                                }
                                ,{
                                  id:"label"
                                 ,label:"label"
                                 ,value:this.options.params.label
                                 }
                                 ,{
                                  id:"nmonth"
                                 ,label:"number of month"
                                 ,value:this.options.params.nmonth
                                 }
                                ,{
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value

                                 }
  								 ,{
                                  id:"isstatic"
                                 ,label:"isstatic"
                                 ,value:this.options.params.isstatic

                                 }

                               ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }
                              
                                 
                               ]
                        }
                      );
                        var vd =  new ViewData(); 

                         Render(new DialogFormViewEdit(st_m,vd));


            }}


   });


//DialogFormView//////////////////////////////////////////////////

var DialogFormView =  BaseView.extend({


//need ..then model changes(save) render n counts)

     initialize: function(model,options){
              
                                 this.model = model;
                                 this.options = app_settings[options];
                               
                                 //if did't found
                                 if (this.options == undefined){
                                   this.options = def_options;
                                 }

                                 this.listenTo(this.model, 'destroy', this.remove);
                                 this.render();

                               },
                               
      template: _.template("" +
                              "<div id='d_<%=v.view_id%>' title='<%=v.title%>' style ='position:absolute; top: <%=v.top_p%>px; left: <%=v.left_p%>px; width:<%=v.width_p%>px; height:<%=v.heigth_p%>px'>"+
                                  "<div id='<%=v.view_id%>'>" +
                                     "<form>" +
                                      "<fieldset>"      +
                                        "<% for(var inputs in v.values) { %>" +
                                        "<label id='<%=v.values[inputs] %>'><%=v.labels[inputs] %></label>"+
                                         "<input type='text id='<%=v.values[inputs]  %>' tag='<%=v.values[inputs]  %>' value='<%=m[v.values[inputs]] %>' class='_data text ui-widget-content ui-corner-all'><br>"+
                                        " <% } %>" +
                                      "</fieldset>"+
                                    " </form>"+
                                  "</div>" +
                              "</div>"

            ),

            UI: function() {

               var ok = this.ok;
               var cancel = this.cancel;
               
              var noptions = this.options;
              var save = this.save;
              var m  = this.model;

             if (EditEnable == 1){

             }else
             {
                this.$("#d_" + this.options.params.view_id).removeAttr( "style" )  //delete position
                this.$("#d_" + this.options.params.view_id).dialog({
                          autoOpen: true,
                          height: 300,
                          width: 350,
                          modal: noptions.params.modal,
                          beforeClose: function( event, ui ) { save(noptions,m)},
                          buttons: {
                            "ok": function() {
                              save(noptions,m)
                              ok(m);
                              $(this).dialog( "close" );
                            },

                            "cancel": function() {
                            	cancel(m);
                              $( this ).dialog( "close" );
                            }
                          }
                        });
                }
            },
            
            
            events: {
                    
                      'click'                 : "click",
                      'dblclick'              : "dblclick",
                      'click button.edit_comp'                 : "edit",
                      'change'                : "changed"
                    },


            click: function() {

                              },

            //save model
            save: function(o,m) {
         				   	  saveModelForm(o,m);
                           //  this.model = m;
                              },

             ok: function() {

                              },

             cancel: function() {

                              },

             edit: function() {

                // custom settings
                 if (EditEnable == 1){
                   
                       st_m = new ModelData(
                        {      
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id

                                }
                                ,{
                                  id:"title"
                                 ,label:"title"
                                 ,value:this.options.params.title
                                 },
                                 {
                                  id:"modal"
                                 ,label:"modal"
                                 ,value:this.options.params.modal
                                 },
                                {
                                  id:"label"
                                 ,label:"label"
                                 ,value:this.options.params.label
                                 },
                                 {
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value
                                 }
                                ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }

 
                               ]
                        }
                      );
                        var vd =  new ViewData(); 

                         Render(new DialogFormViewEdit(st_m,vd));

            }}

   });


//DialogModalView//////////////////////////////////////////////////

var DialogModalView =  BaseView.extend({


//need ..then model changes(save) render n counts)
     initialize: function(model,option){
              
                                 this.model = model;
                                 this.options = app_settings[option];

                                 //if did't found
                                 if (this.options == undefined){
                                   this.options = def_options;
                                 }

                                 //fix remove previos div
								$("#d_" + this.options.params.view_id).remove();


                                 this.listenTo(this.model, 'destroy', this.remove);
                                 this.render();

                               },
                               
   template: _.template("" +
                              "<div id='d_<%=v.view_id%>' title='<%=v.title%>' style ='position:absolute;top: <%=v.top_p%>px; left: <%=v.left_p%>px; width:<%=v.width_p%>px; height:<%=v.heigth_p%>px'>"+
                                  "<div id='<%=v.view_id%>'>" +
                                     "<font style = 'font-size:12px '><p><%=m[v.value]%></p></font>" +
                                  "</div>" +
                              "</div>"

            ),

            UI: function() {

               var ok = this.ok;
               var cancel = this.cancel;

              var noptions = this.options;
              var save = this.save;
              var m  = this.model;

             if (EditEnable == 1){
           
             }else
             {
                this.$("#d_" + this.options.params.view_id).removeAttr( "style" )  //delete position
                this.$("#d_" + this.options.params.view_id).dialog({
                          autoOpen: true,
                          height: noptions.params.height,
                          width: noptions.params.width,
                          modal: noptions.params.modal,
                     //     beforeClose: function( event, ui ) { save(noptions,m)},
                          buttons: {
                            "ok": function() {
                              ok();
                              $(this).dialog( "close" );
                            },

                            "cancel": function() {
                              cancel();
                              $( this ).dialog( "close" );
                            }
                          }
                        });
                }

            },
            
            
            events: {
                    
                      'click'                 : "click",
                      'dblclick'              : "dblclick",
                      'click button.edit_comp'                 : "edit",
                      'change'                : "changed"
                    },


            click: function() {

                              },

            //save model
            save: function(o,m) {
         				   	  saveModelForm(o,m);
                           //  this.model = m;
                              },

             ok: function() {

                              },

             cancel: function() {

                              },

             edit: function() {

                // custom settings
                 if (EditEnable == 1){
                   
                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id
                           
                                }
                                ,{
                                  id:"title"
                                 ,label:"title"
                                 ,value:this.options.params.title
                                 },
                                 {
                                  id:"modal"
                                 ,label:"modal"
                                 ,value:this.options.params.modal
                                 },
                                 {
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value
                                 }

                                 ,{
                                  id:"height"
                                 ,label:"height"
                                 ,value:this.options.params.height
                                 }
                   			    ,{
                                  id:"width"
                                 ,label:"width"
                                 ,value:this.options.params.width
                                 }
                                ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }
                               ]
                        }
                      );
                        var vd =  new ViewData(); 

                         Render(new DialogFormViewEdit(st_m,vd));

            }}

   });





//AccordionView/////////////////////////////////////////////////

var AccordionView =  BaseView.extend({

          template: _.template(""+
                          "<div id='d_<%=v.view_id%>' title='<%=v.title%>' class='ui-accordion' style ='position:absolute; top: <%=v.top_p%>px; left: <%=v.left_p%>px; width:<%=v.width_p%>px; height:<%=v.heigth_p%>px'>"+
                              "<div id='<%=v.view_id%>'>" +
                                        "<% for(var inputs in v.values){ %>" +
                                        "<h3><%=v.labels[inputs] %></h3>"+
                                        "<div class='ui-accordion-content'  id='target_<%=v.values[inputs]%>'>" +
                                         "<p><%=m[v.values[inputs]] %></p>"+
                                        "</div>" +
                                        " <% } %>" +
                                  "</div>" +
                              "</div>"
            ),


            UI: function() {
                    this.$("#" + this.options.params.view_id).accordion(
                    {
                    	  heightStyle: "content"
                    }
                    );
            },

            
            events: {
                    
                      'click'                 : "click",
                      'dblclick'              : "dblclick",
                      'click button.edit_comp'                 : "edit"
                    },


            click: function() {

                              },

            //save model
            save: function(o,m) {
         				   	  saveModelForm(o,m);
                           //  this.model = m;
                              },

             edit: function() {

                // custom settings
                 if (EditEnable == 1){
                   
                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id
                           
                                }
                                ,{
                                  id:"title"
                                 ,label:"title"
                                 ,value:this.options.params.title
                                 },
                                {
                                  id:"label"
                                 ,label:"label"
                                 ,value:this.options.params.label
                                 },
                                 {
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value
                                 }
                                 ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }
 
                               ]
                        }
                      );
                        var vd =  new ViewData(); 

                         Render(new DialogFormViewEdit(st_m,vd));

            }}

   });



//TabsView/////////////////////////////////////////////////

var TabsView =  BaseView.extend({

          template: _.template(""+
                          "<div id='d_<%=v.view_id%>' title='<%=v.title%>' class='ui-accordion' style ='position:absolute; top: <%=v.top_p%>px; left: <%=v.left_p%>px; width:<%=v.width_p%>px; height:<%=v.heigth_p%>px'>"+
                              "<div id='<%=v.view_id%>'>" +
                              	"<ul>" +
                                        "<% for(var inputs in v.values){ %>" +
                                         "<li><a href='#<%=v.values[inputs]%>'><%=v.labels[inputs] %></a></li>" +
                                        " <% } %>" +
                               	"</ul>" +
                                      "<% for(var inputs in v.values){ %>" +
                                         " <div  style ='width:<%=v.width_p%>px; height:<%=v.heigth_p%>px' id='<%=v.values[inputs]%>'></div>" +
                                        " <% } %>" +

                              "</div>" +
                          "</div>"
            ),


            UI: function() {
                    this.$("#" + this.options.params.view_id).tabs(
                     {
                    	activate: function( event, ui ) {
                            
                         //  var selected = $("#tabs div.ui-tabs-panel:not(.ui-tabs-hide)").attr("id");
                         //         alert(selected);
                         //    $( ".p_tabs").hide();
                         //     $( "#" + selected).show();
                        }
                     }
                    );


            //create pages..
         /*   var xi = 0;
            for (inputs in this.options.params.values){
               xi++;
               if (xi>2){
                  $("#" + this.options.params.values[inputs]).hide();
               }

            }

           */



            },

            
            events: {
                    
                      'click'                 : "click",
                      'dblclick'              : "dblclick",
                      'click button.edit_comp'                 : "edit"
                    },


            click: function() {

                              },

            //save model
            save: function(o,m) {
         				   	  saveModelForm(o,m);
                           //  this.model = m;
                              },

             edit: function() {

             //fix on tabs editing..
          
             if (!this.$("button.edit_comp").is( ":focus" )){
    		        return;

             }

                // custom settings
                 if (EditEnable == 1){
                   
                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id
                           
                                }
                                ,{
                                  id:"title"
                                 ,label:"title"
                                 ,value:this.options.params.title
                                 },
                                {
                                  id:"label"
                                 ,label:"label"
                                 ,value:this.options.params.label
                                 },
                                 {
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value
                                 }
                                 ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }
 
                               ]
                        }
                      );
                        var vd =  new ViewData(); 

                         Render(new DialogFormViewEdit(st_m,vd));

            }}

   });


//TabBoxView/////////////////////////////////////////////////

var TabBoxView =  BaseView.extend({

          template: _.template(""+
                          "<div id='d_<%=v.view_id%>' class='ui-accordion' style ='position:absolute; font-size:12px; top: <%=v.top_p%>px; left: <%=v.left_p%>px; width:<%=v.width_p%>px; height:<%=v.heigth_p%>px'>"+
                              "<div id='<%=v.view_id%>'>" +
                                        "<% for(var inputs in v.values){ %>" +
                                         "<input type='checkbox' id='<%=v.values[inputs] %>' name='radio'><label class='buttonsetb' target ='<%=v.values[inputs] %>'  for='<%=v.values[inputs] %>'><%=v.labels[inputs] %></label>" +
                                        " <% } %>" +
                                  "</div>" +
                              "</div>"
            ),


            UI: function() {
                    this.$("#" + this.options.params.view_id).buttonset();
                    
            //create pages..
            var xi = 0;
            var change = this.change;
			
            var sizes  = this.options.params.source.split(",");

            for (inputs in this.options.params.values){
            /*style='position:relative;float:left;'*/
			/*
			color: #FF6666;font-size: 14px;font-weight: bold;
			*/
			

                  this.$("#d_" + this.options.params.view_id).append("<div class='p_tabs' style='position:relative;clear: left;float:left; height: " + sizes[inputs] + "px;'  id ='p_" + this.options.params.values[inputs] + "' ><p style='color: #FF6666;font-size: 14px;font-weight: bold;'>" + this.options.params.labels[inputs] + "</p><hr></div>");

               //hide other pages
               xi++;

              if (xi ==1){
    			
    			 this.$("#p_" + this.options.params.values[inputs]).hide();
             
             //   this.$( "#" + this.options.params.values[inputs]).attr("checked", true);
          	// 	   this.$("#" + this.options.params.view_id).buttonset("refresh");
              }

               if (xi>1){
                  this.$("#p_" + this.options.params.values[inputs]).hide();
               }

            }

               this.$(".buttonsetb").click(function(){
               
                        var selected = $(this).attr("target");
                            var isChecked = $("#" + selected).prop('checked');
                            
                            if (!isChecked){

                              $("#p_" + selected).show();
                             // showGroup(selected);
                            }else{
                            	 $("#p_" + selected).hide();
                            }

                           change(selected);

				});
            },

            
            events: {
                    
                      'click'                 : "click",
                      'dblclick'              : "dblclick",
                      'click button.edit_comp'                 : "edit"
                    },


            click: function() {

                              },

             change: function(selected) {

                              },


            //save model
            save: function(o,m) {
         				   	  saveModelForm(o,m);
                           //  this.model = m;
                              },

             edit: function() {

          //fix on tabs editing..

             if (!this.$("button.edit_comp").is( ":focus" )){
    	   	        return;

             }

                // custom settings
                 if (EditEnable == 1){
                   
                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id
                           
                                }
                                ,{
                                  id:"title"
                                 ,label:"title"
                                 ,value:this.options.params.title
                                 }
                                ,{
                                  id:"type"
                                 ,label:"type(radio/checkbox)"
                                 ,value:this.options.params.type
                                 }
                                ,{
                                  id:"label"
                                 ,label:"label"
                                 ,value:this.options.params.label
                                 },
                                 {
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value
                                 },
								 { 
								 id:"source"
                                 ,label:"source"
                                 ,value:this.options.params.source
                                 },
								 
								{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }
 
                               ]
                        }
                      );
                        var vd =  new ViewData(); 

                         Render(new DialogFormViewEdit(st_m,vd));

            }}

   });


//TabRadioBoxView/////////////////////////////////////////////////

var TabRadioBoxView =  BaseView.extend({

          template: _.template(""+
                          "<div id='d_<%=v.view_id%>' class='ui-accordion' style ='position:absolute; font-size:14px; top: <%=v.top_p%>px; left: <%=v.left_p%>px; width:<%=v.width_p%>px; height:<%=v.heigth_p%>px'>"+
                              "<div id='<%=v.view_id%>'>" +
                                        "<% for(var inputs in v.values){ %>" +
                                         "<input type='radio' id='<%=v.values[inputs] %>' name='radio'><label class='buttonsetb' target ='<%=v.values[inputs] %>'  for='<%=v.values[inputs] %>'><%=v.labels[inputs] %></label>" +
                                        " <% } %>" +
                                  "</div>" +
                              "</div>"
            ),


            UI: function() {
                    this.$("#" + this.options.params.view_id).buttonset();

                     this.$("input").css({visibility:"hidden"});

                    
            //create pages..
            var xi = 0;
            var change = this.change;
			

            for (inputs in this.options.params.values){
            /*style='position:relative;float:left;'*/

                  this.$("#d_" + this.options.params.view_id).append("<div class='p_tabs' style='position:relative;clear: left;float:left;'  id ='p_" + this.options.params.values[inputs] + "' ><p style='color:#000000;'>" + this.options.params.labels[inputs] + "</p><hr></div>");

               //hide other pages
               xi++;

              if (xi ==1){
    			
    			 this.$("#p_" + this.options.params.values[inputs]).hide();
             
             //   this.$( "#" + this.options.params.values[inputs]).attr("checked", true);
          	// 	   this.$("#" + this.options.params.view_id).buttonset("refresh");
              }

               if (xi>1){
                  this.$("#p_" + this.options.params.values[inputs]).hide();
               }

            }

               this.$(".buttonsetb").click(function(){
               
                        var selected = $(this).attr("target");
                          
  							 $(".p_tabs").hide();
                              $("#p_" + selected).show();
                          
                         
                           change(selected);

				});
            },

            
            events: {
                    
                      'click'                 : "click",
                      'dblclick'              : "dblclick",
                      'click button.edit_comp'                 : "edit"
                    },


            click: function() {

                              },

             change: function(selected) {

                              },


            //save model
            save: function(o,m) {
         				   	  saveModelForm(o,m);
                           //  this.model = m;
                              },

             edit: function() {

          //fix on tabs editing..

             if (!this.$("button.edit_comp").is( ":focus" )){
    	   	        return;

             }

                // custom settings
                 if (EditEnable == 1){
                   
                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id
                           
                                }
                                ,{
                                  id:"title"
                                 ,label:"title"
                                 ,value:this.options.params.title
                                 }
                                ,{
                                  id:"type"
                                 ,label:"type(radio/checkbox)"
                                 ,value:this.options.params.type
                                 }
                                ,{
                                  id:"label"
                                 ,label:"label"
                                 ,value:this.options.params.label
                                 },
                                 {
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value
                                 },
								 { 
								 id:"source"
                                 ,label:"source"
                                 ,value:this.options.params.source
                                 },
								 
								{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }
 
                               ]
                        }
                      );
                        var vd =  new ViewData(); 

                         Render(new DialogFormViewEdit(st_m,vd));

            }}

   });





//CheckBoxView/////////////////////////////////////////////////

var CheckBoxView =  BaseView.extend({

              //not re render then model is changed
                   initialize: function(model,options){

                                 this.model = model;
                                 this.options = app_settings[options];


                               //  alert(JSON.stringify(this.options));

                                 //if did't found
                                 if (this.options == undefined){
                                   this.options = def_options;
                                 }

                                // this.template =  _.template(this.options.template),  //if need save many differn template then
                                                                                        //load it dynamically from viewdata object

                               //  this.model.fetch(); //feth from serve .. see Backbone.sync read
                               //  this.model.bind('change', this.refresh, this);
                               //  this.listenTo(this.model, 'change', this.render);
                                 this.listenTo(this.model, 'destroy', this.remove);

                                 this.render();
                             

                               },



          template: _.template(""+
                          "<div id='d_<%=v.view_id%>' title='<%=v.title%>' class='ui-accordion' style ='position:absolute; font-size:12px;  top: <%=v.top_p%>px; left: <%=v.left_p%>px; width:<%=v.width_p%>px; height:<%=v.heigth_p%>px'>"+
                              "<div id='<%=v.view_id%>'>" +
                                        "<% for(var inputs in v.values){ %>" +
                                     //   "<% if ($.inArray( v.values[inputs], m[v.isselect] < 0){ %>" +
                                           "<input type=<%=v.type%> id='<%=v.values[inputs] %>' name='radio'><label class='buttonsetb' target ='<%=v.values[inputs] %>'  for='<%=v.values[inputs] %>'><%=v.labels[inputs] %></label>" +
                                      //     " <% }else{ %>" +
                                      //      "<input type=<%=v.type%> id='<%=v.values[inputs] %>' name='radio'><label class='buttonsetb' target ='<%=v.values[inputs] %>'  for='<%=v.values[inputs] %>'><%=v.labels[inputs] %></label>" +
                                      //    " <% } %>" +
                                        " <% } %>" +
                                  "</div>" +
                              "</div>"
            ),


            UI: function() {

            		var m = this.model;
                    var noptions = this.options;
                    var change = this.change;



                    this.$("#" + this.options.params.view_id).buttonset();

                    //set selected
                    var params = m.get(noptions.params.isselect)

                 //TODO get param from model
                 //   for(var inputs in params){

                 //  	 this.$("#" +params[inputs]).remove();
                  /*   this.$("#" + this.options.params.view_id).append(
                         "<input type='" + this.options.params.type +
                         "' id='" + params[inputs] +
                         "' name='radio'><label class='buttonsetb' target ='"+ params[inputs] +
                         "'  for='"+ params[inputs] +"'>100</label>");
                    */

                  //  }
                     //  var selected

                    //save model
                         this.$(".buttonsetb").click(function(){

                                      var sel = $(this).attr('target');

                                     if ($.inArray( sel, params ) < 0){
                                        params.push(sel);
                                     }else{
                                     	params.splice($.inArray(sel, params),1);
                                     }


                           if (noptions.params.type == "checkbox"){
                               m.set(noptions.params.isselect,params);
                            } else {
                               m.set(noptions.params.isselect,sel);
                            }
                             //exten method
                             change(m);

						});

            },

            
            events: {
                    
                      'click'                 : "click",
                      'dblclick'              : "dblclick",
                      'click button.edit_comp'                 : "edit"
                    },


            click: function() {
                              },


             change: function(m) {

                              },

            //save model
            save: function(o,m) {
         				   	  saveModelForm(o,m);
                           //  this.model = m;
                              },

             edit: function() {

                // custom settings
                 if (EditEnable == 1){
                   
                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id
                           
                                }
                                ,{
                                  id:"title"
                                 ,label:"title"
                                 ,value:this.options.params.title
                                 }
                                ,{
                                  id:"type"
                                 ,label:"type(radio/checkbox)"
                                 ,value:this.options.params.type
                                 }
                                ,{
                                  id:"label"
                                 ,label:"label"
                                 ,value:this.options.params.label
                                 },
                                 {
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value
                                 }
                         		,{
                                  id:"isselect"
                                 ,label:"isselect"
                                 ,value:this.options.params.isselect
                                 }
                               ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }

                               ]
                        }
                      );
                        var vd =  new ViewData(); 

                         Render(new DialogFormViewEdit(st_m,vd));

            }}

   });








//GridView/////////////////////////////////////////////////
//GridViewEXT is fix for hidden context////////////////////

var GridViewEXT = function(m,v){


//makarov 10.04.15
//replace d_tmp_  to d_

//clear tag
$( "#d_tmp_" + v.view_id).remove();
$( "#" + v.view_id).remove();
$( "#pager_" + v.view_id).remove();


var html ="<div id='d_tmp_" + v.view_id +"' class = 'd_tmp_grid'  style ='position:absolute; top:" + v.top_p + "px; left: " + v.left_p + "px; width:" + v.width_p + "px; height:" + v.heigth_p + "px'>"+
			"<table class='gridtable' style='position:relative;z-index:10' grid = true id='" + v.view_id + "'></table>" +
             "<div id='pager_" + v.view_id + "'  style='position:relative;z-index:10' ></div>" +
             "</div>";

$( "#" + v.page ).append(html);

//prepare data and view

if (v.multiselect == "true" || v.multiselect == true){
 v.multiselect = true;
}else if (v.multiselect == "false" ){
 v.multiselect = false;

}
//fix for grouping
if (v.groupname == "" || v.groupname == undefined){
	v.groupname = undefined;
}else{
	if (v.groupname.indexOf(",")>0){
		v.groupname = v.groupname.split(",");
	}
}

//get data from appObject
 var mydata = m.get(v.source);

 if (!(mydata instanceof Array)){
 	mydata = [m.get(v.source)];
 }

 //fix for save model
 // m.set("source",v.source);

 if (mydata==undefined){
		 var mydata = {};
 }
 
 var rowdata = mydata[0];


//colNames
 var mycolnames = v.labels;

//get mycolmodel
 var mycolmodel = [];
 var mywidths = [];
 try{
  /*if (localStorage[v.view_id]){
	mywidths = localStorage[v.view_id].split(",");
  }else{
  	a = []; $.each(v.values,function(){a.push(v.width_p/v.values.length)});
  	localStorage[v.view_id] = a;
  	mywidths = a;
  }*/
  mywidths = v.widths.split(",");
 }catch(e){
 	mywidths=[];
 }

  for(var key in v.values){

     if ($.inArray( key, v.values )!= -1){

     v.values = $.grep(v.values, function(value) {
 			 return value != key;
			});

			if (mywidths[key]!="" || mywidths[key]!=undefined){
				v_width = mywidths[key]

			}else{
				v_width=0;
			}
            
             if (key.substring(0, 5) == 'summa'){
              mycolmodel.push({name:key,index:key,editable:true,sorttype:'float',formatter:'number', summaryType:'sum',width:v_width});
            }else if(key.substring(0, 5) == 'count'){
              mycolmodel.push({name:key,index:key,editable:true, summaryType:'count',width:v_width});
             }else{
              mycolmodel.push({name:key,index:key,editable:true,width:v_width});
             }

     }
   }

  //fix null oracle value
   for(var key in v.values){

   //fix for one column

           if(v.values[key] == "_"){
    		 mycolmodel.push({name:"_",index:"_",hidden: true,width:0,editable:false});
          }else{
          	if (mywidths[key]!="" || mywidths[key]!=undefined){
				v_width = mywidths[key]

			}else{
				v_width=0;
			}

           	 mycolmodel.push({name:v.values[key],index:v.values[key],editable:true,width:v_width});
           }

   }

 //add hidden columns
  for(var key in rowdata){

     if ($.inArray( key, v.values )== -1){
     
           mycolmodel.push({name:key,index:key,editable:false,hidden:true});
           mycolnames.push(key);
     }
   }


     //alert(JSON.stringify(mydata));
     //     alert(JSON.stringify(mycolmodel));

if (v["class"] == "reftableview"){
	//	var pager0 = "";
	 var pager0 = "#pager_" + v.view_id;
	}else{
	  var pager0 = "#pager_" + v.view_id;
}


//hide pager

if (v.hidepage == "true"){
		var pager0 = "";
}

//no hide for 
var hidegrid = true;
var heightx = '100%';
if (v["class"] == ""){
	//	var pager0 = "";
	 hidegrid = false;
	 heightx = v.heigth_p;
}

//modify title
var addtitle = "";
if ((!v.titlefunc=="" || v.titlefunc!=undefined) && $.isArray(mydata)){

 try{
	var arr = v.titlefunc.split(",");
	var index = arr[1];
	var n = 0;

	if (arr[0]=="summa"){
		for (i in mydata){
			if ($.isNumeric( mydata[i][index] )){
				n+= +mydata[i][index];		
			} 
		}
	}else{
	
	for (i in mydata){
			if (mydata[0]!=undefined){
				n+=1;	
			} 	 
		}
	}
	//only positive

	if(n<0){
			n = 0;
		}
   addtitle = " ( " + n + " ) ";
 }catch(e){
 	//$.notify(e,"error");
 }  

}

$("#" + v.view_id).jqGrid({

  datatype: "local",
  data:mydata,
  	colNames:mycolnames,
   	colModel:mycolmodel,
   	rowNum:10000,
   	rowList:[10,20,30],
   	pager: pager0,
    loadonce:true,
    pgtext:'{0}',
   // shrinkToFit:true,
    multiselect: v.multiselect,
    viewrecords: true,
    sortorder: "desc",
    grouping:true,
   	groupingView : {
   		groupField :$.isArray(v.groupname)?v.groupname:[v.groupname],
        groupColumnShow : [true],
        groupText : ['<b>{0}</b>'],
        groupCollapse : true,
        groupSummary : [true],
		showSummaryOnHide: true
   	},
	
	jsonReader : {
			root: "rows",
			page: "page",
			total: "total",
			records: "records",
			repeatitems: true,
			cell: "cell",
			id: "1",
			userdata: "userdata",
			subgrid: 
     			{root:"rows", 
				repeatitems: true, 
				cell:"cell"
    				}
 	},
	
    caption:v.title + addtitle,
    editurl: 'clientArray'
    ,height: heightx
    ,width: v.width_p
    ,hiddengrid: hidegrid
    /*,resizeStop: function(width, index) { 
        a = localStorage[v.view_id].split(",");
        a[index] = width;
        localStorage[v.view_id] = a;
    }*/
	,ondblClickRow: function(rowid) {
		
		if (v["class"] == "reftableview"){	
		
			var rowData = jQuery(this).getRowData(rowid); 
			
				//if not defined create new
				if (rowData.eobj_id==""){
					
					alert("Нет объектов для отображения!");
				}else{
					getAppModel(AppName).set("xchoose",v.view_id);
					openEntity({id:rowData.entity_key,eobj_id:rowData.eobj_id});
					
				}; 
				
			//alert(JSON.stringify(rowData));
			//executeApp("scoring_address");
		}
			
	}
   });



//set width
//for (var i in mycolnames){
//alert(mycolnames[i].length);
//$("#" + v.view_id).jqGrid('setColProp',v.values[i],{width:mycolnames[i].length*20});
//}

//$("#" + v.view_id).trigger("reloadGrid");


		//new branch

		if (v.newbuttons != "true"){

			$("#" + v.view_id ).navGrid("#pager_" + v.view_id,{edit:false,add:false,del:true, refresh: false}
			,{}
			,{}
			,{
				
			 // because I use "local" data I don't want to send the changes to the server
				// so I use "processing:true" setting and delete the row manually in onclickSubmit
				onclickSubmit: function(options, rowid) {
			
					var gridId = $.jgrid.jqID(this.id),
						p = this.p,
						newPage = p.page,
						$this = $(this);
			
					options.processing = true;
					
					
						//delete entity
								if (v["class"] == "reftableview"){		
									var rowData = $this.jqGrid("getRowData",rowid);  
										var data = getJSONObject("delete_entity", {eobj_id:rowData.eobj_id});
								}

				  var rowids = rowid.split(",");
			
					  for(var i in rowids) {
							$this.jqGrid('delRowData',rowids[i]);	
													
					  }

					$.jgrid.hideModal("#delmod" + gridId,
						{ gb: options.gbox, jqm: options.jqModal, onClose: options.onClose});




			
					if (p.lastpage > 1) {// on the multipage grid reload the grid
						if (p.reccount === 0 && newPage === p.lastpage) {
							// if after deliting there are no rows on the current page
							// which is the last page of the grid
							newPage--; // go to the previous page
						}
						// reload grid to make the row from the next page visable.
						$this.trigger("reloadGrid", [{page: newPage}]);
					}
			
			
				   // alert(JSON.stringify(deletedrows));
			
			
				  //  m.set("deletedrows",deletedrows);

				   //save model
					var newdata =     $( "#" + v.view_id ).jqGrid('getRowData');
					m.set(v.source,newdata);	

					$("#" + v.view_id ).jqGrid('setGridState','visible');//or 'visible'
			
		delete_entity
					return true;
			
				},
				processing: true
			}
			
			);


		if (v["class"] != "reftableview"){
			 $("#" + v.view_id ).jqGrid('inlineNav',"#pager_" + v.view_id);
		}else{

				//hack
				$("#pager_"+ v.view_id+" .ui-pg-button .ui-icon-plus").remove();

				$("#" + v.view_id ).navGrid("#pager_" + v.view_id,{edit:false,add:false,del:true, refresh: false}).navButtonAdd("#pager_" + v.view_id,{
					   caption:" ", 
					   buttonicon:"ui-icon ui-icon-plus", 
					   onClickButton: function(){ 
					   
							 var req = {entity_key:v.entity_key,eobj_id:getAppModel(AppName).get("eobj_id")};
							 
								var data = getJSONObject("create_child_entity",req);

										data.id = v.entity_key;
										data.open_in_new_window = v.open_in_new_window==undefined?"":v.open_in_new_window;
										
										getAppModel(AppName).set("xchoose",v.view_id);
												
									   	openEntity(data);
									
									
								//get new data
								//req.entity_key = AppName;
								//req.attr_key = v.source;
								
								//refresh chunk
								 // loadedScripts["refresh" + v.value] = "" + AppName + ".set("+JSON.stringify(data)+"); "; 
							//		executeScript("refresh" + v.value);
									
								 //   $("#" + v.view_id ).jqGrid('setGridState','visible');//or 'visible'
						
					   }, 
					   position:"last"
					});
		
			 
		};

   }else{	
   
     //hack
	 $("#pager_"+ v.view_id+" .ui-pg-button .ui-icon-plus").remove();
	  $("#pager_"+ v.view_id+" .ui-pg-button .ui-icon-pencil").remove();
	   $("#pager_"+ v.view_id+" .ui-pg-button .ui-icon-trash").remove();

	$("#" + v.view_id ).navGrid("#pager_" + v.view_id,
					{edit:false,add:false,del:false, refresh: false,search: false
					}).navButtonAdd("#pager_" + v.view_id,{
					   caption:" ", 
					   buttonicon:"ui-icon ui-icon-plus", 
					   onClickButton: function(){ 
						
					   }, 
					   position:"last"
					}).navButtonAdd("#pager_" + v.view_id,{
					   caption:" ", 
					   buttonicon:"ui-icon ui-icon-pencil", 
					   onClickButton: function(){ 
					   
						
					   }, 
					   position:"last"
					}).navButtonAdd("#pager_" + v.view_id,{
					   caption:" ", 
					   buttonicon:"ui-icon ui-icon-trash", 
					   onClickButton: function(){ 
					   
						
					   }, 
					   position:"last"
					});			

   }


//$(  ".d_tmp_grid").css('width', '25%');
//$(".ui-jqgrid-titlebar").hide();


}

///GridViewE --for entity

var GridViewE =  BaseView.extend({

  template: _.template("" +
   					 	"<div id='d_<%=v.view_id%>' grid = 'true' style ='position:absolute;top: <%=v.top_p%>px; left: <%=v.left_p%>px; width:<%=v.width_p%>px; height:<%=v.heigth_p%>px'>"+
                        "</div>"
   ),


    UI: function() {
		
		GridViewEXTE(this.model,this.options.params)
		//add validate	
		//setTableValidation(this.options.params.source);


		//define events 
		var onDblClickRow = this.onDblClickRow;
		var onClickRow = this.onClickRow;
		var onAddClick = this.onAddClick;
		var onEditClick = this.onEditClick;
		var onDeleteClick = this.onDeleteClick;

		var noptions = this.options.params;
		var model = this.model;


	

	if (noptions.newbuttons == "true"){		
   		$("#" + noptions.view_id ).jqGrid('filterToolbar',{stringResult: true, searchOnEnter: false, defaultSearch: 'cn'});
		$("#" + noptions.view_id ).jqGrid('setGridParam', { onSelectRow: function(id){ onClickRow(id); } } );
		$("#" + noptions.view_id ).jqGrid('setGridParam', { ondblClickRow: function(id){ onDblClickRow(id); } } );


	}

		$("#pager_" + noptions.view_id + " .ui-icon-plus").click(
											function(){

													onAddClick();
													return;

													});		
			$("#pager_" + noptions.view_id + " .ui-icon-pencil").click(
											function(){

													onEditClick($("#" +noptions.view_id + " tr[aria-selected=true]").attr("id"),noptions.view_id);
													return;
													});		
			$("#pager_" + noptions.view_id + " .ui-icon-trash").click(
											function(){

													onDeleteClick($("#" +noptions.view_id + " tr[aria-selected=true]").attr("id"));
													return;

													});		

    },


   events: {
                      'click button.edit_comp'                 : "edit"
                     
                    },

   //to do save model in Backbone
   getGridData:  function() {

     var newdata =     $("#" + this.options.params.view_id).jqGrid('getRowData');
        return newdata;
   },

    getGridDataID:  function(id) {

     var newdata =     $("#" + this.options.params.view_id).jqGrid('getRowData',id);
        return newdata;
   },


    delRowDataID:  function(id) {

                  $("#" + this.options.params.view_id).jqGrid('delRowData',id);

   },

   getSelData:  function() {

     var newdata =     $("#" + this.options.params.view_id).jqGrid('getGridParam', 'selarrrow');
        return _.clone(newdata);
   },

   getSelRow:  function() {

     var newdata =     $("#" + this.options.params.view_id).jqGrid('getGridParam', 'selrow');
        return _.clone(newdata);
   },


   onClickRow:function(id){
				
   },	


   onDblClickRow:function(id){
		
   },	

   onAddClick:function(){	
   },	

   onEditClick:function(id,view){

//   	 $("#" + view).jqGrid('editGridRow', id, true );
	
   },	

   onDeleteClick:function(id){
	
   },	

   edit: function() {

                // custom settings
                 if (EditEnable == 1){
                   
                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id
                           
                                }
                                ,{
                                  id:"page"
                                 ,label:"page"
                                 ,value:this.options.params.page
                                 },
                                {
                                  id:"title"
                                 ,label:"title"
                                 ,value:this.options.params.title
                                 },
                                 {
                                  id:"titlefunc"
                                 ,label:"titlefunc"
                                 ,value:this.options.params.titlefunc
                                 },
                                 {
                                  id:"multiselect"
                                 ,label:"multiselect"
                                 ,value:this.options.params.multiselect
                                 },
                                 {
                                  id:"groupname"
                                 ,label:"groupname"
                                 ,value:this.options.params.groupname
                                 },
                                 {
                                  id:"source"
                                 ,label:"source"
                                 ,value:this.options.params.source
                                 },

                                {
                                  id:"entity_key"
                                 ,label:"entity_key"
                                 ,value:this.options.params.entity_key
                                 },

                                {
                                  id:"label"
                                 ,label:"label"
                                 ,value:this.options.params.label
                                 },
                                {
                                  id:"widths"
                                 ,label:"widths"
                                 ,value:this.options.params.widths
                                 },
                                 {
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value
                                 }
                                ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
 							    ,{
                                  id:"newbuttons"
                                 ,label:"newbuttons"
                                 ,value:this.options.params.newbuttons
                                 }
							     ,{
                                  id:"hidepage"
                                 ,label:"hidepage"
                                 ,value:this.options.params.hidepage
                                 }
                                ,{
                                  id:"rownum"
                                 ,label:"rownum"
                                 ,value:this.options.params.rownum
                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }
                               ,{
                                  id:"open_in_new_window"
                                 ,label:"open_in_new_window"
                                 ,value:this.options.params.open_in_new_window

                                 }
 
                               ]
                        }
                      );
                        var vd =  new ViewData(); 

                         Render(new DialogFormViewEdit(st_m,vd));

            }}

   });



//GridView/////////////////////////////////////////////////
//GridViewEXT is fix for hidden context////////////////////

var GridViewEXTE = function(m,v){

//clear tag
$( "#d_" + v.view_id).remove();
$( "#d_" + v.view_id).remove();

if (m.get(v.source) == "null"){
	var html ="<div id='d_" + v.view_id +"' class = 'd_tmp_grid'  style ='font-size: 12px; position:absolute; top:" + v.top_p + "px; left: " + v.left_p + "px; width:" + v.width_p + "px; height:" + v.heigth_p + "px'>"+
             "<div id='tmp_" + v.view_id + "'>загружется...</div>" +
             "</div>";

$( "#" + v.page ).append(html);
	return;
}
//makarov 10.04.15
//replace d_tmp_  to d_
//$( "#" + v.view_id).remove();
//$( "#pager_" + v.view_id).remove();


var html ="<div id='d_" + v.view_id +"' class = 'd_tmp_grid'  style ='position:absolute; top:" + v.top_p + "px; left: " + v.left_p + "px; width:" + v.width_p + "px; height:" + v.heigth_p + "px'>"+
			"<table class='gridtable' style='position:relative;z-index:900' grid = true id='" + v.view_id + "'></table>" +
             "<div id='pager_" + v.view_id + "'  style='position:relative;z-index:900' ></div>" +
             "</div>";

$( "#" + v.page ).append(html);

//prepare data and view

if (v.multiselect == "true" || v.multiselect == true){
 v.multiselect = true;
}else if (v.multiselect == "false" ){
 v.multiselect = false;

}

//fix for grouping
if (v.groupname == "" || v.groupname == undefined){
	v.groupname = undefined;
}else{
	if (v.groupname.indexOf(",")>0){
		v.groupname = v.groupname.split(",");
	}
}

//get data from appObject
 var mydata = m.get(v.source);

 if (!(mydata instanceof Array)){
 	mydata = [m.get(v.source)];
 }

 //fix for save model
 // m.set("source",v.source);

 if (mydata==undefined){
		 var mydata = {};
 }
 
 var rowdata = mydata[0];


//colNames
 var mycolnames = v.labels;

//get mycolmodel
 var mycolmodel = [];
  var mywidths = [];
 try{
  /*if (localStorage[v.view_id]){
	mywidths = localStorage[v.view_id].split(",");
  }else{
  	a = []; $.each(v.values,function(){a.push(v.width_p/v.values.length)});
  	localStorage[v.view_id] = a;
  	mywidths = a;
  }*/
    mywidths = v.widths.split(",");
 }catch(e){
 	mywidths=[];
 }

  for(var key in v.values){

     if ($.inArray( key, v.values )!= -1){

     v.values = $.grep(v.values, function(value) {
 			 return value != key;
			});

			if (mywidths[key]!="" || mywidths[key]!=undefined){
				v_width = mywidths[key]

			}else{
				v_width=0;
			}
            
             if (key.substring(0, 5) == 'summa'){
              mycolmodel.push({name:key,index:key,editable:true,sorttype:'float',formatter:'number', summaryType:'sum',width:v_width});
            }else if(key.substring(0, 5) == 'count'){
              mycolmodel.push({name:key,index:key,editable:true, summaryType:'count',width:v_width});
             }else{
              mycolmodel.push({name:key,index:key,editable:true,width:v_width});
             }

     }
   }

  //fix null oracle value
   for(var key in v.values){

   //fix for one column

           if(v.values[key] == "_"){
    		 mycolmodel.push({name:"_",index:"_",hidden: true,width:0,editable:false});
          }else{
          	if (mywidths[key]!="" || mywidths[key]!=undefined){
				v_width = mywidths[key]

			}else{
				v_width=0;
			}

           	 mycolmodel.push({name:v.values[key],index:v.values[key],editable:true,width:v_width});
           }

   }

 //add hidden columns
  for(var key in rowdata){

     if ($.inArray( key, v.values )== -1){
     
           mycolmodel.push({name:key,index:key,editable:false,hidden:true});
           mycolnames.push(key);
     }
   }


     //alert(JSON.stringify(mydata));
     //     alert(JSON.stringify(mycolmodel));

if (v["class"] == "reftableview"){
	//	var pager0 = "";
	 var pager0 = "#pager_" + v.view_id;
	}else{
	  var pager0 = "#pager_" + v.view_id;
}


//hide pager

if (v.hidepage == "true"){
		var pager0 = "";
}

//no hide for 
var hidegrid = true;
//makarov 28.08.2015 set default 200px (change 20%)
var heightx = '20%';
if (v["class"] == ""){
	//	var pager0 = "";
	 hidegrid = false;
	 heightx = v.heigth_p;
}

//makarov set rownum number 31.08.2015
var vrownum = '10000';
if (v["rownum"] != "" && v["rownum"] !=undefined){
	vrownum = v["rownum"];
	heightx = v.heigth_p;
}


//modify title
var addtitle = "";
if ((!v.titlefunc=="" || v.titlefunc!=undefined) && $.isArray(mydata)){

 try{
	var arr = v.titlefunc.split(",");
	var index = arr[1];
	var n = 0;

	if (arr[0]=="summa"){
		for (i in mydata){
			if ($.isNumeric( mydata[i][index] )){
				n+= +mydata[i][index];		
			} 
		}
	}else{
	
	for (i in mydata){
			if (mydata[0]!=undefined){
				n+=1;	
			} 	 
		}
	}
	//only positive

	if(n<0){
			n = 0;
		}
   addtitle = " ( " + n + " ) ";
 }catch(e){
 	//$.notify(e,"error");
 }  

}


$("#" + v.view_id).jqGrid({

  datatype: "local",
  data:mydata,
  	colNames:mycolnames,
   	colModel:mycolmodel,
   	rowNum:vrownum,
   	rowList:[10,20,30],
   	pager: pager0,
    loadonce:true,
    pgtext:'{0}',
   // shrinkToFit:true,
    multiselect: v.multiselect,
    viewrecords: true,
    sortorder: "desc",
    grouping:true,
   	groupingView : {
   		groupField : $.isArray(v.groupname)?v.groupname:[v.groupname],
        groupColumnShow : $.isArray(v.groupname)?[true,true]:[true],
        groupText : ['<b>{0}</b>'],
        groupCollapse : true,
      //  groupSummary : $.isArray(v.groupname)?[true,true]:[true],
	//	showSummaryOnHide: true
   	},
	
	jsonReader : {
			root: "rows",
			page: "page",
			total: "total",
			records: "records",
			repeatitems: true,
			cell: "cell",
			id: "1",
			userdata: "userdata",
			subgrid: 
     			{root:"rows", 
				repeatitems: true, 
				cell:"cell"
    				}
 	},
	
    caption:v.title + addtitle,
    editurl: 'clientArray'
    ,height: heightx
    ,width: v.width_p
    ,hiddengrid: hidegrid
    /*,resizeStop: function(width, index) { 
        a = localStorage[v.view_id].split(",");
        a[index] = width;
        localStorage[v.view_id] = a;
    }*/
    ,loadComplete:function(data){
       //if (m.hasChanged(v.source)){  expand tree validate
       	 setTableValidation(v.source);
      // }
    }
	,ondblClickRow: function(rowid) {
		
		if (v["class"] == "reftableview"){	
		
			var rowData = jQuery(this).getRowData(rowid); 
			
				//if not defined create new
				if (rowData.eobj_id==""){
					
					alert("no objects!");
				}else{
					getAppModel(AppName).set("xchoose",v.view_id); 
					openEntity({id:rowData.entity_key,eobj_id:rowData.eobj_id,
								open_in_new_window:v.open_in_new_window==undefined?"":v.open_in_new_window});
					
				}; 
				
			//alert(JSON.stringify(rowData));
			//executeApp("scoring_address");
		}
			
	}
   });

//fix add title
$("#d_"+v.view_id+" .ui-jqgrid-title").text(v.title + addtitle);

//set width
//for (var i in mycolnames){
//alert(mycolnames[i].length);
//$("#" + v.view_id).jqGrid('setColProp',v.values[i],{width:mycolnames[i].length*20});
//}

//$("#" + v.view_id).trigger("reloadGrid");


		//new branch

		if (v.newbuttons != "true"){

			$("#" + v.view_id ).navGrid("#pager_" + v.view_id,{edit:false,add:false,del:true, refresh: false}
			,{}
			,{}
			,{
				
			 // because I use "local" data I don't want to send the changes to the server
				// so I use "processing:true" setting and delete the row manually in onclickSubmit
				onclickSubmit: function(options, rowid) {
			
					var gridId = $.jgrid.jqID(this.id),
						p = this.p,
						newPage = p.page,
						$this = $(this);
			
					options.processing = true;
					
					
						//delete entity
								if (v["class"] == "reftableview"){		
									var rowData = $this.jqGrid("getRowData",rowid);  
										var data = getJSONObject("delete_entity", {eobj_id:rowData.eobj_id});
								}

				  var rowids = rowid.split(",");
			
					  for(var i in rowids) {
							$this.jqGrid('delRowData',rowids[i]);	
													
					  }

					$.jgrid.hideModal("#delmod" + gridId,
						{ gb: options.gbox, jqm: options.jqModal, onClose: options.onClose});




			
					if (p.lastpage > 1) {// on the multipage grid reload the grid
						if (p.reccount === 0 && newPage === p.lastpage) {
							// if after deliting there are no rows on the current page
							// which is the last page of the grid
							newPage--; // go to the previous page
						}
						// reload grid to make the row from the next page visable.
						$this.trigger("reloadGrid", [{page: newPage}]);
					}
			
			
				   // alert(JSON.stringify(deletedrows));
			
			
				  //  m.set("deletedrows",deletedrows);

				   //save model
					var newdata =     $( "#" + v.view_id ).jqGrid('getRowData');
					m.set(v.source,newdata);	

					$("#" + v.view_id ).jqGrid('setGridState','visible');//or 'visible'
			
			
					return true;
			
				},
				processing: true
			}
			
			);


		if (v["class"] != "reftableview"){
			 $("#" + v.view_id ).jqGrid('inlineNav',"#pager_" + v.view_id);

			 //default add events 10.06.2015
			  $("#" + v.view_id ).bind("jqGridInlineAfterSaveRow", function (e, rowid, orgClickEvent) {
			  		var newdata =     $( "#" + v.view_id ).jqGrid('getRowData');
					m.set(v.source,newdata);	

				});

		}else{

				//hack
				$("#pager_"+ v.view_id+" .ui-pg-button .ui-icon-plus").remove();

				$("#" + v.view_id ).navGrid("#pager_" + v.view_id,{edit:false,add:false,del:true, refresh: false}).navButtonAdd("#pager_" + v.view_id,{
					   caption:" ", 
					   buttonicon:"ui-icon ui-icon-plus", 
					   onClickButton: function(){ 
					   
							 var req = {entity_key:v.entity_key,eobj_id:getAppModel(AppName).get("eobj_id")};
							 
								var data = getJSONObject("create_child_entity",req);

										data.id = v.entity_key;
										data.open_in_new_window = v.open_in_new_window==undefined?"":v.open_in_new_window;
										
										getAppModel(AppName).set("xchoose",v.view_id);
												
									   	openEntity(data);
									
									
								//get new data
								//req.entity_key = AppName;
								//req.attr_key = v.source;
								
								//var data = getJSONObject("PKG_ENTITY_WEB_FORM.GET_ATTR_SOURCE",req);
								//refresh chunk
								 // loadedScripts["refresh" + v.value] = "" + AppName + ".set("+JSON.stringify(data)+"); "; 
							//		executeScript("refresh" + v.value);
									
								 //   $("#" + v.view_id ).jqGrid('setGridState','visible');//or 'visible'
						
					   }, 
					   position:"last"
					});
		
			 
		};

   }else{	
   
     //hack
	 $("#pager_"+ v.view_id+" .ui-pg-button .ui-icon-plus").remove();
	  $("#pager_"+ v.view_id+" .ui-pg-button .ui-icon-pencil").remove();
	   $("#pager_"+ v.view_id+" .ui-pg-button .ui-icon-trash").remove();

	$("#" + v.view_id ).navGrid("#pager_" + v.view_id,
					{edit:false,add:false,del:false, refresh: false,search: false
					}).navButtonAdd("#pager_" + v.view_id,{
					   caption:" ", 
					   buttonicon:"ui-icon ui-icon-plus", 
					   onClickButton: function(){ 
					   
						
					   }, 
					   position:"last"
					}).navButtonAdd("#pager_" + v.view_id,{
					   caption:" ", 
					   buttonicon:"ui-icon ui-icon-pencil", 
					   onClickButton: function(){ 
					   
						
					   }, 
					   position:"last"
					}).navButtonAdd("#pager_" + v.view_id,{
					   caption:" ", 
					   buttonicon:"ui-icon ui-icon-trash", 
					   onClickButton: function(){ 
					   
						
					   }, 
					   position:"last"
					});

   }


//$(  ".d_tmp_grid").css('width', '25%');
//$(".ui-jqgrid-titlebar").hide();




}

var GridView =  BaseView.extend({

  template: _.template("" +
   					 	"<div id='d_<%=v.view_id%>' grid = 'true' style ='position:absolute;top: <%=v.top_p%>px; left: <%=v.left_p%>px; width:<%=v.width_p%>px; height:<%=v.heigth_p%>px'>"+
                        "</div>"
   ),


    UI: function() {
		
		GridViewEXT(this.model,this.options.params)
		//add validate	
		setTableValidation(this.options.params.source);


		//define events 
		var onDblClickRow = this.onDblClickRow;
		var onClickRow = this.onClickRow;
		var onAddClick = this.onAddClick;
		var onEditClick = this.onEditClick;
		var onDeleteClick = this.onDeleteClick;

		var noptions = this.options.params;



	

	if (noptions.newbuttons == "true"){		
   		$("#" + noptions.view_id ).jqGrid('filterToolbar',{stringResult: true, searchOnEnter: false, defaultSearch: 'cn'});
		$("#" + noptions.view_id ).jqGrid('setGridParam', { onSelectRow: function(id){ onClickRow(id); } } );
		$("#" + noptions.view_id ).jqGrid('setGridParam', { ondblClickRow: function(id){ onDblClickRow(id); } } );


	}

		$("#pager_" + noptions.view_id + " .ui-icon-plus").click(
											function(){

													onAddClick();
													return;

													});		
			$("#pager_" + noptions.view_id + " .ui-icon-pencil").click(
											function(){

													onEditClick($("#" +noptions.view_id + " tr[aria-selected=true]").attr("id"),noptions.view_id);
													return;
													});		
			$("#pager_" + noptions.view_id + " .ui-icon-trash").click(
											function(){

													onDeleteClick($("#" +noptions.view_id + " tr[aria-selected=true]").attr("id"));
													return;

													});																																							

    },


   events: {
                      'click button.edit_comp'                 : "edit"
                     
                    },

   //to do save model in Backbone
   getGridData:  function() {

     var newdata =     $("#" + this.options.params.view_id).jqGrid('getRowData');
        return newdata;
   },

    getGridDataID:  function(id) {

     var newdata =     $("#" + this.options.params.view_id).jqGrid('getRowData',id);
        return newdata;
   },


    delRowDataID:  function(id) {

                  $("#" + this.options.params.view_id).jqGrid('delRowData',id);

   },

   getSelData:  function() {

     var newdata =     $("#" + this.options.params.view_id).jqGrid('getGridParam', 'selarrrow');
        return _.clone(newdata);
   },

   getSelRow:  function() {

     var newdata =     $("#" + this.options.params.view_id).jqGrid('getGridParam', 'selrow');
        return _.clone(newdata);
   },


   onClickRow:function(id){
				
   },	


   onDblClickRow:function(id){
		
   },	

   onAddClick:function(){
		
   },	

   onEditClick:function(id,view){

//   	 $("#" + view).jqGrid('editGridRow', id, true );
	
   },	

   onDeleteClick:function(id){
	
   },	

   edit: function() {

                // custom settings
                 if (EditEnable == 1){
                   
                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id
                           
                                }
                                ,{
                                  id:"page"
                                 ,label:"page"
                                 ,value:this.options.params.page
                                 },
                                {
                                  id:"title"
                                 ,label:"title"
                                 ,value:this.options.params.title
                                 },
                                 {
                                  id:"titlefunc"
                                 ,label:"titlefunc"
                                 ,value:this.options.params.titlefunc
                                 },
                                 {
                                  id:"multiselect"
                                 ,label:"multiselect"
                                 ,value:this.options.params.multiselect
                                 },
                                 {
                                  id:"groupname"
                                 ,label:"groupname"
                                 ,value:this.options.params.groupname
                                 },
                                 {
                                  id:"source"
                                 ,label:"source"
                                 ,value:this.options.params.source
                                 },

                                {
                                  id:"entity_key"
                                 ,label:"entity_key"
                                 ,value:this.options.params.entity_key
                                 },

                                {
                                  id:"label"
                                 ,label:"label"
                                 ,value:this.options.params.label
                                 },
                               {
                                  id:"widths"
                                 ,label:"widths"
                                 ,value:this.options.params.widths
                                 },
                                 {
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value
                                 }
                                ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
 							    ,{
                                  id:"newbuttons"
                                 ,label:"newbuttons"
                                 ,value:this.options.params.newbuttons
                                 }
							     ,{
                                  id:"hidepage"
                                 ,label:"hidepage"
                                 ,value:this.options.params.hidepage
                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }
 
                               ]
                        }
                      );
                        var vd =  new ViewData(); 

                         Render(new DialogFormViewEdit(st_m,vd));

            }}

   });


   
//PivotView/////////////////////////////////////////////////

var PivotView =  BaseView.extend({

          template: _.template(""+
                          "<div id='d_<%=v.view_id%>' title='<%=v.title%>' style ='position:absolute; top: <%=v.top_p%>px; left: <%=v.left_p%>px; width:<%=v.width_p%>px; height:<%=v.heigth_p%>px'>"+
                            "<h1><%=v.title%></h1>"+
                              "<div id='<%=v.view_id%>'></div>" +
                              "</div>"
            ),


            UI: function() {

       	   	  var data = this.model.get(this.options.params.source);

				// to do cuspom settings for row and colums
				//get model settings for grid
				//		  var mydatarow = data[0];


    					  this.$("#" + this.options.params.view_id).pivotUI(data);

            },

            
            events: {
                    
                      'click'                 : "click",
                      'dblclick'              : "dblclick",
                      'click button.edit_comp'                 : "edit"
                    },


            click: function() {

                              },

            //save model
            save: function(m) {
         				   	  saveModelForm(m);
                           //  this.model = m;
                              },

             edit: function() {

                // custom settings
                 if (EditEnable == 1){
                   
                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id
                           
                                }
                                ,{
                                  id:"title"
                                 ,label:"title"
                                 ,value:this.options.params.title
                                 }
                                  ,{
                                  id:"source"
                                 ,label:"source"
                                 ,value:this.options.params.source
                                 }
                                ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }
                               /*   ,{
                                  id:"label"
                                 ,label:"label"
                                 ,value:this.options.params.label
                                 }
                                 ,{
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value
                                 }
                                 */
                               ]
                        }
                      );
                        var vd =  new ViewData(); 

                         Render(new DialogFormViewEdit(st_m,vd));

            }}

   });


   
//MainMenuView/////////////////////////////////////////////////

var MainMenuView =  BaseView.extend({

            template: _.template(""+
					 "<div id='d_<%=v.view_id%>' title='<%=v.title%>' style ='position:absolute; top: <%=v.top_p%>px; left: <%=v.left_p%>px;'>"+
                          "<div id='cssmenu'>"+
                           "<ul>"+
						 "<% for(var inputs in v.values){ %>" +
							"<li class='_target' id = '<%=v.values[inputs]%>'><span><%=v.labels[inputs] %></span></li>"+
						   " <% } %>" +
                          "</ul>" +
                         "</div>" + 
					 "</div>"
            ),


            UI: function() {
            
            //create pages..
            var xi = 0;
            for (inputs in this.options.params.values){

                  $("#app").append("<div class='newpage' id =" + this.options.params.values[inputs] + "></div>");

               //hide other pages
               xi++;
               if (xi>1){
                  $("#" + this.options.params.values[inputs]).hide();
               }

            }

                 this.$( "._target" ).click(function() {

                 			 var selected =$(this).attr('id');

                             $( ".newpage").hide();
                              $( "#" + selected).show();
							});
            },

            
            events: {
                      'click button.edit_comp'                 : "edit"
                    },

             edit: function() {
               
                // custom settings
                 if (EditEnable == 1){
                   
                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id

                                }

                                 ,{
                                  id:"label"
                                 ,label:"label"
                                 ,value:this.options.params.label
                                 }
                                 ,{
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value
                                 }
                                 ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }

                               ]
                        }
                      );
                        var vd =  new ViewData(); 

                         Render(new DialogFormViewEdit(st_m,vd));

            }}

   });


function bindToReq(pname,pm,pattr,func){
	
	var model = getAppModel(AppName);

	   if (model.get("xchoose")==pname){ 
		   goToByScroll("d_" + prefix + pname);	
		   
		   if (getAppModel(pm)!=undefined){
		        
              try{  
			    model.set("xchoose","");

				 if (typeof pattr == 'object'){
                    var dobj = {};
                      for (key in pattr){
							var v = getAppModel(pm).get(pattr[key]);

                            if (v==undefined||v==""){v = " ";};
								dobj[pattr[key]] = v;
                       }

                        model.set(dobj);

                  }else{

					
					 model.set(pname,getAppModel(pm).get(pattr));
				}

				  if (model.changedAttributes()!= false){
						changedEntity.set(model.changedAttributes());
						changedEntity.set({eobj_id:getAppModel(AppName).get("eobj_id")});
						
					 showSaveDialog(model);
				  } 

			  ///execut some function
			   if (func!=undefined){
			  	 func();
			   }	

              }catch(e){
				    model.set("xchoose","");
               // model.set(pname,"");
              }  
		   }
	}
}


function openEntity(e){

	//open in new window
	try{
			if (e.open_in_new_window=="true"){ //&& false){
				req = _.clone(intiReq);
				req.func = "openEntity";
				req.params.id = e.id;
				req.params.name = e.name;
				req.params.entity_key = e.entity_key;
				req.params.eobj_id = e.eobj_id;
				if (e.eobj_id==0){
					req.params.reference = e.reference;
					req.params.branch=e.branch;
				}

				req.prefix = e.id;
				nw = window.open(conection_data.urlDb +'/#' + JSON.stringify(req), '_blank',
				 "width=1024,height=768,scrollbars=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,resizable=no,copyhistory=no");
				//nw.addToAppRequest(getAppModel(AppName));	
				return;
			}
						
		}catch(e){
			$.notify(e, "error");
			return;
		}

	$.ajax({
				cache:false, 
                 beforeSend: function() {
      			
                 	 createProgress();
					 
      
                },
                complete: function(data, textStatus, xhr) {
	
						
						openEntity0(e);	
					
						deleteProgress();
                }
	});	

}


function openEntity0(e){
	
	try{
		//save before go 31.05.2016
		if (getAppModel(AppName) !=undefined){
			saveEntity();
		}
	}catch(e){};
	
	$('.notifyjs-foo-base .yes').trigger('click');


    //clear previos error
    error_list = {};
    
    //hack for equals entitys
    var sameentity = false;
	if (e.sameentity==true){
		sameentity = true;	
	}
	//cancel toLowerCase
	e.toLowerCase = false;

		var e = getAppObject("get_entity_by_objid",e);	
			e.set("sameentity",sameentity);

			// alert("point_key: " + e.get("point_key"))

		 addToAppRequest(e);
	  	 executeApp(e.id);
}

var entry_point;



//TO DO  fix indexLoadedScripts  length...

function executeApp(selected, modal, ok, deffered_call){


	location.hash = selected


	//open in new window
	try{
			if (modal=="false"){ //&& false){
				req = _.clone(intiReq);
				req.func = "executeApp";
				req.params.id = selected;
				req.params.name = selected;
				req.prefix = selected;
				nw = window.open(conection_data.urlDb +'/#' + JSON.stringify(req), '_blank',
				 "width=1024,height=768,scrollbars=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,resizable=no,copyhistory=no");
				//nw.addToAppRequest(getAppModel(AppName));	
				return;
			}
						
		}catch(e){
			$.notify(e, "error");
			return;
		}
	
	
		$.ajax({
				cache:false, 
                 beforeSend: function() {
      			
                 	 createProgress();
					 
      
                },
                complete: function(data, textStatus, xhr) {
	
						//router.navigate("app/" + selected, true, true);
						executeApp0(selected, modal, ok, deffered_call);	
					
						deleteProgress();
                }
	});	


}

function executeApp0(selected, modal, ok, deffered_call){


	if (modal){
		Question("<div id='app2' style='position:absolute; left:10px'></div>", ok); 

		//$(".ui-dialog-buttonpane").hide();
		$(".ui-dialog-titlebar").hide();
		$(".ui-dialog").css({top:"25px", left:"25px","z-index":999, "width":"900px", "height":"600px"});
		$("#d_question").height("530px");
   	    $("#d_question").parent().width("900px");

		renderObjAttr = true;     
		drawButns = false;       
		renderModal = true;
		executeScript(selected);

		//hack
		
		$(".ui-menu").css("z-index", 9999);
		$(".ui-dialog-buttonset").find("button").click(function(){
			$("#app2").remove();
			$(".ui-dialog").remove();
		});

		try{
			deffered_call();
		}catch(e){
			
		}


		renderModal = false;
		getAppSettings(indexLoadedScripts[indexLoadedScripts.length-1])
		return;
	}

	renderObjAttr = true;

if (entry_point!=undefined){
          
	drawButns = false;        

}

	try{
		//save before go 31.05.2016
		if (getAppModel(AppName) !=undefined){
			saveEntity();
		}
	}catch(e){};
		
	//if not save clear changedEntity
		 $('.notifyjs-foo-base .yes').trigger('click');
         $("#app").empty();
		 
	// go to top_p
		window.scrollTo(0, 0);	
		//fix size window
	    $("#app").height(0);

	                 try{
	                 	if (indexLoadedScripts.length == 0){
							entry_point = selected;
						}
	                 }catch(e){
	                 	window.location = conection_data.urlDb;
	                 }	
	

						
					//	if ($.inArray(selected,indexLoadedScripts)<0){ 
		 					indexLoadedScripts.push(selected);
					//	}

                        if (loadedScripts[selected]==undefined){
         					 	  var client_scr = getScript("get_script",{name:selected});

								  //add ajax call to //pragma static

								 /*	
								  var p_index = client_scr.indexOf("//pragma static");

								  if (p_index>0 ){
 									client_scr = client_scr.substr(0,client_scr.indexOf("//pragma static"));	
								  }
								*/	
								 
								  //client_scr = client_scr.substr()


                                  loadedScripts[selected] = client_scr;
									
								try{	
									$.globalEval(client_scr);
								}catch(e){
									 $.notify(e, "error");	
								}	
                         }else if(loadedScripts[selected]!=undefined){

                         		try{	
									$.globalEval(loadedScripts[selected]);
								}catch(e){
									 $.notify(e, "error");	
								}
                         	

                         }
//				});		 
						 
	
//TODO replace to component						 
			$('#backtotop').click(function() {
				$('body,html').animate({scrollTop:0},0);
			});			 

try{

	//add deffered_call
	if (getAppModel(AppName).has("deffered_call")) {

	var func = getAppModel(AppName).get("deffered_call").func;
	getAppModel(AppName).unset("deffered_call");

		 try{	  
			func();
		 }catch(e){
			 $.notify(e,"error");
		 }
	}
}catch(e){

}


var sameentity0 = false;

try{
var sameentity0  =	getAppModel(AppName).get("sameentity");
}catch(e){
}
						 
//add border	
if ((indexLoadedScripts.length > 1
 && entry_point != selected
)||sameentity0){
       
//add close button

var btn_settings = {
     params:{
		id:"back",
		view_id:"back",
		caption:"X назад",
		top_p:60,
		left_p:-65,
		width_p:128,
		heigth_p:28
    }
};



app_settings["back_view"] = btn_settings;

       var back = newAppObject({});
           var backView =  BuutonBackView.extend({

           		click: function(){
           			
                 indexLoadedScripts.pop();

              if (indexLoadedScripts.length>0){

                 var previos = indexLoadedScripts[indexLoadedScripts.length - 1];  
				 
				 //if not save clear changedEntity
				 $('.notifyjs-foo-base .yes').trigger('click');
				 
				 // changedEntity.destroy();
				  
				  //getAppModel(AppName).destroy();
					//is_shown = false;
					//	$(".notifyjs-corner").remove();	
					
				 var pr_label;
				 
				 //if not in model_Collection
				 var sameentity = false;
				 try{
					 sameentity = getAppModel(AppName).get("sameentity");
					 pr_label =  getAppModel(previos).get("xchoose");

				 }catch(e){
					 sameentity = false;
				 }
				 
				 if (sameentity){
					
					openEntity({id:AppName.toLowerCase(),eobj_id:getAppModel(AppName).get("eobj_id_from")});
					 
				 }else{
				 
				  eval("model_Collection.remove("+AppName.toLowerCase()+");")
                  executeApp(previos);
				 } 
				  //scroll to target table and expand
				 
						 if (pr_label!=undefined || pr_label !=""){ 
						 
						   if ($("#d_" + pr_label).length !=0){
						
							 goToByScroll("d_" + pr_label);
							 $("#" + pr_label).jqGrid('setGridState','visible');
						
						   }
						 } 
				  
                }
				  //popov 08.12.2015
                  indexLoadedScripts.pop();

                }

           });

         //  Render(new backView(back,"back_view"),"app");

         
		   
		   //ok button if non-entity app_settings
//if (app_settings["v_final"]!=undefined){
//}		   
		   
};	

};	

//makarov 08.06.2016 add loading ext js & css lib
function loadExtJs(name){
	$.ajax({
		async:false,
		type:'GET',
		url:"js-ext/"+name+".js",
		dataType:'script',
		error: function(xhr, textStatus, errorThrown) {
			// Look at the `textStatus` and/or `errorThrown` properties.
		}
	});

}
function loadExtCss(name){
	if ($('head').find("link[href='js-ext/"+name+".css']").length==0){
		$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'js-ext/'+name+'.css') );
	}
}


function executeScript(selected){

                        if (loadedScripts[selected]==undefined){

         					 	  var client_scr = getScript("get_script",{name:selected});
                                  loadedScripts[selected] = client_scr;

									$.globalEval(client_scr);
                         }else if(loadedScripts[selected]!=undefined){

                         	$.globalEval(loadedScripts[selected]);
                         		  //	$.globalEval(loadedScripts[selected]);

                         }

}

//Menu2View/////////////////////////////////////////////////
var Menu2View =  BaseView.extend({

            template: _.template(""+
                          "<div id='cssmenu'>"+
                           "<ul>"+
                            "<li class='has-sub'><span>actions</span>"+
                              "<ul>"+
                             "<% for(var inputs in v.values){ %>" +
                                        "<li class='_target' id = '<%=v.values[inputs]%>'><span><%=v.labels[inputs] %></span></li>"+
                                        " <% } %>" +
                              "</ul>" +
                           "</li>" +

                          "</ul>" +
                         "</div>"
            ),



            UI: function() {
  
            //create pages..
            var xi = 0;


                 this.$( "._target" ).click(function() {

                 			 var selected =$(this).attr('id');

                        if (selected.substr(0,3) == "in_"){
                                executeScript(selected);
                        }else{
                               executeApp(selected);
                        }

				});

              
            },

            
            events: {
                      'click button.edit_comp'                 : "edit"
                    },

             edit: function() {
                      
                // custom settings
                 if (EditEnable == 1){

                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id

                                }

                                 ,{
                                  id:"label"
                                 ,label:"label"
                                 ,value:this.options.params.label
                                 }
                                 ,{
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value
                                 }
                                ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }

                               ]
                        }
                      );
                        var vd =  new ViewData(); 

                         Render(new DialogFormViewEdit(st_m,vd));

            }}

   });





//Menu2ViewM/////////////////////////////////////////////////
var Menu2ViewM =  BaseView.extend({

            template: _.template(""+
                          "<div id='cssmenu'>"+
                           "<ul>"+
                            "<li class='has-sub'><span>actions</span>"+
                              "<ul>"+
                             "<% for(var inputs in m.actions.values){ %>" +
                                        "<li class='_target' id = '<%=m.actions.values[inputs]%>'><span><%=m.actions.labels[inputs] %></span></li>"+
                                        " <% } %>" +
                              "</ul>" +
                           "</li>" +
                              "<li class='has-sub'><span><<back</span>"+
                              "<ul>"+
                             "<% for(var inputs in m.back.values){ %>" +
                                        "<li class='_target' id = '<%=m.back.values[inputs]%>'><span><%=m.back.labels[inputs] %></span></li>"+
                                        " <% } %>" +
                              "</ul>" +
                           "</li>" +
                             "</li>" +
                              "<li class='has-sub'><span>go>></span>"+
                              "<ul>"+
                             "<% for(var inputs in m.forw.values){ %>" +
                                        "<li class='_target' id = '<%=m.forw.values[inputs]%>'><span><%=m.forw.labels[inputs] %></span></li>"+
                                        " <% } %>" +
                              "</ul>" +
                           "</li>" +
						     "<li class='has-sub'><span>info</span>"+
                              "<ul>"+
                                  "<div id = 'entity_info'  class='ui-myinfo'>"+
								      "<% for(var inputs in m.info.values){ %>" +
                                        "<p><%=m.info.values[inputs]%></p>"+
                                        " <% } %>" +
								 "</div>"+
                              "</ul>" +
                           "</li>" +
                          "</ul>" +
                         "</div>"
            ),



            UI: function() {
            //position menu	
            //if (EditEnable==0){
  			//	this.$("#cssmenu").css({left:($(window).width()-1000)/3 + "px"});
            //}

            //create pages..
            var xi = 0;

                 this.$( "._target" ).click(function() {

                 	 var selected =$(this).attr('id');

                        if (selected.substr(0,3) == "in_"){
							    
                                executeScript(selected);
                        }else{

                               executeApp(selected);
                        }

				});

              
            },

            
            events: {
                      'click button.edit_comp'                 : "edit"
                    },

             edit: function() {
                      
                // custom settings
                 if (EditEnable == 1){

                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id

                                }

                                 ,{
                                  id:"label"
                                 ,label:"label"
                                 ,value:this.options.params.label
                                 }
                                 ,{
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value
                                 }
                               ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }

                               ]
                        }
                      );
                        var vd =  new ViewData(); 

                         Render(new DialogFormViewEdit(st_m,vd));

            }}

   });


//Back2TopView/////////////////////////////////////////////////
var Back2TopView =  BaseView.extend({

            template: _.template(""+
                          "<div id='backtotop'>вверх!</div>"
            ),



            UI: function() {
				
	       $(function() {
          
          	$(window).scroll(function() {
	
				if($(this).scrollTop() != 0) {
					$('#backtotop').fadeIn();	
				} else {
					$('#backtotop').fadeOut();
				}
			});

           });
			
			},
            
            events: {
                      'click button.edit_comp'                 : "edit"
                    },

             edit: function() {
                      
                // custom settings
                 if (EditEnable == 1){

                       st_m = new ModelData(
                        {
                          id: this.options.params.view_id
                         ,title:"Settings for " + this.options.params.view_id
                         ,rows:[
                                //settings for concrete component
                                {
                                  id:"view_id"
                                 ,label:"view_id"
                                 ,value:this.options.params.view_id

                                }
                                 ,{
                                  id:"value"
                                 ,label:"value"
                                 ,value:this.options.params.value
                                 }
                               ,{
                                  id:"class"
                                 ,label:"class"
                                 ,value:this.options.params["class"]

                                 }
                                ,{
                                  id:"target"
                                 ,label:"target"
                                 ,value:this.options.params.target

                                 }

                               ]
                        }
                      );
                        var vd =  new ViewData(); 

                         Render(new DialogFormViewEdit(st_m,vd));

            }}

   });
