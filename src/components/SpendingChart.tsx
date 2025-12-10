import React from 'react';
import { Dimensions, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useStore } from '../store/useStore';

const screenWidth = Dimensions.get('window').width;

export default function SpendingChart() {
  const transactions = useStore((s) => s.transactions);
  const grouped: Record<string, number> = {};
  transactions.forEach((t) => {
    const cat = t.category || 'Uncategorized';
    if (t.type === 'debit') grouped[cat] = (grouped[cat] || 0) + t.amount;
  });

  const data = Object.keys(grouped).map((k, i) => ({
    name: k,
    population: grouped[k],
    color: `hsl(${(i * 60) % 360} 60% 50%)`,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  if (!data.length) return null;

  return (
    <View style={{ marginVertical: 12 }}>
      <PieChart
        data={data}
        width={screenWidth - 24}
        height={220}
        chartConfig={{ backgroundGradientFrom: '#fff', backgroundGradientTo: '#fff', decimalPlaces: 2 }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="10"
      />
    </View>
  );
}
