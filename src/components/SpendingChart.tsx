// src/components/SpendingChart.tsx
import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useStore } from '../store/useStore';
import { Colors } from '../theme';

const screenWidth = Dimensions.get('window').width;

export default function SpendingChart() {
  const transactions = useStore((s) => s.transactions);

  // group debit amounts by category
  const grouped: Record<string, number> = {};
  transactions.forEach((t) => {
    const cat = (t.category || 'Uncategorized').trim() || 'Uncategorized';
    if (t.type === 'debit') grouped[cat] = (grouped[cat] || 0) + t.amount;
  });

  const data = Object.keys(grouped).map((k, i) => ({
    name: k,
    population: grouped[k],
    // chart-kit expects a color string; pick distinct HSL hues
    color: `hsl(${(i * 55) % 360} 70% 45%)`,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  // chartConfig must provide a color function
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(47,128,237, ${opacity})`, // primary color with opacity
    decimalPlaces: 2,
    labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
  };

  if (!data.length) {
    return (
      <View style={{ padding: 12 }}>
        <Text style={{ color: Colors.muted }}>No spending data yet</Text>
      </View>
    );
  }

  return (
    <View style={{ marginVertical: 12, alignItems: 'center' }}>
      <PieChart
        data={data}
        width={Math.min(screenWidth - 48, 400)}
        height={200}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="10"
        absolute={false}
      />
    </View>
  );
}
