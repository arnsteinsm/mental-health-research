import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { decadeResearchData, countryNames } from '../data/decade-research-data';
import { Filter, BarChart3, Zap, TrendingUp, Calendar, Share2, Copy, Check, ChevronDown, Search, MapPin } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { detectUserCountry, getSuggestedCountries, getPreselectionMessage } from '../utils/geoLocation';

interface DataPoint {
  country: string;
  year: string;
  sex: 'M' | 'F';
  alcohol_rate: string;
  suicide_rate: string;
  accident_rate: string;
}

const InteractiveVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const timeSeriesRef = useRef<SVGSVGElement>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['DE', 'FR', 'ES', 'IT', 'PL']);
  const [selectedMetric, setSelectedMetric] = useState<'alcohol_rate' | 'suicide_rate'>('alcohol_rate');
  const [selectedYear, setSelectedYear] = useState<string>('2022');
  const [viewMode, setViewMode] = useState<'comparison' | 'timeseries'>('comparison');
  const [genderView, setGenderView] = useState<'separate' | 'combined'>('separate');
  const [hoveredData, setHoveredData] = useState<DataPoint | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [geoDetected, setGeoDetected] = useState(false);
  const [geoMessage, setGeoMessage] = useState('');

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
    }
  };

  const availableCountries = Object.keys(countryNames);
  // Updated to show full dataset range: 2011-2022
  const availableYears = ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'];

  // Filter countries based on search term
  const filteredCountries = availableCountries.filter(country =>
    (countryNames[country] || country).toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  // Geo-detection and preselection
  useEffect(() => {
    const performGeoDetection = async () => {
      setIsLoading(true);
      setLoadError(false);
      
      try {
        // Simulate loading time while detecting location
        const [detectedCountry] = await Promise.all([
          detectUserCountry(),
          new Promise(resolve => setTimeout(resolve, 1500)) // Minimum loading time for UX
        ]);
        
        const suggestedCountries = getSuggestedCountries(detectedCountry);
        const message = getPreselectionMessage(detectedCountry);
        
        setSelectedCountries(suggestedCountries);
        setGeoMessage(message);
        setGeoDetected(!!detectedCountry);
        setIsLoading(false);
      } catch (error) {
        console.error('Geo-detection error:', error);
        setLoadError(true);
        setIsLoading(false);
      }
    };

    performGeoDetection();
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

  // Comparison Chart
  useEffect(() => {
    if (!svgRef.current || viewMode !== 'comparison' || isLoading || loadError) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const loadingTimeout = setTimeout(() => {
      const margin = { top: 40, right: 120, bottom: 80, left: 80 };
      const width = 800 - margin.left - margin.right;
      const height = 500 - margin.bottom - margin.top;

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Filter data
      const filteredData = decadeResearchData.filter(d => 
        selectedCountries.includes(d.country) && d.year === selectedYear
      );

      if (genderView === 'combined') {
        // Calculate combined rates (weighted average)
        const combinedData = selectedCountries.map(country => {
          const maleData = filteredData.find(d => d.country === country && d.sex === 'M');
          const femaleData = filteredData.find(d => d.country === country && d.sex === 'F');
          
          if (!maleData || !femaleData) return null;
          
          const maleRate = parseFloat(maleData[selectedMetric]);
          const femaleRate = parseFloat(femaleData[selectedMetric]);
          const combinedRate = (maleRate * 0.51) + (femaleRate * 0.49);
          
          return {
            country,
            year: selectedYear,
            sex: 'Combined' as const,
            [selectedMetric]: combinedRate.toString(),
            alcohol_rate: combinedRate.toString(),
            suicide_rate: combinedRate.toString(),
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
        // Separate male and female data
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

  // Time Series Chart with dual lines for gender comparison
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

      // Filter and prepare time series data for both genders
      const timeSeriesData = selectedCountries.map(country => {
        const maleData = decadeResearchData
          .filter(d => d.country === country && d.sex === 'M')
          .sort((a, b) => parseInt(a.year) - parseInt(b.year));
        
        const femaleData = decadeResearchData
          .filter(d => d.country === country && d.sex === 'F')
          .sort((a, b) => parseInt(a.year) - parseInt(b.year));
        
        return {
          country,
          male: maleData.map(d => ({
            year: parseInt(d.year),
            value: parseFloat(d[selectedMetric])
          })),
          female: femaleData.map(d => ({
            year: parseInt(d.year),
            value: parseFloat(d[selectedMetric])
          }))
        };
      });

      // Create scales - Updated to show full range 2011-2022
      const xScale = d3.scaleLinear()
        .domain([2011, 2022])
        .range([0, width]);

      const allValues = timeSeriesData.flatMap(d => [...d.male.map(v => v.value), ...d.female.map(v => v.value)]);
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(allValues) || 0])
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

      // Add lines for both genders
      timeSeriesData.forEach((countryData, index) => {
        // Male line (solid)
        if (countryData.male.length > 0) {
          const malePath = g.append("path")
            .datum(countryData.male)
            .attr("fill", "none")
            .attr("stroke", colorScale(countryData.country))
            .attr("stroke-width", 3)
            .attr("d", line);

          // Animate line drawing
          const totalLength = malePath.node()?.getTotalLength() || 0;
          malePath
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(1500)
            .delay(index * 200)
            .attr("stroke-dashoffset", 0);
        }

        // Female line (dashed)
        if (countryData.female.length > 0) {
          const femalePath = g.append("path")
            .datum(countryData.female)
            .attr("fill", "none")
            .attr("stroke", colorScale(countryData.country))
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5")
            .attr("opacity", 0.7)
            .attr("d", line);

          // Animate line drawing
          const totalLength = femalePath.node()?.getTotalLength() || 0;
          femalePath
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(1500)
            .delay(index * 200 + 300)
            .attr("stroke-dashoffset", 0)
            .attr("stroke-dasharray", "5,5");
        }

        // Add country label
        const lastMalePoint = countryData.male[countryData.male.length - 1];
        if (lastMalePoint) {
          g.append("text")
            .attr("x", xScale(lastMalePoint.year) + 5)
            .attr("y", yScale(lastMalePoint.value))
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

      // Add gender legend
      const legend = g.append("g")
        .attr("transform", `translate(${width + 20}, 60)`);

      legend.append("line")
        .attr("x1", 0)
        .attr("x2", 20)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("stroke", "#666")
        .attr("stroke-width", 3);

      legend.append("text")
        .attr("x", 25)
        .attr("y", 4)
        .text("Male")
        .style("font-size", "12px");

      legend.append("line")
        .attr("x1", 0)
        .attr("x2", 20)
        .attr("y1", 20)
        .attr("y2", 20)
        .attr("stroke", "#666")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .attr("opacity", 0.7);

      legend.append("text")
        .attr("x", 25)
        .attr("y", 24)
        .text("Female")
        .style("font-size", "12px");

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
            Explore the full dataset (2011-2022) across {availableCountries.length} European countries. 
            Discover gender disparities and temporal trends with age-standardized rates per 100,000 population.
          </p>
        </motion.div>

        {isLoading ? (
          <LoadingSpinner 
            message="Detecting your location and loading visualizations..." 
            type="chart" 
          />
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8 mb-8">
            {/* Geo-detection notification */}
            {geoMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg border ${
                  geoDetected 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{geoMessage}</span>
                  {geoDetected && (
                    <span className="text-xs opacity-75">(You can change the selection below)</span>
                  )}
                </div>
              </motion.div>
            )}

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
                  Time Series (Male vs Female)
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
                
                {/* Search Input */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={countrySearchTerm}
                    onChange={(e) => setCountrySearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Dropdown Toggle */}
                <button
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-700">
                    {selectedCountries.length} countries selected
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Scrollable Country List */}
                {isCountryDropdownOpen && (
                  <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    <div className="p-2">
                      <div className="grid grid-cols-1 gap-1">
                        {filteredCountries.map(country => (
                          <label key={country} className="flex items-center space-x-2 text-sm p-2 hover:bg-gray-50 rounded cursor-pointer">
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
                            <span className="flex-1">{countryNames[country] || country}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {filteredCountries.length === 0 && (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        Choose countries and gender to view trends in alcohol mortality.
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Countries Summary */}
                {selectedCountries.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs text-blue-800 font-medium mb-2">Selected Countries:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedCountries.slice(0, 3).map(country => (
                        <span key={country} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {countryNames[country] || country}
                          <button
                            onClick={() => setSelectedCountries(selectedCountries.filter(c => c !== country))}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {selectedCountries.length > 3 && (
                        <span className="text-xs text-blue-600">
                          +{selectedCountries.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
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
                    <strong>Note:</strong> Time series shows both male (solid line) and female (dashed line) trends 
                    across the full dataset period (2011-2022). This highlights the persistent gender disparities 
                    throughout the entire analysis period.
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
                    <strong>{metrics[selectedMetric].label}:</strong> {parseFloat(hoveredData[selectedMetric]).toFixed(2)} {metrics[selectedMetric].unit}
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
          <h3 className="text-xl font-bold text-gray-900 mb-3">Full Dataset Insights (2011-2022)</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Persistent Gender Disparities</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Across the complete 12-year dataset (2011-2022), men consistently show dramatically higher rates in both 
                alcohol and suicide metrics. This pattern persists across all countries and years, demonstrating the 
                systemic nature of this crisis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Strong Correlation Evidence</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                The extended dataset strengthens our correlation findings, showing that where alcohol 
                deaths are high, suicide rates follow—particularly among men. This relationship remains 
                consistent throughout the entire analysis period.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveVisualization;