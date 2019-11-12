
var width = 1900, height = 1000;

var w = 1900, h = 1000, r = 6;
    
var padding = 3.5, clusterPadding = 6, maxRadius = 12, count = 0;

//var color = d3.scale.category20c();

var n, m = 20; 
   
var color = d3.scale.category20();
    
var force = d3.layout.force()
    .charge(-29000)
    .linkDistance(410)
    .linkStrength(1)
    .size([width, height]);
    



var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var linkedByIndex = {};
 
d3.json("new.json", function (error, d) {

    graph = {
        "nodes": [],
        "links": []
    };

    d.forEach(function (d) {
        graph.nodes.push({ "name": d.source, "group": +d.groupsource });

        graph.nodes.push({ "name": d.target, "group": +d.grouptarget });
        graph.links.push({ "source": d.source, "target": d.target, "value": +d.value });
        count += 1; 
        n = count;
    });
            console.log(JSON.stringify(graph.nodes));
    var nodesmap = d3.nest()
        .key(function (d) { return d.name; })
        .rollup(function (d) { return { "name": d[0].name, "group": d[0].group }; })
        .map(graph.nodes);
console.log(JSON.stringify(nodesmap));
    graph.nodes = d3.keys(d3.nest()
        .key(function (d) { return d.name; })
        .map(graph.nodes));

    graph.links.forEach(function (d, i) {
        graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
        graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
    });

    graph.nodes.forEach(function (d,i) {
        graph.nodes[i]={ "name": nodesmap[d].name, "group": nodesmap[d].group };
    });

    force
        .nodes(graph.nodes)
        .links(graph.links)
        

         
         
        .start();

    var link = svg.selectAll(".link")
        .data(graph.links)
       .enter()
        .append("g")
        .attr("class", "link")
        .append("line")
        .attr("class", "link-line")
        .style("stroke-width", function (d) {
            return Math.sqrt(d.value);
        });
          
    var linkText = svg.selectAll(".link")
        .append("text")
        .attr("class", "link-label")
        .attr("font-family", "Arial, Helvetica, sans-serif")
        .attr("fill", "Black")
        .style("font", "normal 12px Arial")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) {
                          if (d.target.index<21)
                         {
                            return "dgfdrgsf";
                         }
                         else
                         {
                            return d.value;
                         }
            
        });

    var node = svg.selectAll(".node")
        .data(graph.nodes)
       .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 25)
        .style("fill", function (d) { return color(d.group); })
         //.on("click", click) 
          //.on("dblclick", dblclick) 
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .call(force.drag);


    

    
    var linkPath = link.append("svg:path")
        .attr("class", function(d) { return "link " + d.value; })
        .attr("marker-end", function(d) { return "url(#" + d.value + ")"; });

         svg.append('defs').append('marker')
        .attr({'id':'arrowhead',
               'viewBox':'-0 -5 10 10',
               'refX':25,
               'refY':0,
               'markerUnits':'strokeWidth',
               'orient':'auto',
               'markerWidth':10,
               'markerHeight':10,
               'xoverflow':'visible'})
        .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#ccc')
          
            .attr('stroke','#ccc');
    
    
    
    var path_label = svg.append("svg:g").selectAll(".path_label")
        .data(force.links())
       .enter()
        .append("text")
        .attr("class", "path_label")
        .append("svg:textPath")
        .attr("startOffset", "50%")
        .attr("text-anchor", "middle")
        .attr("xlink:href", function(d) { return "#" + d.source.index + "_" + d.target.index; })
        .style("fill", "#000")
        .style("font-family", "Arial")
        .text(function(d) { return d.value; });

        var nodelabels = svg.selectAll(".nodelabel") 
       .data(graph.nodes)
       .enter()
       .append("text")
       .attr({"x":function(d){return d.x;},
              "y":function(d){return d.y;},
              "class":"nodelabel",
              })
        .style("text-anchor","end")
       .text(function(d){return d.name;});
    
    svg.style("opacity", 1e-6)
        .transition()
        .duration(1000)
        .style("opacity", 1);
    
    node.on("click", function(d) { d.fixed = false; });
            
    node.on("dblclick", function(d) { d.fixed = true; });
            
    /*node.append("title")
        .text(function (d) { return d.name; });*/
            
    force.on("tick", function (e) {

         graph.nodes[0].x = w / 2;
         graph.nodes[0].y = h / 2;
        var k = 6 * e.alpha;
                
        graph.nodes.forEach(function(o, i) {
            o.y += i & 1 ? k : -k;
            o.x += i & 2 ? k : -k;
        });
    
        link.attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });




        linkText
            .attr("x", function(d) {
                return ((d.source.x + d.target.x)/2);
            })
            .attr("y", function(d) {
                return ((d.source.y + d.target.y)/2);
            });

        nodelabels.attr("x", function(d) { return d.x; }) 
                  .attr("y", function(d) { return d.y; });
    
        node.attr("cx", function(d) {
                return d.x = Math.max(r, Math.min(w - r, d.x));
            })
            .attr("cy", function(d) {
                return d.y = Math.max(r, Math.min(h - r, d.y));
            });



   

    
    });     
    
    graph.links.forEach(function(d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
        linkedByIndex[d.target.index + "," + d.source.index] = 1;
    });

    
 function neighboring(a, b) {
    return a.index == b.index || linkedByIndex[a.index + "," + b.index];


 }
    
 function mouseover(d) {
    d3.selectAll(".node").attr("r",32).style("stroke","black");
    d3.selectAll(".link").style("stroke","black").style("stroke-width",4);
    d3.selectAll(".link").transition().duration(500)
        .style("opacity", function(o) {
            return o.source === d || o.target === d ? 1 : .1;
    });
      
    d3.selectAll(".node").transition().duration(500)
        .style("opacity", function(o) {
            return neighboring(d, o) ? 1 : .1;
        });
 }

 function mouseout() {
    d3.selectAll(".node").attr("r",25).style("stroke","white");
    d3.selectAll(".link").style("stroke","grey").style("stroke-width",1);
    d3.selectAll(".link").transition().duration(500)
        .style("opacity", 1);
    d3.selectAll(".node").transition().duration(500)
        .style("opacity", 1);
 }



 

});