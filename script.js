// D3 imports
const {
  select,
  json,
  scaleLinear,
  scaleBand,
  scaleTime,
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
const render = (sourceData) => {

  // Format received data
  // Transform nested arrays to objects with date and value prop
  const data = sourceData.data.map(d => ({
    date: new Date(d[0]),
    value: d[1]
  }));

  console.log(sourceData);
  
  const yMin = new Date(sourceData.from_date);
  const yMax = new Date(sourceData.to_date);

  // Value accessors
  const xValue = (d) => d.value;
  const yValue = (d) => d.date;

  // Margins
  const margin = { top: 50, right: 20, bottom: 20, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const barWidth = innerHeight / data.length;

  // x scale
  const xScale = scaleLinear()
    .domain([0, max(data, xValue)])
    .range([0, innerWidth]);

  // x axis
  const xAxis = axisBottom(xScale);

  // y scale
  const yScale = scaleTime()
    .domain([yMin, yMax])
    .range([0, innerHeight]);

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
      .attr('height', barWidth)
      .attr('y', (d) => yScale(yValue(d)));
};

// Make http request using json method from d3
json(url).then((sourceData) => {
  

  render(sourceData);
});
