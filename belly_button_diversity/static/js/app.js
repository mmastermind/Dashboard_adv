function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(data) {
    console.log(data);
    // Use d3 to select the panel with id of `#sample-metadata`
    var outputtable= d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    outputtable.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
        outputtable.append("h6").text(`${key}:${value}`);
        });
    });
}

// BONUS: Build the Gauge Chart; CHECK how data can be passed
function buildGauge(sample) {
    d3.json(`/metadata/${sample}`).then(function(datag) {
      console.log(datag);
      var valuegauge = datag.WFREQ;
    
    var data = [{domain: {x: [0, 1], y: [0, 1]}, value: valuegauge, title: {text: "Scrubs / Week"},
      type: "indicator", mode: "gauge+number", gauge:
      {axis: {range: [null, 9]}, steps: [{range: [0, 3], color: "lightgray"},
      {range: [3, 6], color: "gray"},{range: [6, 9], color: "darkgray"}], threshold: {line: {color: "red", width: 4},
      thickness: 0.75, value: 3}}}];

    var layout = {width: 600, height: 500, margin: {t: 0, b: 0}};
      Plotly.newPlot("gauge",data,layout);
    });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  d3.json(`/samples/${sample}`).then(function(data){
      var ids = data.otu_ids;
      // console.log(ids);
      var labels = data.otu_labels;
      var values = data.sample_values;
    
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: ids,
      y: values,
      text: labels,
      mode: 'markers',
      marker: {
        color:ids,
        size:values
      }
    };
    
    var data = [trace1];
    
    var layout = {
      title: 'Bacterias Bubble Size',
      showlegend: false,
      height: 600,
      width: 1200
    };
    
    Plotly.newPlot('bubble', data, layout);
  });

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  d3.json(`/samples/${sample}`).then(function(data){
      var ids2 = data.otu_ids.slice(0,10);
      // console.log(ids2);
      var values2 = data.sample_values.slice(0,10);

    var trace2 = {
        labels: ids2,
        values: values2,
        type: 'pie'
      };
    
    var data2 = [trace2];

    var layout = {
        title: "Pie Chart",
    };
    // console.log(sample);
    Plotly.newPlot("pie", data2, layout);
  });
}

function init() {
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
    // console.log(sampleNames);
    buildCharts(firstSample);
    buildGauge(firstSample);
    buildMetadata(firstSample)
  });
  
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  // Grab a reference to the dropdown select element
  // var value = d3.event.target.value; ALTERNATE CODE WK2/3/5 STU_ON CHANGE
  var selector = d3.select("#selDataset").event;

  // Use the list of sample names to populate the select options
  d3.json("/names").then((newSample) => {
      selector
        .append("option")
        .text(newSample)
        .property("value", newSample);
    });

  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample)

}

// Initialize the dashboard
init();
