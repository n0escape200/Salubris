import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, Animated, Pressable, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faWalking,
  faShoePrints,
  faFire,
  faChartLine,
  faHistory,
  faCalendarAlt,
  faTrophy,
  faBullseye,
  faRepeat,
  faPersonWalking,
} from '@fortawesome/free-solid-svg-icons';
import { StepCounterContext } from '../Utils/Contexts/StepCounterContext';
import { styles } from '../Utils/Styles';

export default function StepTrackingPage() {
  const { steps } = useContext(StepCounterContext);
  const [dailyGoal] = useState(10000); // Default step goal
  const [todayDate] = useState(
    new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  );
  const [recentDays, setRecentDays] = useState([
    { date: 'Today', steps: 0, calories: 0 },
    { date: 'Yesterday', steps: 8456, calories: 423 },
    { date: '2 days ago', steps: 10567, calories: 528 },
    { date: '3 days ago', steps: 7234, calories: 362 },
    { date: '4 days ago', steps: 9321, calories: 466 },
  ]);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const achievementScale = useRef(new Animated.Value(1)).current;

  const percentage = Math.min((steps / dailyGoal) * 100, 100);
  const caloriesBurned = Math.round(steps * 0.05); // Rough estimate: 0.05 calories per step
  const distance = (steps * 0.000762).toFixed(2); // Average step length of 0.762 meters = 0.000762 km
  const activeMinutes = Math.round(steps / 100); // Rough estimate

  // Calculate achievements
  const achievements = [
    { icon: faTrophy, label: 'Goal Streak', value: '3 days', color: '#FFD700' },
    { icon: faBullseye, label: 'Best Day', value: '12,345', color: '#4CAF50' },
    {
      icon: faChartLine,
      label: 'Weekly Avg',
      value: '8,912',
      color: '#2196F3',
    },
  ];

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Update today's steps in recent days
    setRecentDays(prev =>
      prev.map((day, index) =>
        index === 0 ? { ...day, steps, calories: caloriesBurned } : day,
      ),
    );
  }, [steps, percentage]);

  useEffect(() => {
    // Pulsing animation for step counter
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  const getProgressColor = () => {
    if (percentage < 50) return '#2196F3';
    if (percentage < 85) return '#FF9800';
    return '#4CAF50';
  };

  const formatSteps = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getMotivationalMessage = () => {
    if (percentage >= 100) return "🎉 You've reached your daily goal! Amazing!";
    if (percentage >= 75) return '🔥 Almost there! Keep pushing!';
    if (percentage >= 50) return "💪 Halfway there! You're doing great!";
    if (percentage >= 25) return '🚶‍♂️ Good start! Keep moving!';
    return "👟 Let's get those steps in!";
  };

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.homeContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.mealsHeader}>
            <View>
              <Text style={styles.mealsTitle}>Step Tracker</Text>
              <Text style={styles.mealsSubtitle}>{todayDate}</Text>
            </View>
          </View>
        </View>

        {/* Main Step Counter Card */}
        <View
          style={[
            styles.container,
            {
              borderLeftWidth: 4,
              borderLeftColor: '#4CAF50',
              marginVertical: 20,
            },
          ]}
        >
          <View style={styles.statsHeader}>
            <FontAwesomeIcon icon={faWalking} color="#4CAF50" size={24} />
            <Text style={styles.sectionTitle}>Today's Steps</Text>
          </View>

          <View style={[styles.statsContent, { marginBottom: 20 }]}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Text
                style={[styles.caloriesValue, { color: getProgressColor() }]}
              >
                {formatSteps(steps)}
              </Text>
            </Animated.View>
            <Text style={styles.caloriesUnit}>steps</Text>
          </View>

          {/* Progress Section */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={[
                styles.textl,
                { textAlign: 'center', marginBottom: 12, color: '#aaa' },
              ]}
            >
              {getMotivationalMessage()}
            </Text>

            {/* Progress Bar */}
            <View
              style={{
                height: 12,
                backgroundColor: '#2a2a2a',
                borderRadius: 6,
                overflow: 'hidden',
                marginBottom: 8,
              }}
            >
              <Animated.View
                style={{
                  height: '100%',
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: getProgressColor(),
                  borderRadius: 6,
                }}
              />
            </View>
            <View style={styles.macrosGrid}>
              <Text style={styles.macroLabel}>0</Text>
              <Text style={[styles.macroValue, { color: getProgressColor() }]}>
                {Math.round(percentage)}%
              </Text>
              <Text style={styles.macroLabel}>{formatSteps(dailyGoal)}</Text>
            </View>
          </View>

          <View style={styles.statsFooter}>
            <Text style={styles.statsSubtitle}>
              Daily Goal: {formatSteps(dailyGoal)} steps
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={[styles.container, { marginBottom: 20 }]}>
          <Text style={styles.sectionTitle}>Activity Summary</Text>
          <View style={styles.statsSummary}>
            <View style={styles.statItem}>
              <FontAwesomeIcon
                icon={faFire}
                color="#FF5722"
                size={20}
                style={{ marginBottom: 8 }}
              />
              <Text style={styles.statValue}>{caloriesBurned}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <FontAwesomeIcon
                icon={faPersonWalking}
                color="#2196F3"
                size={20}
                style={{ marginBottom: 8 }}
              />
              <Text style={styles.statValue}>{distance}</Text>
              <Text style={styles.statLabel}>km</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <FontAwesomeIcon
                icon={faChartLine}
                color="#4CAF50"
                size={20}
                style={{ marginBottom: 8 }}
              />
              <Text style={styles.statValue}>{activeMinutes}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
          </View>
        </View>

        {/* Achievements Section */}
        <View style={[styles.container, { marginBottom: 20 }]}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.statsSummary}>
            {achievements.map((achievement, index) => (
              <React.Fragment key={achievement.label}>
                <View style={styles.statItem}>
                  <FontAwesomeIcon
                    icon={achievement.icon}
                    color={achievement.color}
                    size={20}
                    style={{ marginBottom: 8 }}
                  />
                  <Text style={styles.statValue}>{achievement.value}</Text>
                  <Text style={styles.statLabel}>{achievement.label}</Text>
                </View>
                {index < achievements.length - 1 && (
                  <View style={styles.statDivider} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* History Section */}
        <View style={styles.container}>
          <View style={styles.mealsHeader}>
            <Text style={styles.sectionTitle}>Step History</Text>
            <Pressable style={styles.closeButton}>
              <FontAwesomeIcon icon={faCalendarAlt} color="#aaa" size={16} />
              <Text style={[styles.tabButtonText, { marginLeft: 8 }]}>
                Last 7 Days
              </Text>
            </Pressable>
          </View>

          {recentDays.length > 0 ? (
            <ScrollView style={{ maxHeight: 300 }}>
              {recentDays.map((day, index) => (
                <View
                  key={day.date}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 16,
                    borderBottomWidth: index < recentDays.length - 1 ? 1 : 0,
                    borderBottomColor: '#3a3a3a',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: '#2a2a2a',
                      padding: 10,
                      borderRadius: 10,
                      marginRight: 16,
                      width: 40,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faShoePrints}
                      color={day.date === 'Today' ? getProgressColor() : '#aaa'}
                      size={16}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.textl,
                        { color: day.date === 'Today' ? 'white' : '#aaa' },
                      ]}
                    >
                      {day.date}
                    </Text>
                    <Text style={styles.texts}>
                      {day.steps.toLocaleString()} steps • {day.calories}{' '}
                      calories
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#2a2a2a',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 20,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={[
                        styles.texts,
                        {
                          color:
                            day.steps >= dailyGoal
                              ? '#4CAF50'
                              : day.steps >= dailyGoal * 0.7
                              ? '#FF9800'
                              : '#aaa',
                        },
                      ]}
                    >
                      {Math.round((day.steps / dailyGoal) * 100)}%
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyStateContainer}>
              <View
                style={{
                  backgroundColor: '#2a2a2a',
                  padding: 20,
                  borderRadius: 50,
                  marginBottom: 16,
                }}
              >
                <FontAwesomeIcon icon={faHistory} color="#aaa" size={32} />
              </View>
              <Text style={styles.emptyStateTitle}>No history yet</Text>
              <Text style={styles.emptyStateText}>
                Start walking to see your step history here!
              </Text>
            </View>
          )}
        </View>

        {/* Tips Section */}
        <View style={[styles.container, { marginBottom: 80 }]}>
          <Text style={styles.sectionTitle}>Tips to Increase Steps</Text>
          <View style={{ gap: 12 }}>
            {[
              'Take a short walk during breaks',
              'Use stairs instead of elevator',
              'Park farther from entrances',
              'Walk while on phone calls',
              'Set hourly movement reminders',
            ].map((tip, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#2a2a2a',
                  padding: 16,
                  borderRadius: 10,
                  gap: 12,
                }}
              >
                <FontAwesomeIcon icon={faRepeat} color="#4CAF50" size={16} />
                <Text style={[styles.textl, { flex: 1 }]}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
