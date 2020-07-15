// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgHeight - margin.left - margin.right;

  // Append SVG element
  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from an external CSV file
d3.csv("assets/data/data.csv").then(function(healthData) {
  console.log(healthData);
  console.log([healthData]);

  // parse data
   healthData.forEach(function(data) {
     data.healthcare = +data.age;
     data.poverty = +data.smokes;
   });

   // create scales
   var xLinearScale = d3.scaleLinear()
     .domain(d3.extent(healthData, d => d.age))
     .range([0, width]);

   var yLinearScale = d3.scaleLinear()
     .domain([0, d3.max(healthData, d => d.smokes)*10])
     .range([height, 0]);

   // create axes
   var xAxis = d3.axisBottom(xLinearScale);
   var yAxis = d3.axisLeft(yLinearScale).ticks(20);

   // append axes
   chartGroup.append("g")
     .attr("transform", `translate(0, ${height})`)
     .style("font-size", "16px")
     .call(xAxis);

   chartGroup.append("g")
     .style("font-size", "16px")
     .call(yAxis);

     // function for circles
   chartGroup.selectAll("circle")
     .data(healthData)
     .enter()
     .append("circle")
     .attr("cx", d => xLinearScale(d.age))
     .attr("cy", d => yLinearScale(d.smokes))
     .attr("r", 12)
     .attr("fill", "lightBlue")
     .attr("opacity", ".75");

     // add State abbrev to circles
   chartGroup.selectAll("text.text-circles")
     .data(healthData)
     .enter()
     .append("text")
     .classed("text-circles",true)
     .text(d => d.abbr)
     .attr("x", d => xLinearScale(d.age))
     .attr("y", d => yLinearScale(d.smokes))
     .attr("dy",5)
     .attr("text-anchor","middle")
     .attr("font-size","12px")
     .attr("fill", "white");

    // y axis
   chartGroup.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0 - margin.left)
     .attr("x", 0 - (height / 2))
     .attr("dy", "1em")
     .classed("aText", true)
     .text("Smokes (%)");

   // x axis
   chartGroup.append("text")
     .attr("y", height + margin.bottom/2)
     .attr("x", width / 2)
     .attr("dy", "1em")
     .classed("aText", true)
     .text("Age (median)");

   // Step 1: Initialize Tooltip
   var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (
          `<strong>${d.state}<strong><hr>Age (median): ${d.Age} Smokes (%): ${d.smokes}`
          );
        });

   // Step 2: Create the tooltip in chartGroup.
   chartGroup.call(toolTip);

   // Step 3: Create "mouseover" event listener to display tooltip
   circlesGroup.on("mouseover", function(d) {
      toolTip.show(d, this);
    })
   // Step 4: Create "mouseout" event listener to hide tooltip
     .on("mouseout", function(d) {
        toolTip.hide(d);
      });

   }).catch(function(error) {
  console.log(error);
});
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);




// columns: Array(19)
// 0: "id"
// 1: "state"
// 2: "abbr"
// 3: "poverty"
// 4: "povertyMoe"
// 5: "age"
// 6: "ageMoe"
// 7: "income"
// 8: "incomeMoe"
// 9: "healthcare"
// 10: "healthcareLow"
// 11: "healthcareHigh"
// 12: "obesity"
// 13: "obesityLow"
// 14: "obesityHigh"
// 15: "smokes"
// 16: "smokesLow"
// 17: "smokesHigh"
// 18: "-0.385218228"
