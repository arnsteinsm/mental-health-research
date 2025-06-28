import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { researchData, countryNames, DataPoint } from '../data/research-data';
import { Search, ArrowUpDown, Filter, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

const DataTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof DataPoint>('country');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterGender, setFilterGender] = useState<'all' | 'M' | 'F'>('all');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAccidentColumn, setShowAccidentColumn] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Complete Dataset
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the complete research dataset with advanced filtering and sorting capabilities. 
            All rates are age-standardized per 100,000 population.
          </p>
        </motion.div>

        {/* Compact Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-6 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900">Dataset Overview</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {filteredAndSortedData.length} records
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isExpanded ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Collapse Table</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Explore Data</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Array.from(new Set(researchData.map(d => d.country))).filter(c => c !== 'EU27_2020').length}
              </div>
              <div className="text-sm text-blue-800">Countries</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Array.from(new Set(researchData.map(d => d.year))).length}
              </div>
              <div className="text-sm text-green-800">Years</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {researchData.filter(d => d.sex === 'M').length}
              </div>
              <div className="text-sm text-purple-800">Male Records</div>
            </div>
            <div className="p-3 bg-pink-50 rounded-lg">
              <div className="text-2xl font-bold text-pink-600">
                {researchData.filter(d => d.sex === 'F').length}
              </div>
              <div className="text-sm text-pink-800">Female Records</div>
            </div>
          </div>
        </motion.div>

        {/* Methodological Note - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
          className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 text-sm mb-1">Dataset Note: Accident Rates</h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Accident mortality rates are included for completeness but excluded from primary correlation analysis 
                due to diverse causation factors beyond mental health scope.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Expandable Table Section */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Filters */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="grid md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value as 'all' | 'M' | 'F')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
                  >
                    <option value="all">All Years</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
                  >
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center space-x-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={showAccidentColumn}
                      onChange={(e) => setShowAccidentColumn(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Show Accidents</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th 
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('country')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Country</span>
                        {getSortIcon('country')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('year')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Year</span>
                        {getSortIcon('year')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('sex')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Gender</span>
                        {getSortIcon('sex')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('alcohol_rate')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Alcohol Rate</span>
                        {getSortIcon('alcohol_rate')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('suicide_rate')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Suicide Rate</span>
                        {getSortIcon('suicide_rate')}
                      </div>
                    </th>
                    {showAccidentColumn && (
                      <th 
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('accident_rate')}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Accident Rate*</span>
                          {getSortIcon('accident_rate')}
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.map((item, index) => (
                    <motion.tr
                      key={`${item.country}-${item.year}-${item.sex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.01 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {countryNames[item.country] || item.country}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.year}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.sex === 'M' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-pink-100 text-pink-800'
                        }`}>
                          {item.sex === 'M' ? 'Male' : 'Female'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                        {parseFloat(item.alcohol_rate).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                        {parseFloat(item.suicide_rate).toFixed(2)}
                      </td>
                      {showAccidentColumn && (
                        <td className="px-4 py-3 text-sm text-gray-400 font-mono">
                          {parseFloat(item.accident_rate).toFixed(2)}
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Table Footer Note */}
            {showAccidentColumn && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  * Accident rates shown for completeness but excluded from primary correlation analysis due to diverse causation factors beyond mental health scope.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DataTable;