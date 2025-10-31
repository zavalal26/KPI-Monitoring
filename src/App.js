import React, { useState, createContext, useContext, useReducer } from 'react';
import { Plus, FileText, X, Search, BarChart3, AlertTriangle, Users, Filter, Upload, File } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// KNAPP Asset Structure
const knappAreas = ['AB01', 'AS01', 'AS02', 'CONN', 'ESTO', 'KV01', 'SH01', 'WE01', 'WE02'];

const areaSubAreaMapping = {
  'AB01': ['AB01.01'],
  'AS01': ['AS01.01'], 
  'AS02': ['AS02.01', 'AS02.02'],
  'SH01': ['SH01.01', 'SH01.02', 'SH01.03'],
  'WE01': ['WE01.01', 'WE01.02', 'WE01.03'],
  'WE02': ['WE02.01', 'WE02.02']
};

const timeFilterOptions = [
  { value: 'last1h', label: 'Last 1 Hour' },
  { value: 'last4h', label: 'Last 4 Hours' },
  { value: 'last12h', label: 'Last 12 Hours' },
  { value: 'last24h', label: 'Last 24 Hours' },
  { value: 'last7d', label: 'Last 7 Days' }
];

// Sample Data
const sampleAlarmData = [
  { messageNumber: 'E-PLC-COM-0001', appeared: '2025-09-10 23:00:42', disappeared: '2025-09-10 23:15:16', area: 'CONN', component: 'CPUAH', messageText: 'PLC-Host connection error', source: 'CPUAH', severity: 'critical' },
  { messageNumber: 'E-SHUT-ERR-0005', appeared: '2025-09-10 21:30:00', disappeared: '2025-09-10 21:45:30', area: 'SH01', component: 'SHUT0245', messageText: 'Shuttle positioning error', source: 'CPUAD', severity: 'critical' },
  { messageNumber: 'W-SHUT-SLOW-0006', appeared: '2025-09-10 21:00:00', disappeared: '2025-09-10 21:05:20', area: 'SH01', component: 'SHUT0156', messageText: 'Shuttle speed below threshold', source: 'CPUAD', severity: 'warning' }
];

const sampleScannerData = [
  { warehouseArea: 'WE01.05', readingDevice: '01A', correctReadingsPercent: 100.00, noReads: 0 },
  { warehouseArea: 'WE01.05', readingDevice: '02A', correctReadingsPercent: 90.00, noReads: 1 }
];

const sampleMotorData = [
  { area: 'SH01.15', motor: '0001L-MA01', totalRuntime: 468, totalErrorTime: 2 },
  { area: 'AB01.01', motor: '0002L-MA01', totalRuntime: 400, totalErrorTime: 50 }
];

const sampleLoggingData = [
  { time: '2025-09-10 21:32:00', component: 'SHUT0311', logText: 'Command enable successfully implemented', user: 'SYSTEM.SRC' }
];

// Data Context
const DataContext = createContext(null);

function DataProvider({ children }) {
  const [data, setData] = useState({
    alarms: sampleAlarmData,
    scanners: sampleScannerData,
    motors: sampleMotorData,
    logging: sampleLoggingData
  });

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
}

function useData() {
  return useContext(DataContext);
}

// Filters Context
const FiltersContext = createContext(undefined);

function FiltersProvider({ children }) {
  const [filters, setFilters] = useState({
    timeRange: 'last24h',
    area: '',
    subArea: ''
  });

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}

function useFilters() {
  return useContext(FiltersContext);
}

// Components
function FileUploader() {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">File Upload</h3>
      </div>
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
        <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-300 mb-2">Drop CSV or PDF files here</p>
        <input type="file" multiple accept=".csv,.pdf" className="hidden" id="file-upload" />
        <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-block">
          Browse Files
        </label>
      </div>
    </div>
  );
}

function FilterPanel() {
  const { filters, setFilters } = useFilters();

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">System Filters</h3>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Time Range</label>
          <select value={filters.timeRange} onChange={(e) => setFilters({...filters, timeRange: e.target.value})} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
            {timeFilterOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Area</label>
          <select value={filters.area} onChange={(e) => setFilters({...filters, area: e.target.value, subArea: ''})} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
            <option value="">All Areas</option>
            {knappAreas.map(area => <option key={area} value={area}>{area}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Sub-Area</label>
          <select value={filters.subArea} onChange={(e) => setFilters({...filters, subArea: e.target.value})} disabled={!filters.area} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white disabled:opacity-50">
            <option value="">All Sub-Areas</option>
            {filters.area && (areaSubAreaMapping[filters.area] || []).map(sub => <option key={sub} value={sub}>{sub}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

function KPIDashboard() {
  const { data } = useData();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Overall Equipment Effectiveness</p>
          <div className="text-3xl font-bold text-orange-500">85%</div>
          <p className="text-sm text-gray-400 mt-2">Target: 95%</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Avg Scanner Accuracy</p>
          <div className="text-3xl font-bold text-yellow-500">96.7%</div>
          <p className="text-sm text-gray-400 mt-2">Target: 99.5%</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Motor Runtime Efficiency</p>
          <div className="text-3xl font-bold text-green-500">92%</div>
          <p className="text-sm text-gray-400 mt-2">Target: 95%</p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">Alarm History</h3>
        <div className="space-y-2">
          {data.alarms.map((alarm, i) => (
            <div key={i} className="p-3 bg-gray-700 rounded">
              <div className="text-white font-medium">{alarm.messageText}</div>
              <div className="text-sm text-gray-400">{alarm.area} - {alarm.component}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <DataProvider>
      <FiltersProvider>
        <div className="min-h-screen bg-gray-900">
          <nav className="bg-gray-800 shadow-sm border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <h1 className="text-xl font-bold text-white">SCADA Monitor</h1>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto py-6 px-4">
            <div className="space-y-6">
              <FileUploader />
              <FilterPanel />
              <KPIDashboard />
            </div>
          </main>
        </div>
      </FiltersProvider>
    </DataProvider>
  );
}

export default App;
