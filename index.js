const height = 500;
const width = 1000;
const padding = 70;
const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";


d3.json(url, function (data) {
    let GDP = data.data.map(item => item[1]);
    let dataDate = data.data.map(item => item[0]);

    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(GDP)])
        .range([0, height - padding * 2]);

    const yAxisScale = d3
        .scaleLinear()
        .domain([0, d3.max(GDP)])
        .range([height - padding * 2, 0]);


    const yAxis = d3.axisLeft(yAxisScale);

    let time = data.data.map(item => new Date(item[0]));
    let xMax = new Date(d3.max(time));
    xMax.setMonth(xMax.getMonth() + 3);

    let xScale = d3
        .scaleTime()
        .domain([d3.min(time), xMax])
        .range([0, GDP.length * 3]);

    let xAxis = d3.axisBottom().scale(xScale);

    let newWidth = padding * 2 + GDP.length * 3;

    const svg = d3
        .select(".innerContainer")
        .append("svg")
        .attr("height", height)
        .attr("width", newWidth);

    var div = d3
        .select(".innerContainer")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0.6);

    svg
        .selectAll("rect")
        .data(GDP)
        .enter()
        .append("rect")
        .attr("data-date", (d, i) => data.data[i][0])
        .attr("data-gdp", (d, i) => data.data[i][1])
        .attr("class", "bar")
        .attr("fill", "#4d110d")
        .attr("x", (d, i) => padding + i * 3)
        .attr("y", (d, i) => height - yScale(d) - padding)
        .attr("width", 3)
        .attr("height", (d, i) => yScale(d))
        .on("mouseover", function (d, i) {
            div
                .transition()
                .duration(200)
                .style("opacity", 0.6);
            div
                .attr("data-date", data.data[i][0])
                .attr("id", "tooltip")
                .html(function () {
                    let month = data.data.map(item => item[0].substring(5, 7));
                    let year = data.data.map(item => item[0].substring(0, 4));
                    let quarter = "";
                    if (month[i] == "01") {
                        quarter = "Q1";
                    } else if (month[i] == "04") {
                        quarter = "Q2";
                    } else if (month[i] == "07") {
                        quarter = "Q3";
                    } else if (month[i] == "10") {
                        quarter = "Q4";
                    }
                    return `<p id="paragraph">${quarter} ${year[i]} <br> $${GDP[i]} Billion</p>`;
                })
                .style("left", d3.event.pageX - 75 + "px")
                .style("top", d3.event.pageY - 60 + "px");
        })

        .on("mouseout", function (d) {
            div
                .transition()
                .duration(500)
                .style("opacity", 0);
        });

    svg
        .append("g")
        .call(yAxis)
        .attr("class", "yAxis")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, ${padding})`);

    svg
        .append("g")
        .call(xAxis)
        .attr("class", "xAxis")
        .attr("id", "x-axis")
        .attr("transform", `translate(${padding}, ${height - padding})`);

    svg
        .append("text")
        .text("Gross Domestic Product")
        .attr("transform", "rotate(270)")
        .attr("x", -width / 3)
        .attr("y", padding - 50);

    svg
        .append("text")
        .text("Timeline")
        .attr("transform", `translate(${width / 2 - 40}, ${height - 30})`);

    svg
        .append("text")
        .text("GDP of The US")
        .attr("id", "title")
        .attr("transform", `translate(${width / 2 - 110},${padding - 30})`);

})