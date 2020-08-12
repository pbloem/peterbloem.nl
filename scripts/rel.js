document.addEventListener("DOMContentLoaded", function(e) {

var h = 600;
var linkDistance = 150;
var radius = 12;

var data = {

    nodes: [
    {id: 0, name: "jack"},
    {id: 1, name: "mary"},
    {id: 2, name: "jo"},
    {id: 3, name: "bill"},
    {id: 4, name: "kate"},
    {id: 5, name: "frank"},
    {id: 6, name: "josh"},
    {id: 7, name: "ali"},
    {id: 8, name: "ken"}
    ],
    
    links: [
    {source: "jack", label: "spouse", target: "mary"},
    {source: "mary", label: "spouse", target: "jack"},
    {source: "jo", label: "child", target: "jack"},
    {source: "jo", label: "child", target: "mary"},
    {source: "bill", label: "child", target: "mary"},
    {source: "bill", label: "child", target: "ken"},
    {source: "josh", label: "child", target: "jo"},
    {source: "josh", label: "child", target: "frank"},
    {source: "frank", label: "spouse", target: "jo"},
    {source: "jo", label: "spouse", target: "frank"},
    {source: "ali", label: "child", target: "bill"},
    {source: "ali", label: "child", target: "kate"},
    {source: "kate", label: "ex", target: "bill"},
    {source: "bill", label: "ex", target: "kate"},
    {source: "ken", label: "ex", target: "mary"},
    {source: "mary", label: "ex", target: "ken"},
    ]
};



var svg = d3.select("body .first")
   .classed("svg-container", true) //container class to make it responsive
   .append("svg")
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 600 " + h)
   .classed("svg-content-responsive", true); 

width = 600
height = 300

margin = {top:0, left:0, bottom:0, right:0 }

chartWidth = width - (margin.left+margin.right)
chartHeight = height - (margin.top+margin.bottom)
   
var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.name }))
    .force("charge", d3.forceManyBody())
    .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
    .force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2))
    .alphaTarget(0.0)
  
var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr('marker-end','url(#arrowhead)')

var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(data.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", radius)
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

var nodelabels = svg.append("g")
	.attr("class", "nodelabels")
	.selectAll(".nodelabel") 
	.data(data.nodes)
	.enter()
	.append("text")
	.attr("x", function(d){return d.x;})
    .attr("y", function(d){return d.y;})
    .attr("class", "nodelabel")
    .text(function(d){return d.name;})
    
var edgepath = svg.append("g").selectAll(".edgepath")
    .data(data.links)
    .enter()
    .append('path')
    .attr('class', 'edgepath')
    .attr('fill-opacity', 0)
    .attr('stroke-opacity', 0)
    .attr('fill', 'blue')
    .attr('stroke', 'red')
    .attr('id', function(d,i) {return 'edgepath'+i})
    .style("pointer-events", "none");    
    
var edgelabels = svg.append("g")
	.selectAll(".edgelabel")
    .data(data.links)
    .enter()
    .append('text')
    .style("pointer-events", "none")
    .attr('class','edgelabel')
    .attr('id', function(d,i){return 'edgelabel'+i})
    .attr('dx', 80)
    .attr('dy',0)   
    
edgelabels.append('textPath')
	.attr('xlink:href',function(d,i) {return '#edgepath'+i})
	.style("pointer-events", "none")
	.text(function(d,i){return data.links[i].label})
	

node.append("title")
	.text(function(d) { return d.name; })

var ticked = function() {
	clip = radius + 15
	
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) {
        		w = d.target.x - d.source.x;	
        		h = d.target.y - d.source.y;
        		
        		a = Math.atan(Math.abs(h)/Math.abs(w));
        		
        		return d.source.x + Math.sign(w) * (Math.abs(w) - clip * (Math.cos(a)));
        	})
        .attr("y2", function(d) { 
	    		w = d.target.x - d.source.x;	
	    		h = d.target.y - d.source.y;
	    		
	    		a = Math.atan(Math.abs(h)/Math.abs(w));
	    		
        		return d.source.y + Math.sign(h) * (Math.abs(h) - clip * (Math.sin(a)));
        	})

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
    
    nodelabels
    	.attr("x", function(d) { return d.x + 20; }) 
    	.attr("y", function(d) { return d.y + 7; })
    	
    edgepath
    	.attr('d', function(d) {return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;})

    edgelabels.attr('transform',function(d,i){
        if (d.target.x < d.source.x)
        {
            bbox = this.getBBox();
            rx = bbox.x+bbox.width/2;
            ry = bbox.y+bbox.height/2;
            return 'rotate(180 '+rx+' '+ry+')';
        } else {
            return 'rotate(0)';
        }
    });
}

svg.append('defs').append('marker')
	  .attr('id', 'arrowhead')
	  .attr('viewBox', '0 -5 10 10')
	  .attr('refX', 0.1)
	  .attr('refY', 0)
	  .attr('orient', 'auto')
	  .attr('markerWidth', 3)
	  .attr('markerHeight', 3)
	  .attr('xoverflow', 'visible')
	.append('svg:path')
      .attr('d', 'M 0,-3 L 10 ,0 L 0,3')

simulation
    .nodes(data.nodes)
    .on("tick", ticked);

simulation.force("link")
	.links(data.links)
	.distance(60)
	
simulation.force("charge")
	.strength(-200)

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}
  
});