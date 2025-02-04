// Function to capitalize the first letter of each word
function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Build the metadata panel as a table
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let sample_metadata = metadata.filter(row => row.id === parseInt(sample))[0];
    console.log(sample_metadata);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Clear any existing content
    panel.html("");

    // Create a table and append
    let table = panel.append("table").attr("class", "table table-striped");

    // Create table body
    let tbody = table.append("tbody");

    // Append a row for each key-value pair
    Object.entries(sample_metadata).forEach(([key, value]) => {
      let row = tbody.append("tr");

      // Capitalize names in table
      let capitalizedKey = capitalizeWords(key.replace("_", " "));

      row.append("td").text(capitalizedKey).attr("class", "font-weight-bold");
      row.append("td").text(value);
    });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let sample_data = samples.filter(row => row.id === sample)[0];
    console.log(sample_data);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sample_data.otu_ids;
    let otu_labels = sample_data.otu_labels;
    let sample_values = sample_data.sample_values;

    // Build a Bubble Chart
    let trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids, // Use OTU IDs for color variation
        size: sample_values, // Bubble size based on sample values
        colorscale: 'Earth' // Set colorscale for better visualization
      }
    };

    let traces = [trace];

    let layout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' },
      showlegend: false,
      height: 550,
      width: window.innerWidth * 0.80 // Makes chart almost full width
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", traces, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let bar_trace = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
      marker: {
        color: "steelblue"
      }
    };

    let bar_layout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" },
      yaxis: { title: "" },
      margin: { l: 100, r: 50, t: 50, b: 50 }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", [bar_trace], bar_layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Populate dropdown options
    for (let i = 0; i < names.length; i++) {
      let name = names[i];

      // Append options with proper value attribute
      dropdown.append("option")
        .text(name)
        .attr("value", name);
    }

    // Get the first sample from the list
    let first_sample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(first_sample);
    buildCharts(first_sample);

    // Add event listener for dropdown change
    dropdown.on("change", function() {
      let newSample = d3.select(this).property("value");
      optionChanged(newSample);
    });
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();