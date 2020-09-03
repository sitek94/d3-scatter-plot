const { 
  select, 
  json, 
  scaleLinear,
  scaleTime,
  scaleOrdinal,
  extent,
  axisLeft,
  axisBottom,
  format,
  timeFormat,
  timeParse,
} = d3;

// Svg dimensions
const width = 900;
const height = 700;

// Root element
const root = select('#root');

// Set svg dimensions
const svg = select('svg')
  .attr('width', width)
  .attr('height', height);

// Doping scale
const dopingScale = scaleOrdinal()
  .domain(['clean', 'allegations'])
  .range(['clean', 'allegations']);

// Legend component
const dopingLegend = (selection, props) => {
  const { 
    dopingScale, 
    circleRadius,
    circleSpacing,
    textOffset
  } = props;

  const groups = selection.selectAll('g')
    .data(dopingScale.domain());

  // Legend container
  const groupsEnter = groups.enter().append('g')
    .append('g');

  // Containers
  groupsEnter
    .merge(groups)
      .attr('transform', (d, i) => 
            `translate(0,${i * circleSpacing})`)
    groups.exit().remove();

  // Labels
  groupsEnter
    .append('text')
    .merge(groups.select('text'))
      .text(d => d)
      // Center text vertically trick
      .attr('dy', '0.32em')
      .attr('x', textOffset)
      .attr('text-anchor', 'end');

  // Circles
  groupsEnter
    .append('circle')
    .merge(groups.select('circle'))
      .attr('class', dopingScale)
      .attr('r', circleRadius);
}

// render function
const render = data => {
	
  // Title and subtitle
  const title = 'Doping in Professional Bicycle Racing';
  const subtitle = '35 Fastest times up Alpe d\'Huez';

  // Values accessors
  const xValue = d => d.Year;
  const yValue = d => d.Time;
  // y axis label
  const yAxisLabel = 'Time in minutes';
  
  const circleRadius = 15;

  // Margins
  const margin = { top: 100, right: 20, bottom: 90, left: 150 };

  // Inner width and height
  const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

  // If empty string then there are no allegations
  const parseDoping = doping =>
    doping === "" 
      ? 'clean'
      : 'allegations';

  // x scale
  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();
  
  // y scale
  const yScale = scaleTime()
    .domain(extent(data, yValue))
  	.range([0, innerHeight])
  	.nice();
  
  // Container g element
  const gContainer = svg.append('g')
  	.attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Format ticks to display minutes and seconds
  const yAxisTickFormat = timeFormat('%M:%S');

  // y axis
  const yAxis = axisLeft(yScale)
    .tickFormat(yAxisTickFormat)
  	.tickSize(-innerWidth)
  	.tickPadding(20);
  
  // y axis g element
  const yAxisG = gContainer.append('g').call(yAxis)
    .attr('id', 'y-axis');
  // Remove domain and tick lines from y axis
  yAxisG.select('.domain').remove();
  
  // Y axis label
  yAxisG.append('text')
  	.attr('class', 'axis-label')
  	.attr('text-anchor', 'middle')
  	.attr('x', -innerHeight / 2)
  	.attr('y', -70)
  	.attr('transform', `rotate(-90)`)
  	.text(yAxisLabel);
  
  // X axis
  const xAxis = axisBottom(xScale)
    .tickFormat(format(''))
  	.tickSize(-innerHeight)
  	.tickPadding(20);
  
  // X axis element
  const xAxisG = gContainer.append('g').call(xAxis)
    .attr('id', 'x-axis')
  	.attr('transform', `translate(0, ${innerHeight})`);
  // Remove domain line from x axis
  xAxisG.select('.domain').remove();
  
  // Tooltip container
  const tooltip = root.append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0);

  // Tooltip header 
  const tooltipName = tooltip
    .append('h3')
    .attr('class', 'tooltip-name');
  
  // Tooltip details
  const tooltipDetails = tooltip
    .append('p')
    .attr('class', 'tooltip-details');
    

  // Mouse over handler
  const handleMouseover = d => {

    // Show tooltip transition
    tooltip.transition()		
      .duration(200)		
      .style("opacity", .9);
    
    // Update name
    tooltipName.html(`${d.Name}`);

    // Construct details
    const details = [
      `Nationality: ${d.Nationality}`,
      `Year: ${d.Year}`,
      `Place: ${d.Place}`,
      `Time: ${yAxisTickFormat(d.Time)}`,
      `Doping: ${d.Doping === '' ? 'No allegations' : d.Doping}`
    ].join('<br>');
    
    // Update details
    tooltipDetails.html(details);

    // Offset to position the tooltip depending on its y position
    const yOffset = d3.event.pageY > 350 ? -170 : 100;

    // Tooltip position and value attr
    tooltip
      .attr('data-year', xValue(d))
      .style("left", (d3.event.pageX) + "px")		
      .style("top", (d3.event.pageY + yOffset) + "px");
  }
  // Mouse out handler
  const handleMouseout = () => {
    tooltip.transition()		
      .duration(500)		
      .style("opacity", 0);	
  }

  // Circles
  gContainer.selectAll('circle').data(data)
    .enter().append('circle')
      // Position and dimensions
  		.attr('cy', d => yScale(yValue(d)))
  		.attr('cx', d => xScale(xValue(d)))
      .attr('r', circleRadius)
      // Data
      .attr('data-xvalue', xValue)
      .attr('data-yvalue', yValue)
      // Add class accordingly to doping allegations
      .attr('class', d => `dot ${parseDoping(d.Doping)}`)
      // Event handlers
      .on('mouseover', handleMouseover)
      .on('mouseout', handleMouseout);

  // Title
  gContainer.append('text')
  	.attr('id', 'title')
  	.attr('y', -60)
    .text(title);
    
  // Subtitle
  gContainer.append('text')
    .attr('id', 'sub-title')
    .attr('y', -30)
    .text(subtitle);

  // Legend
  svg.append('g')
    .attr('id', 'legend')
    // Position in the top right corner
    .attr('transform', `translate(849,127)`)
    .call(dopingLegend, {
      dopingScale,
      circleRadius: 20,
      circleSpacing: 50,
      textOffset: -30,
    });
}

json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(data => {
    console.log(data);

    // Parse time in minutes to data objects
    data.forEach(d => {
      d.Time = timeParse('%M:%S')(d.Time);
    });

    render(data);
});










