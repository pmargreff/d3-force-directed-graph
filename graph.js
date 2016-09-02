$(function() {
  $( "#slider").slider({
    range: true,
    min: 2009,
    max: 2013,
    values: [ 2009, 2013 ],
    slide: function( event, ui ) {
      $( "#amount" ).val( "" + ui.values[ 0 ] + " - "+ ui.values[ 1 ] );
    }
  });
  $( "#amount" ).val( " " + $( "#slider" ).slider( "values", 0 ) +
  " - " + $( "#slider" ).slider( "values", 1 ) );
});

var q = d3.queue();
q.defer(d3.csv, "/data/data09.csv")
q.defer(d3.csv, "/data/data10.csv")
q.defer(d3.csv, "/data/data11.csv")
q.defer(d3.csv, "/data/data12.csv")
q.await(analyze);

function analyze(error, data09, data10, data11, data12) {
  if(error) { 
    console.log(error); 
  }
  
  console.log(data09[0]);
  console.log(data10[0]);
  console.log(data11[0]);
  console.log(data12[0]);
}

var width = $(document).width() - 25,
height = ($(window).height() - 50);

var force = d3.layout.force()
.size([width, height])
.charge(-400)
.linkDistance(300)
.on("tick", tick);

var drag = force.drag()
.on("dragstart", dragstart);

var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height);

var link = svg.selectAll(".link"),
node = svg.selectAll(".node");

var colorScale = d3.scale.linear()
.domain([2, 40, 82])
.range(["gold", "tomato", "crimson"]);

var fontSizeScale = d3.scale.linear()
.domain([2,40,82])
.range([10,14,22]);

d3.csv("data/data09.csv" , function(error, csv) {
  nodes = createNodes(csv);  
  links = createLinks(csv);
  
  force
  .nodes(nodes)
  .links(links)
  .start();
  link = link.data(links)
  .enter().append("line")
  .attr("class", "link")
  
  link.style("stroke-width", function(d) {return (d.value/2 + "px");});
  
  node = node.data(nodes)
  .enter().append("g")
  .attr("class", "node")
  .on("dblclick", dblclick)
  .call(drag);
  
  node.append("circle")
  .attr("r", function(d){return d.radius;})
  .attr("fill", function(d){return colorScale(d.radius);})
  .attr("fill-opacity", 0.95);
  
  node.append("text")
  .attr("text-anchor", "middle")
  .attr("dx", 0)
  .attr("dy", function(d){return d.radius + 15;})
  .style("font-size", function(d){return fontSizeScale(d.radius);})
  .text(function(d){
    if (d.radius != 0) {
      return d.name
    }
  });
  
  d3.selectAll(".node")
  .on("mouseover", function(d) {
    d3.select(this).select("text")
    .transition()
    .style("font-size", "150%")
    link
    .transition()
    .style("stroke-opacity", function(l){
      if (d === l.source || d === l.target)
      return 0.4;
      else {
        return 0.15;
      }
    })
    .style('stroke', function(l) {
      if (d === l.source || d === l.target)
      //return "crimson";
      return "coral";
    })
    .style('stroke-width', function(l){
      if (d == l.source || d == l.target)
      return  (l.value + "px");
      else {
        return (l.value/2 + "px");
      }
    });
  });
  
  d3.selectAll(".node")
  .on("mouseout", function() {
    d3.select(this).select("text")
    .transition()
    .style("font-size", function(d){
      return fontSizeScale(d.radius);
    })    
  });
  
  
}); 

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
  .attr("y1", function(d) { return d.source.y; })
  .attr("x2", function(d) { return d.target.x; })
  .attr("y2", function(d) { return d.target.y; });
  
  node.attr("transform", function(d){ return "translate(" + d.x + "," + d.y + ")"; });
}

function dblclick(d){
  d3.select(this).classed("fixed", d.fixed = false);
}

function dragstart(d){
  d3.select(this).classed("fixed", d.fixed = true);
}


function createNodes(data) {
  var nodes = [];
  
  for (var i = 0; i < data.length; i++) {
    nodes.push({
      name: Object.keys(data[i])[i],
      group: i,
      radius: parseFloat(data[i][Object.keys(data[i])[i]]) * 2
    })
  }
  
  
  return nodes;
}

function createLinks(data) {
  links = [];
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data.length; j++) {
      if (i != j && data[i][Object.keys(data[i])[j]] != 0) {
        links.push({
          source: i,
          target: j, 
          value: parseFloat(data[i][Object.keys(data[i])[j]]) * 2
        })
      }
    }
  }
  return links;
}
