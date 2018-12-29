
function init() {
  console.log("in init section.")
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(`Sample ${sample}`)
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
    d3.select("#pie").html("")
    var url = `/samples/${sample}`;
      d3.json(url).then(function(response) {
        console.log(response.sample_values)
        var data = [{
          values: (response.sample_values).slice(0,10),
          labels: (response.otu_ids).slice(0,10),
          hoverinfo: (response.otu_labels).slice(0,10),
          type: "pie",
          hole: 0.5,
          marker: {
            line: {
            color: 'white',
            width: 3
          }, 
        }   
        }];
        
        var layout = {
          paper_bgcolor:'rgba(0,0,0,0)',
          plot_bgcolor:'rgba(0,0,0,0)',
          // paper_bgcolor: "rgb(31,31,31)",
          // plot_bgcolor: "rgb(31,31,31)",
          title: `Top Values for Sample ${sample} `
        };
      
        Plotly.newPlot("pie", data, layout);
        });
    

    // @TODO: Build a Bubble Chart using the sample data
    d3.select("#bubble").html("")
    var url = `/samples/${sample}`;
      d3.json(url).then(function(response) {
        console.log(response.sample_values)
        const otu_ids = response.otu_ids
        const sample_values = response.sample_values
        const otu_labels = response.otu_labels
        var data = [{
          x: otu_ids,
          y: sample_values ,
          type: 'scatter',
          mode:'markers',
          text: otu_labels, 
          name: `${sample}`, 
          hoverinfo:'text+x+y+name',
          marker: {
            color: otu_ids,
            size: sample_values,
            colorscale: "Electric"
          },
          line: {
            color: 'white',
            width: 3}, 
        }];

        var layout = {
          width:1450,
          height:450,
          paper_bgcolor:'rgba(0,0,0,0)',
          plot_bgcolor:'rgba(0,0,0,0)',
          // paper_bgcolor: "rgb(31,31,31)",
          // plot_bgcolor: "rgb(31,31,31)",
          margin: { t: 0 },
          hovermode: 'closest',
          title: "Interactive Dashboard",
          yaxis: {title: 'sample_values'},
          yaxis: {range: [0, 250]},
          xaxis: {title: 'otu_ids'},
        };

        Plotly.newPlot("bubble", data, layout);
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
          d3.select("#sample-metadata").append("h5").text(`${key1}:${value1}`)})
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    });
  }

// Initialize the dashboard
init();