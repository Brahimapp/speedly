import React, { useState } from 'react';
import { useSpeedly, type SpeedRecord } from '../context/SpeedlyContext';
import { Calendar, MapPin, AlertTriangle, Trash2 } from 'lucide-react';

const History: React.FC = () => {
  const { speedRecords, clearHistory } = useSpeedly();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'exceeding'>('all');

  const filteredRecords = selectedFilter === 'all'
    ? speedRecords
    : speedRecords.filter(record => record.isExceeding);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Speed History</h1>
        <div className="flex space-x-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'exceeding')}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="all">All Records</option>
            <option value="exceeding">Exceeding Only</option>
          </select>
          <button
            onClick={clearHistory}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-error-600 hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear History
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredRecords.length === 0 ? (
            <li className="px-6 py-12">
              <div className="text-center">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No records found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start scanning speed limits to build your history.
                </p>
              </div>
            </li>
          ) : (
            filteredRecords.map((record: SpeedRecord) => (
              <li key={record.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.isExceeding 
                          ? 'bg-error-100 text-error-800'
                          : 'bg-success-100 text-success-800'
                      }`}>
                        {record.detectedSpeed} mph
                      </span>
                      <span className="text-sm text-gray-500">
                        Speed Limit: {record.speedLimit} mph
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                      {formatDate(record.timestamp)}
                    </div>
                    
                    {record.location.address && (
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        {record.location.address}
                      </div>
                    )}
                  </div>
                  
                  {record.isExceeding && (
                    <div className="ml-4">
                      <AlertTriangle className="h-5 w-5 text-warning-500" />
                    </div>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default History;