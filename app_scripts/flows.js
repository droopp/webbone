
EditEnable=0

if(getAppSettings("flows")){

    loadExtJs("dracula/rafael")
    loadExtJs("dracula/dracula_graffe")
    loadExtJs("dracula/dracula_graph")
    loadExtJs("dracula/dracula_algo")

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
					  text:"flows",
					  desc:"Distributed Reliable Operations Platform",
					  title:"Flows",
					  title2:"Used",
					  graph: "",
					 });




var ppool_log = newAppObject({
	flows:[]
})



ppool_log.set("ppools", get2Object(new Request("/stat/flows", {})).flows.row)



var flow_log = newAppObject({
	flows:[]
})


//flow_log.set("ppools", get2Object(new Request("/stat/flow_log", {})).flows.row)


	

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



var NGridView = GridView.extend({
	onDblClickRow: function(id){

		data = $("#flow_log2").jqGrid('getRowData',id);

		Question("<div id='app2' style='position:absolute; left:10px'><pre>"+ JSON.stringify(JSON.parse(data.data), null, 4) +"</pre></div>", 
					function(){});

		$(".ui-dialog").css("width","720px")
		$(".ui-dialog").css("left","20px")
		$(".ui-dialog").css("top","100px")
		$("#d_question").css("height","220px")
		
	},

	onClickRow: function(id){

		$("#d_graph").empty()

		data = $("#flow_log2").jqGrid('getRowData',id);

		d = JSON.parse(data.data)
		tmp = {}
		d.scenes.forEach(function(e){ 
			if (e.name == d.start_scene){
				tmp = e
				}
		})

		var g = new Graph();

		tmp.cook.forEach(function(e){

			cmds = e.cmd.split("::");

			//console.log(cmds);

			if (cmds[2] == "start_pool"){
				 g.addNode(cmds[3]);
			}
			if (cmds[2] == "subscribe"){
				 g.addEdge(cmds[3], cmds[4], { directed : true} );
			}

		})

					    /* layout the graph using the Spring layout implementation */
				var layouter = new Graph.Layout.Spring(g);
				layouter.layout();

				/* draw the graph using the RaphaelJS draw implementation */
				var renderer = new Graph.Renderer.Raphael('d_graph', g, 700, 300);
				renderer.draw();
		
	}




});

Render(new NGridView(ppool_log,"flow_log2"),"app");
Render(new GridView(flow_log, "flow_log3"),"app");


//node table
Render(new LabelView(o,"graph"),"app");
//draw_flow()


function draw_flow(){


var g = new Graph();

    /* add a simple node */
    g.addNode("strawberry");
    g.addNode("cherry");

    /* add a node with a customized label */
    g.addNode("id34", { fill: "green", label : "Tomato1" });

    /* add a node with a customized shape 
       (the Raphael graph drawing implementation can draw this shape, please 
       consult the RaphaelJS reference for details http://raphaeljs.com/) */
    var render = function(r, n) {
            /* the Raphael set is obligatory, containing all you want to display */
            var set = r.set().push(
                /* custom objects go here */
                r.rect(n.point[0]-30, n.point[1]-13, 62, 66).attr({"fill": "#fff", "stroke-width": 1, r : "9px"})).push(
                r.text(n.point[0], n.point[1] + 20, n.label).attr({"font-size":"14px"}));
            return set;
        };


    g.addNode("id35", {
        label : "node_info_stream" ,
        /* filling the shape with a color makes it easier to be dragged */
        /* arguments: r = Raphael object, n : node object */
       // render : render
    });
   

    /* connect nodes with edges */
    g.addEdge("id34", "cherry");
//    g.addEdge("cherry", "apple");

    /* a directed connection, using an arrow */
    g.addEdge("id34", "strawberry", { directed : true } );
    
    /* customize the colors of that edge */
    g.addEdge("id35", "apple", { stroke : "#fff" , fill : "#56f", label : "done" });
    
    /* add an unknown node implicitly by adding an edge */
    g.addEdge("strawberry", "apple", { directed : true });
    g.addEdge("apple","id35", { directed : true  });

    g.addEdge("id34", "id35");
    g.addEdge("id35", "strawberry", { directed : true });
    g.addEdge("id35", "cherry");

    /* layout the graph using the Spring layout implementation */
    var layouter = new Graph.Layout.Spring(g);
    layouter.layout();
    
    /* draw the graph using the RaphaelJS draw implementation */
    var renderer = new Graph.Renderer.Raphael('d_graph', g, 700, 300);
    renderer.draw();

}



}

