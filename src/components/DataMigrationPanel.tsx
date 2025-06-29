import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Database, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { populateWithSampleData } from '../utils/data-migration';

const DataMigrationPanel: React.FC = () => {
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSampleDataMigration = async () => {
    setMigrationStatus('loading');
    setMessage('Inserting sample data...');

    try {
      const result = await populateWithSampleData();
      
      if (result.success) {
        setMigrationStatus('success');
        setMessage(`Successfully inserted ${result.recordsInserted} sample records!`);
      } else {
        setMigrationStatus('error');
        setMessage(`Migration failed: ${result.error}`);
      }
    } catch (error) {
      setMigrationStatus('error');
      setMessage(`Migration failed: ${error.message}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-2xl mx-auto"
    >
      <div className="flex items-center mb-6">
        <Database className="w-8 h-8 text-blue-600 mr-3" />
        <div>
          <h3 className="text-xl font-bold text-gray-900">Database Migration</h3>
          <p className="text-sm text-gray-600">Populate Supabase with mental health research data</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Migration Status</h4>
          <p className="text-sm text-blue-800">
            The application has been updated to use Supabase instead of the JSON file. 
            Click below to populate the database with sample data.
          </p>
        </div>

        {message && (
          <div className={`border rounded-lg p-4 ${
            migrationStatus === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800'
              : migrationStatus === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center">
              {migrationStatus === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
              {migrationStatus === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
              {migrationStatus === 'loading' && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2" />
              )}
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleSampleDataMigration}
            disabled={migrationStatus === 'loading'}
            className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Upload className="w-5 h-5 mr-2" />
            {migrationStatus === 'loading' ? 'Migrating...' : 'Populate Sample Data'}
          </button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Note:</strong> This will insert sample data for 5 countries (DE, FR, ES, IT, PL) with 2021-2022 data.</p>
          <p>For production, you would migrate the complete JSON dataset using the migration utilities.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DataMigrationPanel;