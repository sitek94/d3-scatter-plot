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

const svg = select('svg');

// get svg dimensions
const width = +svg.attr('width');
const height = +svg.attr('height');

// render function
const render = data => {
	
  // Variables
  const title = 'Doping in Professional Bicycle Racing';
  const xValue = d => d.Year;
  const xAxisLabel = 'Weight';
  const yValue = d => d.Place;
	const yAxisLabel = 'Acceleration';
  const circleRadius = 10;
  const margin = { 
    top: 80, 
    right: 20, 
    bottom: 90, 
    left: 150 
  };
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
    
  const g = svg.append('g')
  	.attr('transform', `translate(${margin.left},${margin.top})`);
  
  // y axis
  const yAxis = axisLeft(yScale)
  	.tickSize(-innerWidth)
  	.tickPadding(10);
  
  // y axis g element
  const yAxisG = g.append('g')
    .call(yAxis);
  	
  // remove domain and tick lines
  yAxisG.select('.domain').remove();
  
  // y axis label
  yAxisG.append('text')
  	.attr('class', 'axis-label')
  	.attr('fill', 'black')
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
  
  // append x axis
  const xAxisG = g.append('g').call(xAxis)
  	.attr('transform', `translate(0, ${innerHeight})`);
  
  // remove domain line
  xAxisG.select('.domain').remove();
  
  // add label
  xAxisG.append('text')
  	.attr('class', 'axis-label')
  	.attr('fill', 'black')
  	.attr('x', innerWidth / 2)
  	.attr('y', 80)
  	.text(xAxisLabel);
  
  // add bars
  g.selectAll('circle').data(data)
  	.enter().append('circle')
  		.attr('cy', d => yScale(yValue(d)))
  		.attr('cx', d => xScale(xValue(d)))
  		.attr('r', circleRadius);
  
  // add title
  g.append('text')
  	.attr('id', 'title')
  	.attr('y', -10)
  	.text(title);
}

json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(data => {
    console.log(data);

    render(data);
});










