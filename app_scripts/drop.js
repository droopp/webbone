
EditEnable=0

getAppSettings("drop");


var o = newAppObject({
					  text:"Drop!",
					  desc:"Distributed Reliable Operations Platform"
					 });


var nodes = newAppObject({
                      nodes:"Nodes: 4",
					  cpu:"CPU: 24",
					  ram:"RAM: 120G",
					  hdd:"HDD: 1T"
					 })


Render(new LabelView(o,"label"),"app")
Render(new LabelView(o,"desc"),"app");


Render(new TabRadioBoxView(o,"tabs"),"app");


Render(new LabelView(nodes,"nodes"),"p_nodes");
Render(new LabelView(nodes,"cpu"),"p_nodes");
Render(new LabelView(nodes,"ram"),"p_nodes");
Render(new LabelView(nodes,"hdd"),"p_nodes");

$("[target='nodes']").click()


//Render(new LabelView(o,"desc"),"app");
//Render(new LabelView(o,"desc"),"app"d);
//Render(new LabelView(o,"desc"),"app");




