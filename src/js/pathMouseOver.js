function init(crimeData) {
  const mainColor = '#1e2c5b';
  const mapping = d3.map(crimeData, d=>d.state);
  d3.selectAll('.statePath')
    .on('mouseover', function() {
      d3.select(this)
        .attr('stroke-dasharray', '0 0')
        .attr('stroke', 'gold')
        .attr('stroke-width', 3);

      const datum = d3.select(this).datum();
      d3.select('#tooltip')
        .classed('active', true)
        .html(function(d) {
          const name = datum.properties['name'];
          const stateD = mapping.get(name);
          const fbiContent = stateD['hate_fbi']? `<p>Pre-election average annual hate crimes: ${(stateD['hate_fbi']/36.5).toFixed(2)} per 10 days per 100,000 residents</p>
    <div class="pre_election" style="width: ${(stateD['hate_fbi']/36.5).toFixed(2)*200}px"></div>`: `<p>FBI data is unavailable</p>`;
          const splcContent = stateD['hate_splc']? `<p>Post-election hate incidents: ${stateD['hate_splc'].toFixed(2)} in 10 days per 100,000 residents</p>
    <div class="post_election" style="width: ${stateD['hate_splc'].toFixed(2)*200}px"></div>
    </p>`:`<p>SPLC data is unavailable.</p>`;
          const htmlContent = `<p><strong>${stateD.state}</strong></p>`+fbiContent + splcContent;
          return htmlContent
        })
        .style('left', d3.event.pageX-150 + 'px')
        .style('top', d3.event.pageY-200 + 'px')

    }).on('mouseout', function() {
      d3.select(this)
        .attr('stroke-dasharray', '3 3')
        .attr('stroke', mainColor)
        .attr('stroke-width', 1);
    d3.select('#tooltip')
      .classed('active', false)
  });


}

export default { init }
