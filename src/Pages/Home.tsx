import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  Text,
  View,
  ScrollView,
  Dimensions,
  Animated,
  Pressable,
} from 'react-native';
import { styles } from '../Utils/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faUser,
  faFire,
  faCalendarWeek,
  faChartLine,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { TrackingContext } from '../Utils/Contexts/TrackingContext';

export default function Home() {
  const [todayCalories, setTodayCalories] = useState(0);
  const [weeklyCalories, setWeeklyCalories] = useState<number[]>(
    new Array(7).fill(0),
  );
  const [monthlyCalories, setMonthlyCalories] = useState<number[]>(
    new Array(12).fill(0),
  );
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [monthlyAverage, setMonthlyAverage] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'week' | 'month'>('week');

  const trackingContext = useContext(TrackingContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width - 90;

  // Calculate total calories from a track line array
  const calculateCalories = (lines: any[]) => {
    return lines.reduce((total, line) => {
      const factor =
        line.unit === 'g' ? line.quantity / 100 : (line.quantity * 1000) / 100;
      return total + line.calories * factor;
    }, 0);
  };

  // Calculate daily calories from weekly lines
  const calculateWeeklyByDay = (lines: any[]) => {
    const dailyTotals = new Array(7).fill(0);

    lines.forEach(line => {
      const d = new Date(line.date);
      const dayIndex = (d.getDay() + 6) % 7; // Monday = 0
      const factor =
        line.unit === 'g' ? line.quantity / 100 : (line.quantity * 1000) / 100;
      dailyTotals[dayIndex] += line.calories * factor;
    });

    return dailyTotals;
  };

  // Calculate monthly totals
  const calculateMonthlyByMonth = (lines: any[]) => {
    const monthlyTotals = new Array(12).fill(0);
    const currentMonth = new Date().getMonth();

    lines.forEach(line => {
      const d = new Date(line.date);
      const monthIndex = d.getMonth();
      if (monthIndex >= currentMonth - 5 && monthIndex <= currentMonth) {
        const factor =
          line.unit === 'g'
            ? line.quantity / 100
            : (line.quantity * 1000) / 100;
        monthlyTotals[monthIndex] += line.calories * factor;
      }
    });

    return monthlyTotals;
  };

  useEffect(() => {
    if (!trackingContext) return;

    const todayCal = calculateCalories(trackingContext.todayLines);
    setTodayCalories(todayCal);

    const weeklyData = calculateWeeklyByDay(trackingContext.thisWeekLines);
    setWeeklyCalories(weeklyData);
    const weeklyAvg = weeklyData.reduce((a, b) => a + b, 0) / 7;
    setWeeklyAverage(weeklyAvg);

    const monthlyData = calculateMonthlyByMonth(trackingContext.thisMonthLines);
    setMonthlyCalories(monthlyData);
    const monthlyAvg = monthlyData.reduce((a, b) => a + b, 0) / 6;
    setMonthlyAverage(monthlyAvg);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [trackingContext]);

  // Get last 6 months labels
  const getLastSixMonths = () => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const currentMonth = new Date().getMonth();
    const lastSixMonths = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      lastSixMonths.push(months[monthIndex]);
    }

    return lastSixMonths;
  };

  // Get day labels for current week
  const getDayLabels = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date().getDay();
    const startDay = (today + 7 - 6) % 7;

    const orderedDays = [];
    for (let i = 0; i < 7; i++) {
      orderedDays.push(days[(startDay + i) % 7]);
    }

    return orderedDays;
  };

  // Get filtered monthly data for last 6 months
  const getFilteredMonthlyData = () => {
    const currentMonth = new Date().getMonth();
    const startMonth = Math.max(0, currentMonth - 5);
    const endMonth = currentMonth + 1;

    return monthlyCalories.slice(startMonth, endMonth);
  };

  // Chart configuration
  const chartConfig = {
    backgroundColor: '#1c1c1c',
    backgroundGradientFrom: '#1c1c1c',
    backgroundGradientTo: '#1c1c1c',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#2196F3',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: 'rgba(255, 255, 255, 0.1)',
      strokeWidth: 1,
    },
  };

  // Bar chart configuration
  const barChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
    barPercentage: 0.6,
  };

  return (
    <Animated.View style={[styles.page, { opacity: fadeAnim }]}>
      <ScrollView
        contentContainerStyle={styles.homeContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <FontAwesomeIcon icon={faUser} color="#fff" size={28} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.userName}>User</Text>
            </View>
          </View>
        </View>

        {/* Today's Calories Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <FontAwesomeIcon icon={faFire} color="#FF5722" size={20} />
            <Text style={styles.statsTitle}>Today's Intake</Text>
          </View>
          <View style={styles.statsContent}>
            <Text style={styles.caloriesValue}>
              {Math.round(todayCalories)}
            </Text>
            <Text style={styles.caloriesUnit}>calories</Text>
          </View>
          <View style={styles.statsFooter}>
            <Text style={styles.statsSubtitle}>
              {todayCalories > 0
                ? 'Keep going! 🔥'
                : 'Time to track your first meal!'}
            </Text>
          </View>
        </View>

        {/* Analytics Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <FontAwesomeIcon icon={faChartLine} color="#4CAF50" size={20} />
            <Text style={styles.sectionTitle}>Nutrition Analytics</Text>
          </View>

          {/* Tab Selector */}
          <View style={styles.tabContainer}>
            <Pressable
              style={[
                styles.tabButton,
                selectedTab === 'week' && styles.tabButtonActive,
              ]}
              onPress={() => setSelectedTab('week')}
            >
              <FontAwesomeIcon
                icon={faCalendarWeek}
                color={selectedTab === 'week' ? '#fff' : '#888'}
                size={16}
              />
              <Text
                style={[
                  styles.tabButtonText,
                  selectedTab === 'week' && styles.tabButtonTextActive,
                ]}
              >
                Weekly
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.tabButton,
                selectedTab === 'month' && styles.tabButtonActive,
              ]}
              onPress={() => setSelectedTab('month')}
            >
              <FontAwesomeIcon
                icon={faCalendar}
                color={selectedTab === 'month' ? '#fff' : '#888'}
                size={16}
              />
              <Text
                style={[
                  styles.tabButtonText,
                  selectedTab === 'month' && styles.tabButtonTextActive,
                ]}
              >
                Monthly
              </Text>
            </Pressable>
          </View>

          {/* Charts */}
          <View style={styles.chartContainer}>
            {selectedTab === 'week' ? (
              <>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>Weekly Calories</Text>
                  <View style={styles.averageContainer}>
                    <Text style={styles.averageLabel}>Avg:</Text>
                    <Text style={styles.averageValue}>
                      {Math.round(weeklyAverage)}
                      <Text style={styles.averageUnit}> cal/day</Text>
                    </Text>
                  </View>
                </View>

                <LineChart
                  data={{
                    labels: getDayLabels(),
                    datasets: [{ data: weeklyCalories }],
                  }}
                  width={screenWidth}
                  height={220}
                  chartConfig={chartConfig}
                  style={styles.chartStyle}
                  bezier
                  fromZero
                />
              </>
            ) : (
              <>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>Monthly Calories</Text>
                  <View style={styles.averageContainer}>
                    <Text style={styles.averageLabel}>Avg:</Text>
                    <Text style={styles.averageValue}>
                      {Math.round(monthlyAverage)}
                      <Text style={styles.averageUnit}> cal/month</Text>
                    </Text>
                  </View>
                </View>

                <BarChart
                  data={{
                    labels: getLastSixMonths(),
                    datasets: [
                      {
                        data: getFilteredMonthlyData(),
                      },
                    ],
                  }}
                  width={screenWidth}
                  height={220}
                  chartConfig={barChartConfig}
                  style={styles.chartStyle}
                  yAxisLabel=""
                  yAxisSuffix=" cal"
                  fromZero
                  showBarTops={false}
                  withInnerLines={false}
                />
              </>
            )}
          </View>

          {/* Stats Summary */}
          <View style={styles.statsSummary}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {trackingContext?.todayLines.length || 0}
              </Text>
              <Text style={styles.statLabel}>Today's Items</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {trackingContext?.thisWeekLines.length || 0}
              </Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {trackingContext?.thisMonthLines.length || 0}
              </Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}
