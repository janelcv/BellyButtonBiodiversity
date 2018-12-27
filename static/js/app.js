
function init() {
  console.log("in init section.")
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  console.log("in optionChanged:  ")
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}



function buildCharts(sample) {
  console.log("in buildCharts:  ")
  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var url = `/samples/${sample}`;
      d3.json(url).then(function(response) {
        var data = [{
          values: (response.sample_values).slice(0,10),
          labels: (response.otu_ids).slice(0,10),
          hoverinfo: (response.otu_labels).slice(0,10),
          type: "pie"
        }];
        
        var layout = {
          title: "Most Prominent OTUs"
        };
      
        Plotly.plot("pie", data, layout);
        });
    

    // @TODO: Build a Bubble Chart using the sample data
    var url = `/samples/${sample}`;
      d3.json(url).then(function(response) {
        var data = [{
          x: response.otu_ids,
          y: response.sample_value,
          type: 'scatter',
          mode:'markers',
          text: response.otu_labels,
          marker: {
            color:response.otu_ids,
            size:response.sample_values,
          }
        }];

        var layout = {
          title: "Interactive Dashboard"
        };

        Plotly.plot("bubble", data, layout);
        });
      };


function buildMetadata(sample) {
    console.log("in buildMetadata:  ")
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("");
    
    // // Use `Object.entries` to add each key and value pair to the panel
      var url = `/metadata/${sample}`;
      console.log(url);
      d3.json(url).then(function(response){
        Object.entries(response).forEach(function(key){
          console.log(key[0]);
          console.log(key[1]);
          var key1 = key[0];
          var value1 = key[1];
          d3.select("#sample-metadata").append("h6").text(`${key1}:${value1}`)})
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    });
  }

// Initialize the dashboard
init();