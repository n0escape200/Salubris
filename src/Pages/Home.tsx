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
  const [debugInfo, setDebugInfo] = useState<string>('');

  const trackingContext = useContext(TrackingContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width - 90;

  // Helper function to normalize date string (YYYY-MM-DD)
  const normalizeDateString = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        // Try to parse different formats
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          return dateStr; // Already in YYYY-MM-DD format
        }
        return '';
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error normalizing date:', dateStr, error);
      return '';
    }
  };

  // Calculate total calories from a track line array
  const calculateCalories = (lines: any[]) => {
    if (!lines || lines.length === 0) return 0;

    let total = 0;
    lines.forEach(line => {
      if (line && line.calories && line.quantity) {
        let factor = 0;
        if (line.unit === 'g') {
          factor = line.quantity / 100;
        } else if (line.unit === 'ml') {
          factor = line.quantity / 100;
        } else {
          factor = line.quantity;
        }

        const calories = line.calories * factor;
        if (!isNaN(calories)) {
          total += calories;
        }
      }
    });

    return total;
  };

  // Calculate daily calories from weekly lines
  // In Home component, update calculateWeeklyByDay function:
  const calculateWeeklyByDay = (lines: any[]) => {
    const dailyTotals = new Array(7).fill(0);

    if (!lines || lines.length === 0) return dailyTotals;

    // Get the current week's dates (Monday to Sunday)
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);

    const monday = new Date(today);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);

    // Create date objects for each day of the week
    const weekDates: string[] = [];
    const weekDateObjects: Date[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      date.setHours(0, 0, 0, 0);
      weekDateObjects.push(date);
      weekDates.push(normalizeDateString(date.toISOString()));
    }

    // Group lines by day
    lines.forEach((line, index) => {
      if (!line || !line.date || !line.calories || !line.quantity) return;

      const normalizedLineDate = normalizeDateString(line.date);
      if (!normalizedLineDate) return;

      // Find which day of the week this belongs to
      const dayIndex = weekDates.findIndex(date => date === normalizedLineDate);

      if (dayIndex !== -1) {
        let factor = 0;
        if (line.unit === 'g') {
          factor = line.quantity / 100;
        } else if (line.unit === 'ml') {
          factor = line.quantity / 100;
        } else {
          factor = line.quantity;
        }

        const calories = line.calories * factor;
        if (!isNaN(calories)) {
          dailyTotals[dayIndex] += calories;
        }
      }
    });

    return dailyTotals;
  };

  // Calculate monthly totals
  const calculateMonthlyByMonth = (lines: any[]) => {
    const monthlyTotals = new Array(12).fill(0);

    if (!lines || lines.length === 0) return monthlyTotals;

    lines.forEach((line, index) => {
      if (!line || !line.date || !line.calories || !line.quantity) {
        return;
      }

      try {
        const lineDate = new Date(line.date);
        if (isNaN(lineDate.getTime())) {
          return;
        }

        const monthIndex = lineDate.getMonth();

        let factor = 0;
        if (line.unit === 'g') {
          factor = line.quantity / 100;
        } else if (line.unit === 'ml') {
          factor = line.quantity / 100;
        } else {
          factor = line.quantity;
        }

        const calories = line.calories * factor;
        if (!isNaN(calories)) {
          monthlyTotals[monthIndex] += calories;
        }
      } catch (error) {
        console.error(`Error processing monthly line ${index}:`, error);
      }
    });

    return monthlyTotals;
  };

  useEffect(() => {
    if (!trackingContext) {
      setDebugInfo('Tracking context is null');
      return;
    }

    setDebugInfo(`
      Today lines: ${trackingContext.todayLines?.length || 0}
      Week lines: ${trackingContext.thisWeekLines?.length || 0}
      Month lines: ${trackingContext.thisMonthLines?.length || 0}
      Selected date: ${trackingContext.selectedDate || 'null'}
    `);

    // Log some sample data for debugging
    if (trackingContext.todayLines && trackingContext.todayLines.length > 0) {
    }
    if (
      trackingContext.thisWeekLines &&
      trackingContext.thisWeekLines.length > 0
    ) {
    }

    // Calculate today's calories
    const todayCal = calculateCalories(trackingContext.todayLines);
    setTodayCalories(todayCal);

    // Calculate weekly data
    const weeklyData = calculateWeeklyByDay(trackingContext.thisWeekLines);
    setWeeklyCalories(weeklyData);

    // Calculate weekly average (only for days with data)
    const daysWithData = weeklyData.filter(cal => cal > 0);
    const weeklyAvg =
      daysWithData.length > 0
        ? daysWithData.reduce((a, b) => a + b, 0) / daysWithData.length
        : 0;
    setWeeklyAverage(weeklyAvg);

    // Calculate monthly data
    const monthlyData = calculateMonthlyByMonth(trackingContext.thisMonthLines);
    setMonthlyCalories(monthlyData);

    // Calculate monthly average (only for months with data)
    const monthsWithData = monthlyData.filter(cal => cal > 0);
    const monthlyAvg =
      monthsWithData.length > 0
        ? monthsWithData.reduce((a, b) => a + b, 0) / monthsWithData.length
        : 0;
    setMonthlyAverage(monthlyAvg);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [trackingContext]);

  // Get day labels for current week (Monday to Sunday)
  const getDayLabels = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days;
  };

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
            <View>
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

                {weeklyCalories.some(cal => cal > 0) ? (
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
                    yAxisSuffix=" cal"
                  />
                ) : (
                  <View
                    style={{
                      height: 220,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#aaa', fontSize: 14 }}>
                      No data for this week yet
                    </Text>
                    <Text style={{ color: '#888', fontSize: 12, marginTop: 8 }}>
                      Add some meals to see your weekly progress!
                    </Text>
                  </View>
                )}
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

                {getFilteredMonthlyData().some(cal => cal > 0) ? (
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
                ) : (
                  <View
                    style={{
                      height: 220,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#aaa', fontSize: 14 }}>
                      No data for last 6 months yet
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>

          {/* Stats Summary */}
          <View style={styles.statsSummary}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {trackingContext?.todayLines?.length || 0}
              </Text>
              <Text style={styles.statLabel}>Today's Items</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {trackingContext?.thisWeekLines?.length || 0}
              </Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {trackingContext?.thisMonthLines?.length || 0}
              </Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}
