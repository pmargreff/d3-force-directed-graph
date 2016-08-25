var year1, year2;

$(function() {
  $( "#slider-range" ).slider({
    range: true,
    min: 2009,
    max: 2013,
    values: [ 2009, 2010 ],
    slide: function( event, ui ) {
      $( "#x-axis" ).val( + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
    }
  });
  $( "#x-axis" ).val( $( "#slider-range" ).slider( "values", 0 ) +
  " - " + $("#slider-range").slider("values", 1));
  
  year1 = $("#slider-range").slider("values", 0);
  year2 = $("#slider-range").slider("values", 1);
  
  
  //var year1 = $( "#x-axis" ).val( $( "#slider-range" ).slider( "values", 0 );
  //year2 = $( "#slider-range" ).slider( "values", 1 );
});
//alert(year1 + " - " + year2);
//alert(year1 + "-" year2);

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


d3.csv("data.csv" , function(error, csv) {
  nodes = {};
  links = {};
  
  nodes = getNodes(csv);
  links = getLinks(csv);  // console.log(json);
  
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
  
  /*node.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("rx", 5)
  .attr("ry", 5)
  .attr("width", 50)
  .attr("height", 20)
  .attr("fill", "white")
  .style("fill-opacity", 0.8)
  .attr("stroke","#ccc")
  .attr("stroke-width",0.5);*/
  
  node.append("text")
  .attr("text-anchor", "middle")
  .attr("dx", 0)
  .attr("dy", function(d){return d.radius + 15;})
  .style("font-size", function(d){return fontSizeScale(d.radius);})
  .text(function(d){return d.name});
  
  //node.on('mouseover', function(d) {
  
  //});
  
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
    //link
    //	.transition()
    //	.style("stroke-opacity", 0.3)
    
  });
  
  
}); //end json function

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

function getNodes(data) {
  var nodes = [];
  
  for (var i = 0; data[i].param4; i++) {
    nodes.push({
      name: data[i].param1,
      group: parseInt(data[i].param2),
      image: data[i].param3,
      radius: parseFloat(data[i].param4)
    })
  }
  return nodes;
}

function getLinks(data) {
  var links = [];
  var i;
  
  for (i = 0; data[i].param4; i++) {}
  
  for (i; data[i]; i++) {
    links.push({
      source: parseInt(data[i].param1),
      target: parseInt(data[i].param2), 
      value: parseFloat(data[i].param3)
    })
  }
  return links;
}
