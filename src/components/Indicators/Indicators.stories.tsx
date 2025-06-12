import type { Meta, StoryObj } from '@storybook/react';
import Indicators from './Indicators';
import React from 'react';
import { BarChart, Settings } from 'lucide-react';

// Map string icon names to actual icon components
const iconMap = {
  bar: <BarChart className="w-4 h-4" />,
  settings: <Settings className="w-4 h-4" />,
};

// Map string function names to actual functions
const functionMap = {
  showStats: () => alert('Stats clicked!'),
  configure: () => console.log('Configure clicked'),
};

const meta: Meta<typeof Indicators> = {
  title: 'Components/Indicators',
  component: Indicators,
};
export default meta;

type Story = StoryObj<typeof Indicators>;

export const Default: Story = {
  args: {
    indicators: [
      {
        title: 'Total Users',
        value: 12400,
        actions: [
          {
            icon: iconMap.bar,
            text: 'Stats',
            onClick: functionMap.showStats,
          },
        ],
      },
      {
        title: 'Active Sessions',
        value: '1.5K',
        actions: [
          {
            icon: iconMap.settings,
            text: 'Configure',
            onClick: functionMap.configure,
          },
        ],
      },
    ],
  },
};
