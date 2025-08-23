import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { formatCurrency } from '@/utils/formatters';
// Simple chart components (replacing react-native-chart-kit)
const SimplePieChart = ({ data }: { data: any[] }) => (
  <View style={{ alignItems: 'center', marginVertical: 20 }}>
    <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 16 }}>Spending by Category</Text>
    {data.map((item, index) => (
      <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
        <View style={{ width: 16, height: 16, backgroundColor: item.color, borderRadius: 8, marginRight: 8 }} />
        <Text style={{ flex: 1 }}>{item.name}</Text>
        <Text style={{ fontWeight: '600' }}>{formatCurrency(item.population)}</Text>
      </View>
    ))}
  </View>
);

const SimpleBarChart = ({ data }: { data: any }) => (
  <View style={{ alignItems: 'center', marginVertical: 20 }}>
    <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 16 }}>Monthly Trend</Text>
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 100, marginBottom: 16 }}>
      {data.datasets[0].data.map((value: number, index: number) => (
        <View key={index} style={{ 
          width: 30, 
          backgroundColor: '#3B82F6', 
          marginHorizontal: 4,
          height: Math.max(20, (value / Math.max(...data.datasets[0].data)) * 80),
          borderRadius: 4
        }} />
      ))}
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
      {data.labels.map((label: string, index: number) => (
        <Text key={index} style={{ fontSize: 12, color: '#6B7280' }}>{label}</Text>
      ))}
    </View>
  </View>
);
import { TrendingUp, DollarSign, Calendar, Target } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForLabels: {
    fontSize: 12,
    fontWeight: '600',
  },
};

export default function AnalyticsScreen() {
  const { subscriptions, user, getTotalMonthlyAmount, getSpendingByCategory } = useSubscriptionStore();
  
  const totalMonthly = getTotalMonthlyAmount();
  const totalYearly = totalMonthly * 12;
  const spendingByCategory = getSpendingByCategory();
  
  // Prepare pie chart data
  const categoryData = Object.entries(spendingByCategory)
    .filter(([_, amount]) => amount > 0)
    .map(([category, amount], index) => {
      const colors = [
        '#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', 
        '#EF4444', '#6366F1', '#F97316', '#6B7280'
      ];
      return {
        name: category,
        population: amount,
        color: colors[index % colors.length],
        legendFontColor: '#374151',
        legendFontSize: 14,
      };
    });

  // Prepare monthly trend data (mock data for demo)
  const monthlyTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [120, 135, 142, 128, totalMonthly * 0.9, totalMonthly],
    }],
  };

  const insights = [
    {
      icon: TrendingUp,
      title: 'Monthly Spending',
      value: formatCurrency(totalMonthly),
      change: '+12% vs last month',
      positive: false,
    },
    {
      icon: DollarSign,
      title: 'Yearly Projection',
      value: formatCurrency(totalYearly),
      change: 'Based on current subscriptions',
      positive: true,
    },
    {
      icon: Calendar,
      title: 'Average per Day',
      value: formatCurrency(totalMonthly / 30),
      change: 'Daily subscription cost',
      positive: true,
    },
    {
      icon: Target,
      title: 'Budget Usage',
      value: user ? `${((totalMonthly / user.monthlyBudget) * 100).toFixed(1)}%` : '0%',
      change: user && totalMonthly > user.monthlyBudget ? 'Over budget!' : 'Within budget',
      positive: user ? totalMonthly <= user.monthlyBudget : true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Track your spending patterns</Text>
        </View>

        {/* Insights Cards */}
        <View style={styles.insightsGrid}>
          {insights.map((insight, index) => (
            <View key={index} style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <insight.icon size={20} color="#3B82F6" />
                <Text style={styles.insightTitle}>{insight.title}</Text>
              </View>
              <Text style={styles.insightValue}>{insight.value}</Text>
              <Text style={[
                styles.insightChange,
                insight.positive ? styles.positiveChange : styles.negativeChange
              ]}>
                {insight.change}
              </Text>
            </View>
          ))}
        </View>

        {/* Spending by Category */}
        {categoryData.length > 0 && (
          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>Spending by Category</Text>
            <View style={styles.chartContainer}>
              <SimplePieChart data={categoryData} />
            </View>
          </View>
        )}

        {/* Monthly Trend */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Monthly Spending Trend</Text>
          <View style={styles.chartContainer}>
            <SimpleBarChart data={monthlyTrendData} />
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          {Object.entries(spendingByCategory)
            .filter(([_, amount]) => amount > 0)
            .sort(([_, a], [__, b]) => b - a)
            .map(([category, amount], index) => {
              const percentage = (amount / totalMonthly) * 100;
              const colors = [
                '#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', 
                '#EF4444', '#6366F1', '#F97316', '#6B7280'
              ];
              return (
                <View key={category} style={styles.categoryRow}>
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryColor, { backgroundColor: colors[index % colors.length] }]} />
                    <Text style={styles.categoryName}>{category}</Text>
                  </View>
                  <View style={styles.categoryAmounts}>
                    <Text style={styles.categoryAmount}>{formatCurrency(amount)}</Text>
                    <Text style={styles.categoryPercentage}>{percentage.toFixed(1)}%</Text>
                  </View>
                </View>
              );
            })}
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>Smart Recommendations</Text>
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}>💡 Budget Optimization</Text>
            <Text style={styles.recommendationText}>
              {user && totalMonthly > user.monthlyBudget
                ? `You're ${formatCurrency(totalMonthly - user.monthlyBudget)} over budget. Consider reviewing your Entertainment subscriptions.`
                : 'Great job staying within budget! You have room for additional subscriptions if needed.'
              }
            </Text>
          </View>
          
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}>📊 Spending Insight</Text>
            <Text style={styles.recommendationText}>
              Your largest category is {categoryData.length > 0 ? categoryData[0].name : 'Entertainment'}. 
              Consider if all subscriptions in this category are actively used.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  insightValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  insightChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  positiveChange: {
    color: '#10B981',
  },
  negativeChange: {
    color: '#EF4444',
  },
  chartSection: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chart: {
    borderRadius: 16,
  },
  breakdownSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  categoryRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  categoryAmounts: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  categoryPercentage: {
    fontSize: 14,
    color: '#6B7280',
  },
  recommendationsSection: {
    marginBottom: 24,
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});