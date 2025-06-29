// src/components/InteractiveVisualization.tsx

import * as d3 from 'd3';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Calendar,
  Check,
  ChevronDown,
  Filter,
  MapPin,
  Search,
  Share2,
  TrendingUp,
  Zap,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { countryNames, datasetStats } from '../data';
import { useResearchData } from '../services/data-service';
import { useGeoDetection } from '../services/geo-service';
import LoadingSpinner from './LoadingSpinner';

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

  // Core visualization state
  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    'DE',
    'FR',
    'ES',
    'IT',
    'PL',
  ]);
  const [selectedMetric, setSelectedMetric] = useState<'alcohol_rate' | 'suicide_rate'>(
    'alcohol_rate'
  );
  const [selectedYear, setSelectedYear] = useState<string>('2022');
  const [viewMode, setViewMode] = useState<'comparison' | 'timeseries'>('comparison');
  const [genderView, setGenderView] = useState<'separate' | 'combined'>('separate');
  const [hoveredData, setHoveredData] = useState<DataPoint | null>(null);

  // UI state
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [enableGeoDetection, setEnableGeoDetection] = useState(false);

  // Modern TanStack Query geo-detection (only when enabled)
  const {
    data: geoData,
    isLoading: isGeoLoading,
    error: geoError,
  } = useGeoDetection(enableGeoDetection);

  // TanStack Query data fetching
  const { data: researchData = [], isLoading: isDataLoading, error: dataError } = useResearchData();

  // Auto-apply geo-detection results when available
  useEffect(() => {
    if (geoData && selectedCountries.length <= 5) {
      // Only if user hasn't customized much
      setSelectedCountries(geoData.suggestedCountries);
    }
  }, [geoData, selectedCountries.length]);

  const metrics = {
    alcohol_rate: {
      label: 'Alcohol-Related Mortality',
      color: '#8b5cf6',
      unit: 'per 100k',
      description:
        'Age-standardized death rate due to mental and behavioural disorders due to alcohol use (ICD-10: F10)',
    },
    suicide_rate: {
      label: 'Suicide Rate',
      color: '#ef4444',
      unit: 'per 100k',
      description: 'Age-standardized suicide death rate (ICD-10: X60–X84, Y870)',
    },
  };

  const availableCountries = Object.keys(countryNames);
  const availableYears = [
    '2011',
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
    '2022',
  ];

  // Filter countries based on search term
  const filteredCountries = availableCountries.filter((country) =>
    (countryNames[country] || country).toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  // Trigger geo-detection on user request
  const handleGeoDetection = () => {
    setEnableGeoDetection(true);
  };

  // Generate shareable URL
  const generateShareableUrl = () => {
    const params = new URLSearchParams({
      countries: selectedCountries.join(','),
      metric: selectedMetric,
      year: selectedYear,
      view: viewMode,
      gender: genderView,
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

  // Chart rendering effects (kept as useEffect since they manipulate DOM)
  useEffect(() => {
    if (!svgRef.current || viewMode !== 'comparison') return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 120, bottom: 80, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.bottom - margin.top;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Filter data
    const filteredData = researchData.filter(
      (d) => selectedCountries.includes(d.country) && d.year === selectedYear
    );

    if (genderView === 'combined') {
      // Calculate combined rates (weighted average)
      const combinedData = selectedCountries
        .map((country) => {
          const maleData = filteredData.find((d) => d.country === country && d.sex === 'M');
          const femaleData = filteredData.find((d) => d.country === country && d.sex === 'F');

          if (!maleData || !femaleData) return null;

          const maleRate = Number.parseFloat(maleData[selectedMetric]);
          const femaleRate = Number.parseFloat(femaleData[selectedMetric]);
          const combinedRate =
            maleRate * datasetStats.populationWeights.maleWeight +
            femaleRate * datasetStats.populationWeights.femaleWeight;

          return {
            country,
            year: selectedYear,
            sex: 'Combined' as const,
            [selectedMetric]: combinedRate.toString(),
            alcohol_rate: combinedRate.toString(),
            suicide_rate: combinedRate.toString(),
            accident_rate: '',
          };
        })
        .filter(Boolean);

      // Create scales and render chart...
      const xScale = d3.scaleBand().domain(selectedCountries).range([0, width]).padding(0.3);
      const maxValue = d3.max(combinedData, (d) => +d[selectedMetric]) || 0;
      const yScale = d3
        .scaleLinear()
        .domain([0, maxValue * 1.1])
        .range([height, 0]);

      // Create axes
      g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat((d) => countryNames[d] || d))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)')
        .style('font-size', '12px');

      g.append('g').call(d3.axisLeft(yScale)).style('font-size', '12px');

      // Create animated bars
      g.selectAll('.bar-combined')
        .data(combinedData)
        .enter()
        .append('rect')
        .attr('class', 'bar-combined')
        .attr('x', (d) => xScale(d.country) || 0)
        .attr('width', xScale.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', metrics[selectedMetric].color)
        .attr('opacity', 0.8)
        .style('cursor', 'pointer')
        .transition()
        .duration(800)
        .delay((_d, i) => i * 100)
        .attr('y', (d) => yScale(+d[selectedMetric]))
        .attr('height', (d) => height - yScale(+d[selectedMetric]));

      // Add hover effects
      setTimeout(() => {
        g.selectAll('.bar-combined')
          .on('mouseover', function (_event, d) {
            setHoveredData(d as DataPoint);
            d3.select(this).attr('opacity', 1);
          })
          .on('mouseout', function () {
            setHoveredData(null);
            d3.select(this).attr('opacity', 0.8);
          });
      }, 1000);
    } else {
      // Separate male/female rendering
      const maleData = filteredData.filter((d) => d.sex === 'M');
      const femaleData = filteredData.filter((d) => d.sex === 'F');

      const xScale = d3.scaleBand().domain(selectedCountries).range([0, width]).padding(0.3);
      const maxValue = d3.max(filteredData, (d) => +d[selectedMetric]) || 0;
      const yScale = d3
        .scaleLinear()
        .domain([0, maxValue * 1.1])
        .range([height, 0]);

      // Create axes
      g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat((d) => countryNames[d] || d))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)')
        .style('font-size', '12px');

      g.append('g').call(d3.axisLeft(yScale)).style('font-size', '12px');

      const barWidth = xScale.bandwidth() / 2;

      // Male bars
      g.selectAll('.bar-male')
        .data(maleData)
        .enter()
        .append('rect')
        .attr('class', 'bar-male')
        .attr('x', (d) => xScale(d.country) || 0)
        .attr('width', barWidth)
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', metrics[selectedMetric].color)
        .attr('opacity', 0.8)
        .style('cursor', 'pointer')
        .transition()
        .duration(800)
        .delay((_d, i) => i * 100)
        .attr('y', (d) => yScale(+d[selectedMetric]))
        .attr('height', (d) => height - yScale(+d[selectedMetric]));

      // Female bars
      g.selectAll('.bar-female')
        .data(femaleData)
        .enter()
        .append('rect')
        .attr('class', 'bar-female')
        .attr('x', (d) => (xScale(d.country) || 0) + barWidth)
        .attr('width', barWidth)
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', metrics[selectedMetric].color)
        .attr('opacity', 0.5)
        .style('cursor', 'pointer')
        .transition()
        .duration(800)
        .delay((_d, i) => i * 100 + 400)
        .attr('y', (d) => yScale(+d[selectedMetric]))
        .attr('height', (d) => height - yScale(+d[selectedMetric]));

      // Add hover effects and legend
      setTimeout(() => {
        g.selectAll('.bar-male')
          .on('mouseover', function (_event, d) {
            setHoveredData(d);
            d3.select(this).attr('opacity', 1);
          })
          .on('mouseout', function () {
            setHoveredData(null);
            d3.select(this).attr('opacity', 0.8);
          });

        g.selectAll('.bar-female')
          .on('mouseover', function (_event, d) {
            setHoveredData(d);
            d3.select(this).attr('opacity', 0.7);
          })
          .on('mouseout', function () {
            setHoveredData(null);
            d3.select(this).attr('opacity', 0.5);
          });
      }, 1200);

      // Add legend
      const legend = g.append('g').attr('transform', `translate(${width + 20}, 20)`);
      legend
        .append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', metrics[selectedMetric].color)
        .attr('opacity', 0.8);
      legend.append('text').attr('x', 20).attr('y', 12).text('Male').style('font-size', '12px');
      legend
        .append('rect')
        .attr('y', 25)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', metrics[selectedMetric].color)
        .attr('opacity', 0.5);
      legend.append('text').attr('x', 20).attr('y', 37).text('Female').style('font-size', '12px');
    }
  }, [viewMode, selectedCountries, selectedMetric, selectedYear, genderView, researchData.filter]);

  // Time Series Chart
  useEffect(() => {
    if (!timeSeriesRef.current || viewMode !== 'timeseries') return;

    const svg = d3.select(timeSeriesRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 120, bottom: 60, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.bottom - margin.top;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Time series data preparation
    const timeSeriesData = selectedCountries.map((country) => {
      const maleData = researchData
        .filter((d) => d.country === country && d.sex === 'M')
        .sort((a, b) => Number.parseInt(a.year) - Number.parseInt(b.year));

      const femaleData = researchData
        .filter((d) => d.country === country && d.sex === 'F')
        .sort((a, b) => Number.parseInt(a.year) - Number.parseInt(b.year));

      return {
        country,
        male: maleData.map((d) => ({
          year: Number.parseInt(d.year),
          value: Number.parseFloat(d[selectedMetric]),
        })),
        female: femaleData.map((d) => ({
          year: Number.parseInt(d.year),
          value: Number.parseFloat(d[selectedMetric]),
        })),
      };
    });

    // Create scales
    const xScale = d3.scaleLinear().domain([2011, 2022]).range([0, width]);
    const allValues = timeSeriesData.flatMap((d) => [
      ...d.male.map((v) => v.value),
      ...d.female.map((v) => v.value),
    ]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(allValues) || 0])
      .range([height, 0]);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(selectedCountries);

    // Create line generator
    const line = d3
      .line<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat((d) => d.toString()));
    g.append('g').call(d3.axisLeft(yScale));

    // Render lines for both genders
    timeSeriesData.forEach((countryData, index) => {
      // Male line (solid)
      if (countryData.male.length > 0) {
        const malePath = g
          .append('path')
          .datum(countryData.male)
          .attr('fill', 'none')
          .attr('stroke', colorScale(countryData.country))
          .attr('stroke-width', 3)
          .attr('d', line);

        const totalLength = malePath.node()?.getTotalLength() || 0;
        malePath
          .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(1500)
          .delay(index * 200)
          .attr('stroke-dashoffset', 0);
      }

      // Female line (dashed)
      if (countryData.female.length > 0) {
        const femalePath = g
          .append('path')
          .datum(countryData.female)
          .attr('fill', 'none')
          .attr('stroke', colorScale(countryData.country))
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '5,5')
          .attr('opacity', 0.7)
          .attr('d', line);

        const totalLength = femalePath.node()?.getTotalLength() || 0;
        femalePath
          .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(1500)
          .delay(index * 200 + 300)
          .attr('stroke-dashoffset', 0)
          .attr('stroke-dasharray', '5,5');
      }

      // Add country labels
      const lastMalePoint = countryData.male[countryData.male.length - 1];
      if (lastMalePoint) {
        g.append('text')
          .attr('x', xScale(lastMalePoint.year) + 5)
          .attr('y', yScale(lastMalePoint.value))
          .attr('dy', '0.35em')
          .style('font-size', '12px')
          .style('fill', colorScale(countryData.country))
          .style('opacity', 0)
          .text(countryNames[countryData.country] || countryData.country)
          .transition()
          .delay(1500 + index * 200)
          .duration(500)
          .style('opacity', 1);
      }
    });

    // Add legend and labels
    const legend = g.append('g').attr('transform', `translate(${width + 20}, 60)`);
    legend
      .append('line')
      .attr('x1', 0)
      .attr('x2', 20)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', '#666')
      .attr('stroke-width', 3);
    legend.append('text').attr('x', 25).attr('y', 4).text('Male').style('font-size', '12px');
    legend
      .append('line')
      .attr('x1', 0)
      .attr('x2', 20)
      .attr('y1', 20)
      .attr('y2', 20)
      .attr('stroke', '#666')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('opacity', 0.7);
    legend.append('text').attr('x', 25).attr('y', 24).text('Female').style('font-size', '12px');

    // Add axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text(`${metrics[selectedMetric].label} (${metrics[selectedMetric].unit})`);

    g.append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 10})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Year');
  }, [viewMode, selectedCountries, selectedMetric, researchData.filter]);

  if (geoError) {
    console.error('Geo-detection failed:', geoError);
  }

  // Show loading state while data is being fetched
  if (isDataLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <LoadingSpinner message="Loading research data..." type="data" />
        </div>
      </section>
    );
  }

  // Show error state if data fetch failed
  if (dataError) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Data</h2>
            <p className="text-gray-600 mb-4">
              There was an error loading the research data. Please try refreshing the page.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
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
            Explore the full dataset (2011-2022) across {availableCountries.length} European
            countries. Discover gender disparities and temporal trends with age-standardized rates
            per 100,000 population.
          </p>
        </motion.div>

        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
          {/* Geo-detection section */}
          {!enableGeoDetection && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Want personalized country suggestions based on your location?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleGeoDetection}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Detect Location
                </button>
              </div>
            </div>
          )}

          {/* Geo-detection results */}
          {geoData && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg border bg-green-50 border-green-200 text-green-800"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{geoData.message}</span>
                {geoData.isDetected && (
                  <span className="text-xs opacity-75">(You can change the selection below)</span>
                )}
              </div>
            </motion.div>
          )}

          {/* Loading state for geo-detection */}
          {isGeoLoading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Detecting your location...
                </span>
              </div>
            </div>
          )}

          {/* Share Button */}
          <div className="flex justify-end mb-6">
            <button
              type="button"
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
            <div className="bg-white rounded-lg p-1 shadow-xs">
              <button
                type="button"
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
                type="button"
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
              <div className="flex items-center text-lg font-semibold text-gray-700 mb-4">
                <Filter className="w-5 h-5 mr-2" />
                Select Countries ({availableCountries.length} available)
              </div>

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
                type="button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-700">
                  {selectedCountries.length} countries selected
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Scrollable Country List */}
              {isCountryDropdownOpen && (
                <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  <div className="p-2">
                    <div className="grid grid-cols-1 gap-1">
                      {filteredCountries.map((country) => (
                        <label
                          key={country}
                          htmlFor={`country-${country}`}
                          className="flex items-center space-x-2 text-sm p-2 hover:bg-gray-50 rounded-sm cursor-pointer"
                        >
                          <input
                            id={`country-${country}`}
                            type="checkbox"
                            checked={selectedCountries.includes(country)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCountries([...selectedCountries, country]);
                              } else {
                                setSelectedCountries(
                                  selectedCountries.filter((c) => c !== country)
                                );
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex-1">{countryNames[country] || country}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Metric Selection */}
            <div>
              <div className="flex items-center text-lg font-semibold text-gray-700 mb-4">
                <BarChart3 className="w-5 h-5 mr-2" />
                Health Metric
              </div>
              <div className="space-y-3">
                {Object.entries(metrics).map(([key, metric]) => (
                  <label
                    key={key}
                    htmlFor={`metric-${key}`}
                    className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      id={`metric-${key}`}
                      type="radio"
                      name="metric"
                      value={key}
                      checked={selectedMetric === key}
                      onChange={(e) => setSelectedMetric(e.target.value as typeof selectedMetric)}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{metric.label}</div>
                      <div className="text-xs text-gray-500">{metric.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Year and Gender Selection */}
            <div className="space-y-6">
              {/* Year Selection */}
              <div>
                <div className="flex items-center text-lg font-semibold text-gray-700 mb-4">
                  <Calendar className="w-5 h-5 mr-2" />
                  Year {viewMode === 'comparison' ? '(for comparison)' : '(time series shows all)'}
                </div>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender View Selection */}
              {viewMode === 'comparison' && (
                <div>
                  <div className="flex items-center text-lg font-semibold text-gray-700 mb-4">
                    <Zap className="w-5 h-5 mr-2" />
                    Gender View
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="gender-separate"
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        id="gender-separate"
                        type="radio"
                        name="genderView"
                        value="separate"
                        checked={genderView === 'separate'}
                        onChange={(e) => setGenderView(e.target.value as typeof genderView)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">Separate (Male vs Female)</span>
                    </label>
                    <label
                      htmlFor="gender-combined"
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        id="gender-combined"
                        type="radio"
                        name="genderView"
                        value="combined"
                        checked={genderView === 'combined'}
                        onChange={(e) => setGenderView(e.target.value as typeof genderView)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">Combined (Weighted Average)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chart Container */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {viewMode === 'comparison' ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {metrics[selectedMetric].label} Comparison ({selectedYear})
                </h3>
                <div className="relative">
                  <svg
                    ref={svgRef}
                    width="100%"
                    height="500"
                    viewBox="0 0 800 500"
                    className="w-full h-auto"
                  />
                  {hoveredData && (
                    <div className="absolute top-4 right-4 bg-black/75 text-white p-2 rounded text-sm">
                      <div className="font-medium">
                        {countryNames[hoveredData.country] || hoveredData.country}
                      </div>
                      <div>
                        {hoveredData.sex === 'Combined'
                          ? 'Combined'
                          : hoveredData.sex === 'M'
                            ? 'Male'
                            : 'Female'}
                        : {Number.parseFloat(hoveredData[selectedMetric]).toFixed(1)}{' '}
                        {metrics[selectedMetric].unit}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {metrics[selectedMetric].label} Time Series (2011-2022)
                </h3>
                <div className="relative">
                  <svg
                    ref={timeSeriesRef}
                    width="100%"
                    height="400"
                    viewBox="0 0 800 400"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveVisualization;
