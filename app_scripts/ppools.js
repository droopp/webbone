
EditEnable=0

if(getAppSettings("ppools")){

try{
	window.clearInterval(id); // will do nothing if no timeout with id is present
}catch(e){}


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
					  text:"ppools",
					  desc:"Distributed Reliable Operations Platform",
					  title:"Ppools resources",
					  title2:"Used",
					  graph: "",
					  graph_time:"Time ms",
					  graph_error:"Err+TO+NoMore"
					 });


var nodes = newAppObject({
                      nodes:"Workers: 0",
                      procs:"Procs: 0",
					  cpu:"CPU: 0",
					  ram:"RAM: 0"
			})

	
var nodet = newAppObject({
	ppools:[]
})

nodet.set("ppools", get2Object(new Request("/stat/ppool_stat", {})).ppool_stat.row)


var ppool_log = newAppObject({
	ppools:[]
})



ppool_log.set("ppools", get2Object(new Request("/stat/ppool_list", {})).ppool_list.row)


function draw_pivot(app, data, cnt){

$("#d_" + app).empty();

if (data == undefined){
	
	$("#d_" + app).append("no data..")
	return

}

d = [["node","name",cnt]];

data.forEach(function(e){
	d.push([e.node, e.name, e[cnt]]);
})

var utils = $.pivotUtilities;
var heatmap =  utils.renderers["Heatmap"];
var sumOverSum =  utils.aggregators["average"];

$.pivotUtilities.tipsData = d

$("#d_" + app).pivot(
  utils.tipsData, {
    rows: ["node", "name"],
    aggregator: sumOverSum([cnt]),
    renderer: heatmap
  });

}

function update_common(){

//update common 
var common = {
	nodes:0,
	procs:0,
	cpu:0,
	ram:0
}

nd = nodet.get("ppools")

if (nd != undefined){

if (!$.isArray(nd)){
	nd = [nd]
}



nd.forEach(function(e){ 
	common.nodes = common.nodes+1;
	common.procs = common.procs + +e.summa_count;
	common.cpu = common.cpu + +e.summa_cpu_percent;
	common.ram = common.ram	+ +e.summa_ram_percent/100* +e.summa_ram;

});
	
}



nodes.set({nodes:"Workers: " + Math.round(common.nodes),
           procs:"Procs: " + Math.round(common.procs),
		   cpu:"CPU: " + common.cpu + "%",
		   ram:"RAM: " + Math.round(common.ram/1024*100)/100 + "G"
});

}

function check_nan(v){
	if (isNaN(v)){
		return 0
	}else{
		return v
	}
}


Render(new Menu2View(menu,"app_menu"),"app");

// logo
Render(new LabelView(o,"label"),"app")
//Render(new LabelView(o,"desc"),"app");

//label dashboard
Render(new LabelView(o,"title"),"app");

//common
Render(new LabelView(nodes,"nodes"),"app");
Render(new LabelView(nodes,"procs"),"app");
Render(new LabelView(nodes,"cpu"),"app");
Render(new LabelView(nodes,"ram"),"app");


//node table
Render(new LabelView(o,"graph"),"app");
Render(new LabelView(o,"graph_time"),"app");

Render(new LabelView(o,"graph2"),"app");
Render(new LabelView(o,"graph_error"),"app");

var NGridView = GridView.extend({
	onDblClickRow: function(id){

		data = $("#nodet").jqGrid('getRowData',id);

		arr = data.name.split(":")



		Question("<div id='app2' style='position:absolute; left:10px'><img src='/rrd/drop--ppool_"+arr.join("-") + data.node +".png?'></img></div>", 
					function(){});

		$(".ui-dialog").css("width","720px")
		$(".ui-dialog").css("left","20px")
		$(".ui-dialog").css("top","100px")
		$("#d_question").css("height","220px")
		
	}

});

Render(new NGridView(nodet,"nodet"),"app");
Render(new GridView(ppool_log,"node_log"),"app");


//Render(new PivotView(ppool_log,"pivot"),"app");



update_common()
draw_pivot("graph", ppool_log.get("ppools"), "elapsed");
draw_pivot("graph2", ppool_log.get("ppools"), "errors");


var id = window.setInterval(function(){


  v_log=false
  v_nt=false

  if ($("#d_tmp_node_log .ui-icon-circle-triangle-s").length==0){
     v_log=true
  }

  if ($("#d_tmp_nodet .ui-icon-circle-triangle-s").length==0){
     v_nt=true
  }
      

   if (!(v_nt || v_log)){     
   	nodet.set("ppools", "");
   	ppool_log.set("ppools", "");
   

    nodet.set("ppools", get2Object(new Request("/stat/ppool_stat", {})).ppool_stat.row)
    ppool_log.set("ppools", get2Object(new Request("/stat/ppool_list", {})).ppool_list.row)
  
   }
	update_common()
	draw_pivot("graph", ppool_log.get("ppools"), "elapsed");
	draw_pivot("graph2", ppool_log.get("ppools"), "errors");

    if (v_log){
    	$("#d_tmp_node_log .ui-icon-circle-triangle-s").click()
    }
    if (v_nt){
    	$("#d_tmp_nodet .ui-icon-circle-triangle-s").click();

    }



}, 6000);


}


