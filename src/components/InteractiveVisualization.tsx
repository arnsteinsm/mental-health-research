import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { researchData, countryNames, DataPoint } from '../data/research-data';
import { Filter, BarChart3, Zap, TrendingUp, Calendar, Share2, Copy, Check } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const InteractiveVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const timeSeriesRef = useRef<SVGSVGElement>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['DE', 'FR', 'UK', 'ES', 'IT']);
  const [selectedMetric, setSelectedMetric] = useState<'alcohol_rate' | 'suicide_rate' | 'accident_rate'>('alcohol_rate');
  const [selectedYear, setSelectedYear] = useState<string>('2022');
  const [viewMode, setViewMode] = useState<'comparison' | 'timeseries'>('comparison');
  const [genderView, setGenderView] = useState<'separate' | 'combined'>('separate');
  const [hoveredData, setHoveredData] = useState<DataPoint | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const metrics = {
    alcohol_rate: { 
      label: 'Alcohol-Related Mortality', 
      color: '#8b5cf6', 
      unit: 'per 100k',
      description: 'Age-standardized death rate due to mental and behavioural disorders due to alcohol use (ICD-10: F10)'
    },
    suicide_rate: { 
      label: 'Suicide Rate', 
      color: '#ef4444', 
      unit: 'per 100k',
      description: 'Age-standardized suicide death rate (ICD-10: X60–X84, Y870)'
    },
    accident_rate: { 
      label: 'Accident Rate', 
      color: '#f59e0b', 
      unit: 'per 100k',
      description: 'Age-standardized accidental death rate (ICD-10 group "ACC")'
    }
  };

  const availableCountries = Array.from(new Set(researchData.map(d => d.country)))
    .filter(country => country !== 'EU27_2020')
    .sort();

  const availableYears = Array.from(new Set(researchData.map(d => d.year))).sort();

  // Simulate loading time and check for data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setLoadError(false);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if data is available
        if (!researchData || researchData.length === 0) {
          throw new Error('No data available');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Data loading error:', error);
        setLoadError(true);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Generate shareable URL
  const generateShareableUrl = () => {
    const params = new URLSearchParams({
      countries: selectedCountries.join(','),
      metric: selectedMetric,
      year: selectedYear,
      view: viewMode,
      gender: genderView
    });
    return `${window.location.origin}${window.location.pathname}#visualization?${params.toString()}`;
  };

  // Load state from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    
    if (urlParams.has('countries')) {
      const countries = urlParams.get('countries')?.split(',').filter(c => availableCountries.includes(c)) || [];
      if (countries.length > 0) setSelectedCountries(countries);
    }
    
    if (urlParams.has('metric') && Object.keys(metrics).includes(urlParams.get('metric')!)) {
      setSelectedMetric(urlParams.get('metric') as any);
    }
    
    if (urlParams.has('year') && availableYears.includes(urlParams.get('year')!)) {
      setSelectedYear(urlParams.get('year')!);
    }
    
    if (urlParams.has('view') && ['comparison', 'timeseries'].includes(urlParams.get('view')!)) {
      setViewMode(urlParams.get('view') as any);
    }
    
    if (urlParams.has('gender') && ['separate', 'combined'].includes(urlParams.get('gender')!)) {
      setGenderView(urlParams.get('gender') as any);
    }
  }, []);

  // Copy shareable link to clipboard
  const copyShareableLink = async () => {
    try {
      await navigator.clipboard.writeText(generateShareableUrl());
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  // Comparison Chart with loading state
  useEffect(() => {
    if (!svgRef.current || viewMode !== 'comparison' || isLoading || loadError) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Add loading animation
    const loadingTimeout = setTimeout(() => {
      const margin = { top: 40, right: 120, bottom: 80, left: 80 };
      const width = 800 - margin.left - margin.right;
      const height = 500 - margin.bottom - margin.top;

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Filter data
      const filteredData = researchData.filter(d => 
        selectedCountries.includes(d.country) && d.year === selectedYear
      );

      if (genderView === 'combined') {
        // Calculate combined rates (weighted average by typical population distribution)
        const combinedData = selectedCountries.map(country => {
          const maleData = filteredData.find(d => d.country === country && d.sex === 'M');
          const femaleData = filteredData.find(d => d.country === country && d.sex === 'F');
          
          if (!maleData || !femaleData) return null;
          
          // Approximate 50-50 gender split for combined rate
          const combinedRate = (parseFloat(maleData[selectedMetric]) + parseFloat(femaleData[selectedMetric])) / 2;
          
          return {
            country,
            year: selectedYear,
            sex: 'Combined' as const,
            [selectedMetric]: combinedRate.toString(),
            alcohol_rate: '',
            suicide_rate: '',
            accident_rate: ''
          };
        }).filter(Boolean) as DataPoint[];

        // Create scales
        const xScale = d3.scaleBand()
          .domain(selectedCountries)
          .range([0, width])
          .padding(0.3);

        const maxValue = d3.max(combinedData, d => +d[selectedMetric]) || 0;
        const yScale = d3.scaleLinear()
          .domain([0, maxValue * 1.1])
          .range([height, 0]);

        // Create axes
        g.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(xScale).tickFormat(d => countryNames[d] || d))
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-45)")
          .style("font-size", "12px");

        g.append("g")
          .call(d3.axisLeft(yScale))
          .style("font-size", "12px");

        // Create bars with animation
        g.selectAll(".bar-combined")
          .data(combinedData)
          .enter().append("rect")
          .attr("class", "bar-combined")
          .attr("x", d => xScale(d.country) || 0)
          .attr("width", xScale.bandwidth())
          .attr("y", height)
          .attr("height", 0)
          .attr("fill", metrics[selectedMetric].color)
          .attr("opacity", 0.8)
          .style("cursor", "pointer")
          .transition()
          .duration(800)
          .delay((d, i) => i * 100)
          .attr("y", d => yScale(+d[selectedMetric]))
          .attr("height", d => height - yScale(+d[selectedMetric]));

        // Add hover effects after animation
        setTimeout(() => {
          g.selectAll(".bar-combined")
            .on("mouseover", function(event, d) {
              setHoveredData(d);
              d3.select(this).attr("opacity", 1);
            })
            .on("mouseout", function() {
              setHoveredData(null);
              d3.select(this).attr("opacity", 0.8);
            });
        }, 1000);

      } else {
        // Separate male and female data (existing logic with animations)
        const maleData = filteredData.filter(d => d.sex === 'M');
        const femaleData = filteredData.filter(d => d.sex === 'F');

        const xScale = d3.scaleBand()
          .domain(selectedCountries)
          .range([0, width])
          .padding(0.3);

        const maxValue = d3.max(filteredData, d => +d[selectedMetric]) || 0;
        const yScale = d3.scaleLinear()
          .domain([0, maxValue * 1.1])
          .range([height, 0]);

        // Create axes
        g.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(xScale).tickFormat(d => countryNames[d] || d))
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-45)")
          .style("font-size", "12px");

        g.append("g")
          .call(d3.axisLeft(yScale))
          .style("font-size", "12px");

        const barWidth = xScale.bandwidth() / 2;

        // Male bars with animation
        g.selectAll(".bar-male")
          .data(maleData)
          .enter().append("rect")
          .attr("class", "bar-male")
          .attr("x", d => (xScale(d.country) || 0))
          .attr("width", barWidth)
          .attr("y", height)
          .attr("height", 0)
          .attr("fill", metrics[selectedMetric].color)
          .attr("opacity", 0.8)
          .style("cursor", "pointer")
          .transition()
          .duration(800)
          .delay((d, i) => i * 100)
          .attr("y", d => yScale(+d[selectedMetric]))
          .attr("height", d => height - yScale(+d[selectedMetric]));

        // Female bars with animation
        g.selectAll(".bar-female")
          .data(femaleData)
          .enter().append("rect")
          .attr("class", "bar-female")
          .attr("x", d => (xScale(d.country) || 0) + barWidth)
          .attr("width", barWidth)
          .attr("y", height)
          .attr("height", 0)
          .attr("fill", metrics[selectedMetric].color)
          .attr("opacity", 0.5)
          .style("cursor", "pointer")
          .transition()
          .duration(800)
          .delay((d, i) => i * 100 + 400)
          .attr("y", d => yScale(+d[selectedMetric]))
          .attr("height", d => height - yScale(+d[selectedMetric]));

        // Add hover effects after animation
        setTimeout(() => {
          g.selectAll(".bar-male")
            .on("mouseover", function(event, d) {
              setHoveredData(d);
              d3.select(this).attr("opacity", 1);
            })
            .on("mouseout", function() {
              setHoveredData(null);
              d3.select(this).attr("opacity", 0.8);
            });

          g.selectAll(".bar-female")
            .on("mouseover", function(event, d) {
              setHoveredData(d);
              d3.select(this).attr("opacity", 0.7);
            })
            .on("mouseout", function() {
              setHoveredData(null);
              d3.select(this).attr("opacity", 0.5);
            });
        }, 1200);

        // Add legend
        const legend = g.append("g")
          .attr("transform", `translate(${width + 20}, 20)`);

        legend.append("rect")
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", metrics[selectedMetric].color)
          .attr("opacity", 0.8);

        legend.append("text")
          .attr("x", 20)
          .attr("y", 12)
          .text("Male")
          .style("font-size", "12px");

        legend.append("rect")
          .attr("y", 25)
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", metrics[selectedMetric].color)
          .attr("opacity", 0.5);

        legend.append("text")
          .attr("x", 20)
          .attr("y", 37)
          .text("Female")
          .style("font-size", "12px");
      }

      // Add axis labels
      g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "600")
        .text(`${metrics[selectedMetric].label} (${metrics[selectedMetric].unit})`);
    }, 300);

    return () => clearTimeout(loadingTimeout);
  }, [selectedCountries, selectedMetric, selectedYear, viewMode, genderView, isLoading, loadError]);

  // Time Series Chart with loading state
  useEffect(() => {
    if (!timeSeriesRef.current || viewMode !== 'timeseries' || isLoading || loadError) return;

    const svg = d3.select(timeSeriesRef.current);
    svg.selectAll("*").remove();

    const loadingTimeout = setTimeout(() => {
      const margin = { top: 40, right: 120, bottom: 60, left: 80 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.bottom - margin.top;

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Filter and prepare time series data
      const timeSeriesData = selectedCountries.map(country => {
        const countryData = researchData
          .filter(d => d.country === country && d.sex === 'M') // Focus on male data for time series
          .sort((a, b) => parseInt(a.year) - parseInt(b.year));
        
        return {
          country,
          values: countryData.map(d => ({
            year: parseInt(d.year),
            value: parseFloat(d[selectedMetric])
          }))
        };
      });

      // Create scales
      const xScale = d3.scaleLinear()
        .domain(d3.extent(availableYears.map(y => parseInt(y))) as [number, number])
        .range([0, width]);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(timeSeriesData.flatMap(d => d.values.map(v => v.value))) || 0])
        .range([height, 0]);

      const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(selectedCountries);

      // Create line generator
      const line = d3.line<{year: number, value: number}>()
        .x(d => xScale(d.year))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

      // Add axes
      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d => d.toString()));

      g.append("g")
        .call(d3.axisLeft(yScale));

      // Add lines with animation
      timeSeriesData.forEach((countryData, index) => {
        const path = g.append("path")
          .datum(countryData.values)
          .attr("fill", "none")
          .attr("stroke", colorScale(countryData.country))
          .attr("stroke-width", 2)
          .attr("d", line);

        // Animate line drawing
        const totalLength = path.node()?.getTotalLength() || 0;
        path
          .attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(1500)
          .delay(index * 200)
          .attr("stroke-dashoffset", 0);

        // Add country label
        const lastPoint = countryData.values[countryData.values.length - 1];
        if (lastPoint) {
          g.append("text")
            .attr("x", xScale(lastPoint.year) + 5)
            .attr("y", yScale(lastPoint.value))
            .attr("dy", "0.35em")
            .style("font-size", "12px")
            .style("fill", colorScale(countryData.country))
            .style("opacity", 0)
            .text(countryNames[countryData.country] || countryData.country)
            .transition()
            .delay(1500 + index * 200)
            .duration(500)
            .style("opacity", 1);
        }
      });

      // Add axis labels
      g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "600")
        .text(`${metrics[selectedMetric].label} (${metrics[selectedMetric].unit}) - Male`);

      g.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "600")
        .text("Year");
    }, 300);

    return () => clearTimeout(loadingTimeout);
  }, [selectedCountries, selectedMetric, viewMode, isLoading, loadError]);

  if (loadError) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Interactive Data Exploration
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-2xl mx-auto">
              <div className="text-red-600 mb-4">
                <BarChart3 className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-red-900 mb-4">Data Loading Error</h3>
              <p className="text-red-700 mb-4">
                We're experiencing difficulties loading the visualization data. 
                Please check your connection and refresh the page.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Interactive Data Exploration
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Explore gender disparities and temporal trends across {availableCountries.length} European countries. 
            All rates are age-standardized per 100,000 population for valid comparison.
          </p>
        </motion.div>

        {isLoading ? (
          <LoadingSpinner 
            message="Loading interactive visualizations..." 
            type="chart" 
          />
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8 mb-8">
            {/* Share Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={copyShareableLink}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {linkCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share View
                  </>
                )}
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('comparison')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    viewMode === 'comparison' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Country Comparison
                </button>
                <button
                  onClick={() => setViewMode('timeseries')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    viewMode === 'timeseries' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Time Series (2013-2022)
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Country Selection */}
              <div>
                <label className="flex items-center text-lg font-semibold text-gray-700 mb-4">
                  <Filter className="w-5 h-5 mr-2" />
                  Select Countries ({availableCountries.length} available)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {availableCountries.map(country => (
                    <label key={country} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedCountries.includes(country)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCountries([...selectedCountries, country]);
                          } else {
                            setSelectedCountries(selectedCountries.filter(c => c !== country));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{countryNames[country] || country}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Metric Selection */}
              <div>
                <label className="flex items-center text-lg font-semibold text-gray-700 mb-4">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Select Metric
                </label>
                <div className="space-y-3">
                  {Object.entries(metrics).map(([key, metric]) => (
                    <label key={key} className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="metric"
                        value={key}
                        checked={selectedMetric === key}
                        onChange={(e) => setSelectedMetric(e.target.value as any)}
                        className="text-blue-600 focus:ring-blue-500 mt-1"
                      />
                      <div>
                        <span className="text-sm font-medium">{metric.label}</span>
                        <p className="text-xs text-gray-500">{metric.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Controls */}
              <div>
                <label className="flex items-center text-lg font-semibold text-gray-700 mb-4">
                  <Calendar className="w-5 h-5 mr-2" />
                  Controls
                </label>
                
                {viewMode === 'comparison' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {availableYears.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender View</label>
                      <select
                        value={genderView}
                        onChange={(e) => setGenderView(e.target.value as 'separate' | 'combined')}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="separate">Separate (Male/Female)</option>
                        <option value="combined">Combined Average</option>
                      </select>
                    </div>
                  </>
                )}

                {viewMode === 'timeseries' && (
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                    <strong>Note:</strong> Time series shows male data trends from 2013-2022. 
                    This focuses on the gender showing stronger correlations in our analysis.
                  </div>
                )}
              </div>
            </div>

            {/* Visualization */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              {viewMode === 'comparison' ? (
                <svg
                  ref={svgRef}
                  width="800"
                  height="500"
                  className="w-full h-auto"
                />
              ) : (
                <svg
                  ref={timeSeriesRef}
                  width="800"
                  height="400"
                  className="w-full h-auto"
                />
              )}
              
              {hoveredData && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-900">
                      {countryNames[hoveredData.country]} - {hoveredData.sex === 'M' ? 'Male' : hoveredData.sex === 'F' ? 'Female' : 'Combined'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>{metrics[selectedMetric].label}:</strong> {hoveredData[selectedMetric]} {metrics[selectedMetric].unit}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Year: {hoveredData.year}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-50 to-purple-50 rounded-xl p-6 border border-red-200"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-3">Key Observations</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Gender Disparities</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Across all metrics and countries, men consistently show significantly higher rates than women. 
                This pattern is particularly pronounced in alcohol-related mortality, where the gender gap 
                often exceeds 3:1 ratios.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Correlation Insights</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                The strong correlation (r=0.76) between alcohol and suicide mortality among men suggests 
                alcohol misuse serves as both a risk factor and symptom of broader mental health vulnerabilities.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveVisualization;