console.log("app.js")
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

let select_ref = d3.select("#selDataset");

d3.json(url).then((data) => {
    console.log("data")
    console.log(data)
    let sampleNames = data.names;

    sampleNames.forEach((sample) => {
        select_ref
            .append("option")
            .text(sample)
            .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
});

function optionChanged(sample) {
    buildMetadata(sample);
    buildCharts(sample);
    buildMetadata(sample);
}

function buildMetadata(sample) {
    d3.json(url).then((data) => {

        let metadata = data.metadata;
        let resultArray = metadata.filter(mObj => mObj.id == sample);
        let result = resultArray[0];

        let m_box = d3.select("#sample-metadata");

        m_box.html("");

        Object.entries(result).forEach(([key, value]) => {
            m_box.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });


    });
}

function buildCharts(sample) {
    d3.json(url).then((data) => {

        let samples = data.samples;
        let resultArray = samples.filter(mObj => mObj.id == sample);
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;


        let barData = [
            {
                y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h",
            }
        ];

        let barLayout = {
            title: "Top 10 Bacteria Found",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", barData, barLayout);


        let bubbleLayout = {
            title: "Sample Bacteria",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30 }
        };

        let bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
        ];

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });

}