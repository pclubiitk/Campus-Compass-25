import React from 'react';
import './App.css';
import Indicators from './components/Indicators/Indicators';
import data from './data/dummy.json';
import { BarChart, Settings } from 'lucide-react';

// Icon mapping based on string keys from dummy.json
const iconMap = {
  'bar-chart': <BarChart />,
  'settings': <Settings />,
};

// Function mapping based on string keys from dummy.json
const functionMap = {
  handleStats: () => alert('Stats clicked'),
  handleConfigure: () => console.log('Configure clicked'),
  handleGraph: () => console.log('Graph clicked'),
};

// Enrich dummy JSON data with actual React icons and functions
const enrichedData = data.map(item => ({
  ...item,
  actions: item.actions?.map(action => ({
    icon: iconMap[action.icon],
    text: action.text,
    onClick: functionMap[action.onClick],
  })),
}));

function App() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Indicators Demo</h1>
      <Indicators indicators={enrichedData} />
    </div>
  );
}

export default App;
