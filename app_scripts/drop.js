

EditEnable=0

if(getAppSettings("drop")){

try{
	window.clearInterval(id); // will do nothing if no timeout with id is present
}catch(e){}

function mark_table(arr){

  for (i in arr){
 	
 	$("#d_'"+ arr[i] +" font']").each
 		(function(e){d = $(this).text(); 
 			if (d>30 && d<50){ 
 					$(this).css("background", "red") 
 			} 
 			if (d>=50 && d<70){ 
 					$(this).css("background", "red") 
 			} 
 			if (d>=70){ 
 					$(this).css("background", "red") 
 			} 

 			 
 		 })
  }
}

//menu
   var menu = newAppObject({});
	var app_menu = {
     params:{
			id:"app_menu",
			view_id:"app_menu",
			values:["drop", "ppools", "flows"],
			labels:["drop", "ppools", "flows"]
    	}
	};

	app_settings["app_menu"] = app_menu;	

var o = newAppObject({
					  text:"nodes",
					  desc:"Distributed Reliable Operations Platform",
					  title:"Cluster resources",
					  title2:"Used",
					  graph: ""
					 });


var nodes = newAppObject({
                      nodes:"Nodes: 0",
					  cpu:"CPU: 0",
					  ram:"RAM: 0",
					  hdd:"HDD: 0",
					  cpu_u:"CPU: 0",
					  ram_u:"RAM: 0",
					  hdd_u:"HDD: 0"
			})

	
var nodet = newAppObject({
	nodes:[]
})

nodet.set("nodes", get2Object(new Request("/stat/node_stat", {})).node_stat.row)


var node_log = newAppObject({
	nodes:[]
})

node_log.set("nodes", get2Object(new Request("/stat/node_list", {})).node_list.row)



function update_common(){

//update common 
var common = {
	nodes:0,
	cpu:0,
	ram:0,
	hdd:0,
	cpu_u:0,
	ram_u:0,
	hdd_u:0
}

nd = nodet.get("nodes")

if (nd != undefined){

if (!$.isArray(nd)){
	nd = [nd]
}



nd.forEach(function(e){ 
	common.nodes = common.nodes+1;
	common.cpu = common.cpu + +e.cpu;
	common.ram = common.ram	+ +e.ram;
	common.hdd = common.hdd + +e.disk;
	common.cpu_u = (common.cpu_u + +e.cpu_percent);
	common.ram_u =common.ram_u + +e.ram_percent;
	common.hdd_u = common.hdd_u + +e.disk_percent;

});
	
}



nodes.set({nodes:"Nodes: " + common.nodes,
		   cpu:"CPU: " + common.cpu,
		   ram:"RAM: " + Math.round(common.ram/1024) + "G",
		   hdd:"HDD: " + Math.round(common.hdd/1024) + "G",
		   cpu_u:"CPU: " + check_nan(Math.round(common.cpu_u/common.nodes)) + "%",
		   ram_u:"RAM: " + check_nan(Math.round(common.ram_u/common.nodes)) + "%",
		   hdd_u:"HDD: " + check_nan(Math.round(common.hdd_u/common.nodes)) + "%"
});

}

function check_nan(v){
	if (isNaN(v)){
		return 0
	}else{
		return v
	}
}


//update graph

function update_graph(){

$("#d_graph").empty();

nd = nodet.get("nodes")

if (nd == undefined){
	return
}

if (!$.isArray(nd)){
	nd = [nd]
}


nd.forEach(function(e){ 
	$("#d_graph").append("<img src='/rrd/drop--node_" + e.name + ".png?rand=" + Math.random() + "'></img>")

});


}


Render(new Menu2View(menu,"app_menu"),"app");

// logo
Render(new LabelView(o,"label"),"app")
//Render(new LabelView(o,"desc"),"app");

//label dashboard
Render(new LabelView(o,"title"),"app");

//common
Render(new LabelView(nodes,"nodes"),"app");
Render(new LabelView(nodes,"cpu"),"app");
Render(new LabelView(nodes,"ram"),"app");
Render(new LabelView(nodes,"hdd"),"app");


//used resources
//label dashboard
//Render(new LabelView(o,"title2"),"app");

Render(new LabelView(nodes,"cpu_u"),"app");
Render(new LabelView(nodes,"ram_u"),"app");
Render(new LabelView(nodes,"hdd_u"),"app");



//node table
Render(new LabelView(o,"graph"),"app");


Render(new GridView(nodet,"nodet"),"app");
Render(new GridView(node_log,"node_log"),"app");

update_common()
update_graph()


var id = window.setInterval(function(){


  v_log=false
  v_nt=false

  if ($("#d_tmp_node_log .ui-icon-circle-triangle-s").length==0){
     v_log=true
  }

  if ($("#d_tmp_nodet .ui-icon-circle-triangle-s").length==0){
     v_nt=true
  }
      
   nodet.set("nodes", "");
   node_log.set("nodes", "");
   

    nodet.set("nodes", get2Object(new Request("/stat/node_stat", {})).node_stat.row)
    node_log.set("nodes", get2Object(new Request("/stat/node_list", {})).node_list.row)
  
    update_common()
    update_graph()

    if (v_log){
    	$("#d_tmp_node_log .ui-icon-circle-triangle-s").click()
    }
    if (v_nt){
    	$("#d_tmp_nodet .ui-icon-circle-triangle-s").click();

    }



}, 6000);


}


