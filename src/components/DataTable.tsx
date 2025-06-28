import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { researchData, countryNames, DataPoint } from '../data/research-data';
import { Search, ArrowUpDown, Filter, AlertTriangle } from 'lucide-react';

const DataTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof DataPoint>('country');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterGender, setFilterGender] = useState<'all' | 'M' | 'F'>('all');
  const [filterYear, setFilterYear] = useState<string>('all');

  const years = useMemo(() => {
    return Array.from(new Set(researchData.map(d => d.year))).sort();
  }, []);

  const filteredAndSortedData = useMemo(() => {
    let filtered = researchData.filter(item => {
      const matchesSearch = (countryNames[item.country] || item.country)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesGender = filterGender === 'all' || item.sex === filterGender;
      const matchesYear = filterYear === 'all' || item.year === filterYear;
      
      return matchesSearch && matchesGender && matchesYear;
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle numeric fields
      if (sortField === 'alcohol_rate' || sortField === 'suicide_rate' || sortField === 'accident_rate') {
        aValue = parseFloat(aValue as string);
        bValue = parseFloat(bValue as string);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [searchTerm, sortField, sortDirection, filterGender, filterYear]);

  const handleSort = (field: keyof DataPoint) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof DataPoint) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    return (
      <ArrowUpDown 
        className={`w-4 h-4 ${sortDirection === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600'}`} 
      />
    );
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Complete Dataset
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the complete research dataset with advanced filtering and sorting capabilities. 
            All rates are age-standardized per 100,000 population.
          </p>
        </motion.div>

        {/* Methodological Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8"
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Dataset Note: Accident Rates</h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                Accident mortality rates are included in this dataset for completeness but were excluded from the primary 
                correlation analysis. Accidents introduce diverse causation factors (workplace safety, traffic regulations, 
                geographic factors) beyond mental health and substance abuse, which would dilute the focused research narrative. 
                Future research could explore accident mortality as a potential indicator of risk-taking behaviors associated 
                with mental health crises.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Filters */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value as 'all' | 'M' | 'F')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Genders</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-600 flex items-center">
                Showing {filteredAndSortedData.length} records
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('country')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Country</span>
                      {getSortIcon('country')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('year')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Year</span>
                      {getSortIcon('year')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('sex')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Gender</span>
                      {getSortIcon('sex')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('alcohol_rate')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Alcohol Rate</span>
                      {getSortIcon('alcohol_rate')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('suicide_rate')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Suicide Rate</span>
                      {getSortIcon('suicide_rate')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('accident_rate')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Accident Rate*</span>
                      {getSortIcon('accident_rate')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedData.map((item, index) => (
                  <motion.tr
                    key={`${item.country}-${item.year}-${item.sex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.01 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {countryNames[item.country] || item.country}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.year}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.sex === 'M' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-pink-100 text-pink-800'
                      }`}>
                        {item.sex === 'M' ? 'Male' : 'Female'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {parseFloat(item.alcohol_rate).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {parseFloat(item.suicide_rate).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                      {parseFloat(item.accident_rate).toFixed(2)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer Note */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              * Accident rates shown for completeness but excluded from primary correlation analysis due to diverse causation factors beyond mental health scope.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DataTable;