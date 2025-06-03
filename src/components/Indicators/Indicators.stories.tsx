import React from 'react';

type Action = {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
};

type Progress = {
  label: string;
  percent: number;
};

type Indicator = {
  title: string;
  value: number | string;
  progress?: Progress;
  actions?: Action[];
};

type IndicatorsProps = {
  indicators: Indicator[];
};

const Indicators: React.FC<IndicatorsProps> = ({ indicators }) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {indicators.map((item, index) => (
        <div key={index} className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">{item.title}</h2>
          <p className="text-2xl font-bold">{item.value}</p>

          {/* Progress bar */}
          {item.progress && (
            <div className="mt-3">
              <div className="text-sm text-gray-600 mb-1">
                {item.progress.label} ({item.progress.percent}%)
              </div>
              <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-2 rounded transition-all duration-300"
                  style={{ width: `${item.progress.percent}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {item.actions && (
            <div className="flex flex-wrap gap-2 mt-4">
              {item.actions.map((action, i) => (
                <button
                  key={i}
                  onClick={action.onClick}
                  className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 px-3 py-1 text-sm rounded"
                >
                  {action.icon}
                  {action.text}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Indicators;
