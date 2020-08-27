// D3 imports
const {
  select,
  json,
  scaleLinear,
  scaleBand,
  min,
  max,
  axisLeft,
  axisBottom,
} = d3;

// Source data
const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const rootPadding = 50;

// Svg dimensions
const width = window.innerWidth - rootPadding;
const height = window.innerHeight - rootPadding;

// Root
const root = select('#root');

// Svg
const svg = root.append('svg')
  .attr('width', width)
  .attr('height', height);

// Render function
const render = (data) => {
  // Value accessors
  const xValue = (d) => d[1];
  const yValue = (d) => d[0];

  // Margins
  const margin = { top: 50, right: 20, bottom: 20, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // x scale
  const xScale = scaleLinear()
    .domain([0, max(data, xValue)])
    .range([0, innerWidth]);

  // x axis
  const xAxis = axisBottom(xScale);

  // y scale
  const yScale = scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.2);

  // y axis
  const yAxis = axisLeft(yScale);

  // Create group element inside svg
  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Title 
  g.append('text')
    .attr('id', 'title')
    .attr('y', -10)
    .text('Gross Domestic Product (GDP)');

  // Create y axis g element
  const yAxisG = g.append('g').call(yAxis)
    .attr('id', 'y-axis');

  // Create x axis g element
  const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`)
    .attr('id', 'x-axis');

  // Append bars
  g.selectAll('rect').data(data).enter()
    .append('rect')
      .attr('class', 'bar')
      .attr('width', (d) => xScale(xValue(d)))
      .attr('height', (d) => yScale.bandwidth())
      .attr('y', (d) => yScale(yValue(d)));
};

// Make http request using json method from d3
json(url).then((sourceData) => {
  const { data } = sourceData;

  // Render only part of the data during development
  render(data.slice(0, 20));
});
