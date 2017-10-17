

EditEnable=0

if(getAppSettings("drop")){

var o = newAppObject({
					  text:"nodes",
					  desc:"Distributed Reliable Operations Platform",
					  title:"Cluster resources",
					  graph: ""
					 });


var nodes = newAppObject({
                      nodes:"Nodes: 4",
					  cpu:"CPU: 24",
					  ram:"RAM: 120G",
					  hdd:"HDD: 1T"
			})

	
var nodet = newAppObject({
	
	nodes:[]

})



nodet.set("nodes", get2Object(new Request("/stat/node_stat", {})).node_stat.row)


var node_log = newAppObject({
	nodes:[]
})

node_log.set("nodes", get2Object(new Request("/stat/node_list", {})).node_list.row)
	
	/*setInterval(function(){
		node_log.set("nodes", get2Object(new Request("/stat/node_list", {})).node_list.row)
		
		if ($("#d_tmp_node_log .ui-icon-circle-triangle-s").length==1){
			Render(new GridView(node_log,"node_log"),"app");	
		}else{
			Render(new GridView(node_log,"node_log"),"app");	
			$("#d_tmp_node_log .ui-icon-circle-triangle-s").click()

		}
		}, 4000);
	*/

   var menu = newAppObject({});
	var app_menu = {
     params:{
			id:"app_menu",
			view_id:"app_menu",
			values:["nodes", "ppools", "flows", "images", "settings"],
			labels:["nodes", "ppools", "flows", "images", "settings"]
    	}
	};

	app_settings["app_menu"] = app_menu;	
   Render(new Menu2View(menu,"app_menu"),"app");


// logo
Render(new LabelView(o,"label"),"app")
//Render(new LabelView(o,"desc"),"app");

//label dashboard
Render(new LabelView(o,"title"),"app");

//label logs
//Render(new LabelView(o,"logs"),"app");

//common
Render(new LabelView(nodes,"nodes"),"app");
Render(new LabelView(nodes,"cpu"),"app");
Render(new LabelView(nodes,"ram"),"app");
Render(new LabelView(nodes,"hdd"),"app");

//logs
//Render(new MemoView(nodes,"memo2"),"app");


//node table


Render(new LabelView(o,"graph"),"app");





$("#d_graph").append("<img src='/rrd/drop--node_node1.png?'></img>")
$("#d_graph").append("<img src='/rrd/drop--ppool_node_collector-0.1.0.png?'></img>")

/*		setInterval(function(){

				$("#d_graph img").each(function(index){
					file = $(this)[0].src.split("/")[4]
					file = file.substr(0,file.indexOf("?"))
					$(this)[0].src = 'rrd/'+file+'?rand=' + Math.random(); 
				})
				

		}, 4000);
*/

//set

//Render(new GridView(nodet,"nodet2"),"app");
Render(new GridView(nodet,"nodet"),"app");

Render(new GridView(node_log,"node_log"),"app");





}


