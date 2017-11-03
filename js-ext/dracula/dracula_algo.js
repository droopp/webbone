function bellman_ford(g,source){for(var n in g.nodes)
g.nodes[n].distance=Infinity;source.distance=0;g.snapShot("Initiallisation: Set all distances are infinite and all predecessors are null.");for(var i=1;i<g.nodes.length;i++)
for(var e in g.edges){var edge=g.edges[e];if(edge.source.distance+ edge.weight<edge.target.distance){g.snapShot("Relax edge between "+edge.source.id+" and "+edge.target.id+".");edge.target.distance=edge.source.distance+ edge.weight;edge.target.predecessor=edge.source;}}
g.snapShot("Ready.");}
function dijkstra(g,source){for(var n in g.nodes)
g.nodes[n].distance=Infinity;source.distance=0;var counter=0;var q=new BinaryMinHeap(g.nodes,"distance");var node;while(q.min()!=undefined){node=q.extractMin();node.optimized=true;if(node.distance==Infinity)
throw"Orphaned node!";for(e in node.edges){if(node.edges[e].target.optimized)
continue;var alt=node.distance+ node.edges[e].weight;if(alt<node.edges[e].target.distance){node.edges[e].target.distance=alt;q.heapify();node.edges[e].target.predecessor=node;}}}}
function floyd_warshall(g,source){var path=[];var next=[];var n=g.nodes.length;for(j in g.nodes){path[j]=[];next[j]=[];for(i in g.nodes)
path[j][i]=j==i?0:Infinity;}
for(e in g.edges)
path[g.edges[e].source.id][g.edges[e].target.id]=g.edges[e].weight;for(k in g.nodes){for(i in g.nodes){for(j in g.nodes)
if(path[i][j]>path[i][k]+ path[k][j]){path[i][j]=path[i][k]+ path[k][j];next[i][j]=k;}}}
function getPath(i,j){if(path[i][j]==Infinity)
throw"There is no path.";var intermediate=next[i][j];if(intermediate==undefined)
return null;else
return getPath(i,intermediate).concat([intermediate]).concat(getPath(intermediate,j));}}
function BinaryMinHeap(array,key){var tree=[];var key=key||'key';var parent=function(index){return Math.floor((index- 1)/2); };
var right=function(index){return 2*index+ 2;};var left=function(index){return 2*index+ 1;};function bubble_up(i){var p=parent(i);while((p>=0)&&(tree[i][key]<tree[p][key])){tree[i]=tree.splice(p,1,tree[i])[0];i=p;p=parent(i);}}
function bubble_down(i){var l=left(i);var r=right(i);while(tree[l]&&(tree[i][key]>tree[l][key])||tree[r]&&(tree[i][key]>tree[r][key])){var child=tree[l]?tree[r]?tree[l][key]>tree[r][key]?r:l:l:l;tree[i]=tree.splice(child,1,tree[i])[0];i=child;l=left(i);r=right(i);}}
this.insert=function(element){(element[key]==undefined)&&(element={key:element});tree.push(element);bubble_up(tree.length- 1);}
this.min=function(){return tree.length==1?undefined:tree[0];}
this.extractMin=function(){var result=this.min();(tree.length==1)&&(tree=[])||(tree[0]=tree.pop())&&bubble_down(0);return result;}
this.changeKey=function(index,key){throw"function not implemented";}
this.heapify=function(){for(var start=Math.floor((tree.length- 2)/ 2); start >= 0; start--) {
bubble_down(start);}}
for(i in(array||[]))
this.insert(array[i]);}
function quickSort(arr){if(arr.length<=1)return arr;var median=arr[Math.floor(Math.random()*arr.length)];var arr1=[],arr2=[],arr3=[];for(var i in arr){arr[i]<median&&arr1.push(arr[i]);arr[i]==median&&arr2.push(arr[i]);arr[i]>median&&arr3.push(arr[i]);}
return quickSort(arr1).concat(arr2).concat(quickSort(arr3));}
function selectionSort(arr){if(arr.length==1)return arr;var minimum=Infinity;var index;for(var i in arr){if(arr[i]<minimum){minimum=arr[i];index=i;}}
arr.splice(index,1);return[minimum].concat(selectionSort(arr));}
function mergeSort(arr){function merge(a,b){var c=[];while(a.length>0||b.length>0){var n=a.length>0&&b.length>0?a[0]<b[0]?a.shift():b.shift():b.length>0?b.shift():a.length>0?a.shift():null;n!=null&&c.push(n);}
return c;}
median=Math.floor(arr.length/2);var part1=arr.slice(0,median);var part2=arr.slice(median- arr.length);return arr.length<=1?arr:merge(mergeSort(part1),mergeSort(part2));}
function RedBlackTree(arr){}
function BTree(arr){}
function NaryTree(n,arr){}
function curry(fn){return function(){var args=curry.args(arguments),master=arguments.callee,self=this;return args.length>=fn.length?fn.apply(self,args):function(){return master.apply(self,args.concat(curry.args(arguments)));};};};curry.args=function(args){return Array.prototype.slice.call(args);};Function.prototype.curry=function(){return curry(this);};
