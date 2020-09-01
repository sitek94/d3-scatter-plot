const { 
  select, 
  json, 
  scaleLinear,
  scaleTime,
  extent,
  axisLeft,
  axisBottom,
  format
} = d3;

// Svg dimensions
const width = 900;
const height = window.innerHeight;

// Set svg dimensions
const svg = select('svg')
  .attr('width', width)
  .attr('height', height);

// render function
const render = data => {
	
  // Title and subtitle
  const title = 'Doping in Professional Bicycle Racing';
  const subtitle = '35 Fastest times up Alpe d\'Huez';

  // Values accessors
  const xValue = d => d.Year;
  const yValue = d => d.Place;
  // y axis label
  const yAxisLabel = 'Time in minutes';
  
  const circleRadius = 10;

  // Margins
  const margin = { top: 100, right: 20, bottom: 90, left: 150 };

  // Inner width and height
  const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;
  
  // x scale
  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();
  
  // y scale
  const yScale = scaleLinear()
  	.domain(extent(data, yValue))
  	.range([0, innerHeight])
  	.nice();
  
  // Container g element
  const g = svg.append('g')
  	.attr('transform', `translate(${margin.left},${margin.top})`);
  
  // y axis
  const yAxis = axisLeft(yScale)
  	.tickSize(-innerWidth)
  	.tickPadding(20);
  
  // y axis g element
  const yAxisG = g.append('g')
    .call(yAxis);
  	
  // Remove domain and tick lines from y axis
  yAxisG.select('.domain').remove();
  
  // y axis label
  yAxisG.append('text')
  	.attr('class', 'axis-label')
  	.attr('text-anchor', 'middle')
  	.attr('x', -innerHeight / 2)
  	.attr('y', -70)
  	.attr('transform', `rotate(-90)`)
  	.text(yAxisLabel);
  
  // x axis
  const xAxis = axisBottom(xScale)
    .tickFormat(format(''))
  	.tickSize(-innerHeight)
  	.tickPadding(20);
  
  // Append x axis
  const xAxisG = g.append('g').call(xAxis)
  	.attr('transform', `translate(0, ${innerHeight})`);
  
  // Remove domain line from x axis
  xAxisG.select('.domain').remove();
  
  // Append circles
  g.selectAll('circle').data(data)
    .enter().append('circle')
      .attr('class', 'circle')
  		.attr('cy', d => yScale(yValue(d)))
  		.attr('cx', d => xScale(xValue(d)))
  		.attr('r', circleRadius);
  
  // Title
  g.append('text')
  	.attr('id', 'title')
  	.attr('y', -60)
    .text(title);
    
  // Subtitle
  g.append('text')
    .attr('id', 'sub-title')
    .attr('y', -30)
    .text(subtitle);
}

json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(data => {
    console.log(data);

    render(data);
});










