// Some features and code were borrowed from
// https://codepen.io/freeCodeCamp/pen/GrZVaM
// Most of the borrowed items are modified from the original

import React, { useEffect, useRef } from "https://esm.sh/react";
import { createRoot } from 'https://esm.sh/react-dom/client';

const domNode = document.getElementById("root")
const root = createRoot(domNode)

const BarChart = () => {
  const ref = useRef();
  
  useEffect(() => {
    // Create some sizing for the SVG
    const margin = { top: 450, right: 15, bottom: 15, left: 60},
          width = 800,
          height = 500;
     
    // Retrieve the data to fill the chart
    d3
      .json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
      .then((data) => {
        const years = data.data.map((year) => {
          const temp = year[0].substring(5, 7);
          let quarter;
          
          if(temp === '01') quarter = "Q1";
          else if(temp === '04') quarter = "Q2";
          else if(temp === '07') quarter = "Q3";
          else if(temp === '10') quarter = "Q4";
          
          return year[0].substring(0, 4) + ' ' + quarter;
        });
      
        const yearsDate = data.data.map((item) => {
          return new Date(item[0]);
        });
             
        const gdps = data.data.map((g) => {
          return g[1];
        });
            
        // Find the maximum x value
        const xMax = new Date(d3.max(yearsDate));
        xMax.setMonth(xMax.getMonth() + 3);
      
        // Create the x and y scales
        const xScale = d3.scaleTime([d3.min(yearsDate), xMax], [0, width - 100]);
        const yScale = d3.scaleLinear([d3.max(gdps), 0], [60, height * 0.9]);
        
        // Create the x and y axes
        const xAxis = d3.axisBottom().scale(xScale);
        const yAxis = d3.axisLeft().scale(yScale);
        
        // Make a tooltip
        const tooltip = d3
          .select(ref.current)
            
        // Start building the SVG
        const svg = d3.select(ref.current);
          
        svg
          .append("text")
          .attr("x", width / 3)
          .attr("y", 25)
          .attr("id", "title")
          .text("United States GDP")
      
        svg
          .append("text")
          .attr("transform", "rotate(-45)")
          .attr("x", -220)
          .attr("y", 370)
          .text("Gross Domestic Product, Per Quarter (Billions USD)");
      
        svg
          .append("text")
          .attr("x", width / 6)
          .attr("y", height - 10)
          .attr("class", "info")
          .text("More Information: https://www.bea.gov/resources/methodologies/nipa-handbook");
      
        svg
          .append("g")
          .call(xAxis)
          .attr("id", "x-axis")
          .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
      
        svg
          .append("g")
          .call(yAxis)
          .attr("id", "y-axis")
          .attr("transform", "translate(60, 0)");
      
        svg
          .selectAll("rect")
          .data(gdps)
          .enter()
          .append("rect")
          .attr("index", (d, i) => i)
          .attr("data-date", (d, i) => data.data[i][0])
          .attr("data-gdp", (d, i) => data.data[i][1])
          .attr("class", "bar")
          .attr("x", (d, i) => xScale(yearsDate[i]) + margin.left)
          .attr("y", (d) => yScale(d))
          .attr("width", width / gdps.length + "px")
          .attr("height", (d) => margin.top - yScale(d) + "px")
          .on("mouseover", (e, d) => {
            const i = e.target.getAttribute("index");
          
            let x = parseFloat(e.target.getAttribute("x"));
            if(i < gdps.length / 2) x += 35;
            else x -= 100;
          
            d3
              .select("#tooltip")
              .style("left", x +  "px")
              .style("top", height - 100 + "px")
              .style("opacity", "1.0")
              .attr("data-date", data.data[i][0])
              .html(years[i] + "<br>$" + gdps[i] + " Billion")
          })
          .on("mouseout", () => {
            d3.select("#tooltip").style("opacity", "0")
          })
      }); // End .then
  }, []); // End useEffect
  return <svg width={800} height={500} id="barchart" ref={ref} />;
} // End BarChart component

// Main App
const App = () => {
 
  return (
    <div id="chart-wrap">
      <div id="tooltip"></div>
      <BarChart />
      <div id="tribute"><em>by</em> <span class="author">Sfluack</span></div>
    </div>
  );
}

// Rend Main App
root.render(<App/>, document.getElementById("root"));
