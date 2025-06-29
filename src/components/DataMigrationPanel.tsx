import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Database, Upload, Zap } from 'lucide-react';
import React, { useState } from 'react';
imrawDarawData2b9847_197datacbquxjob_32b9847_197b3606c2f.json
import { insertMentalHealthData, type MentalHealthDataInsert } from '../services/supabase-data-service';
im{ pop{ populateWithSampleData }thSampleDautils/ta }-migrationtionononon';

const DataMigrationPanel: React.FC = () => {
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const handleSampleDataMigration = async () => {
    setMigrationStatus('loading');
    setMessage('Inserting sample data...');
    setProgress(0);

    try {
      const result = await populateWithSampleData();
      
      if (result.success) {
        setMigrationStatus('success');
        setMessage(`Successfully inserted ${result.recordsInserted} sample records!`);
        setProgress(100);
      } else {
        setMigrationStatus('error');
        setMessage(`Migration failed: ${result.error}`);
      }
    } catch (error) {
      setMigrationStatus('error');
      setMessage(`Migration failed: ${error.message}`);
    }
  };

  const handleCompleteDataMigration = async () => {
    setMigrationStatus('loading');
    setMessage('Starting complete dataset migration...');
    setProgress(0);

    try {
      // Transform the JSON data
      const transformedData: MentalHealthDataInsert[] = rawData.map(row => ({
        country: row.country || '',
        year: Number.parseInt(row.year, 10) || 0,
        sex: (row.sex || 'M') as 'M' | 'F',
        alcohol_rate: Number.parseFloat(row.alcohol_rate) || 0,
        suicide_rate: Number.parseFloat(row.suicide_rate) || 0,
        accident_rate: Number.parseFloat(row.accident_rate) || 0,
      }));

      setMessage(`Migrating ${transformedData.length} records...`);

      // Insert in batches
      const batchSize = 50;
      const batches = [];
      
      for (let i = 0; i < transformedData.length; i += batchSize) {
        batches.push(transformedData.slice(i, i + batchSize));
      }

      let totalInserted = 0;
      for (let i = 0; i < batches.length; i++) {
        try {
          await insertMentalHealthData(batches[i]);
          totalInserted += batches[i].length;
          const progressPercent = Math.round((totalInserted / transformedData.length) * 100);
          setProgress(progressPercent);
          setMessage(`Migrated ${totalInserted}/${transformedData.length} records (${progressPercent}%)`);
          
          // Small delay to avoid rate limiting
          if (i < batches.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error(`Batch ${i + 1} failed:`, error);
          // Continue with next batch
        }
      }

      const countries = [...new Set(transformedData.map(d => d.country))];
      const years = [...new Set(transformedData.map(d => d.year))].sort();
      
      setMigrationStatus('success');
      setMessage(`🎉 Successfully migrated ${totalInserted} records! ${countries.length} countries, ${years.length} years (${years[0]}-${years[years.length-1]})`);
      setProgress(100);

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
            Choose below to populate the database with sample data or the complete dataset.
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
            {migrationStatus === 'loading' && progress > 0 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleSampleDataMigration}
            disabled={migrationStatus === 'loading'}
            className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Upload className="w-5 h-5 mr-2" />
            {migrationStatus === 'loading' ? 'Migrating...' : 'Sample Data'}
          </button>
          
          <button
            onClick={handleCompleteDataMigration}
            disabled={migrationStatus === 'loading'}
            className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Zap className="w-5 h-5 mr-2" />
            {migrationStatus === 'loading' ? 'Migrating...' : 'Complete Dataset'}
          </button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Sample Data:</strong> 20 records for 5 countries (DE, FR, ES, IT, PL) with 2021-2022 data.</p>
          <p><strong>Complete Dataset:</strong> 6,459 records for 34 European countries (2011-2022) - This is the full research dataset!</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DataMigrationPanel;