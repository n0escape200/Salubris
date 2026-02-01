import {
  faDroplet,
  faGlassWater,
  faPlus,
  faHistory,
  faTint,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Pressable, ScrollView, Text, View, Animated } from 'react-native';
import { styles } from '../Utils/Styles';
import Input from './Input';
import { useEffect, useState, useRef } from 'react';
import { useNotification } from '../Utils/Contexts/NotificationContext';
import { database } from '../DB/Database';
import AccountSettings from '../DB/Models/AccountSettings';
import { Q } from '@nozbe/watermelondb';
import WaterTracking from '../DB/Models/WaterTracking';

type WaterLog = {
  ammount: string;
  date: string;
  id?: string;
};

export default function WaterTrackingPage() {
  const { addNotification } = useNotification();
  const [cupSizes, setCupSizes] = useState({
    small: 0,
    medium: 0,
    large: 0,
  });
  const [totalAmmount, setTotalAmmount] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [shouldUpdate, setShouldUpdate] = useState(true);
  const [recentLogs, setRecentLogs] = useState<WaterLog[]>([]);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const percentage = Math.min((totalAmmount / dailyGoal) * 100, 100);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percentage,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  async function getWaterForToday() {
    try {
      const data = await database
        .get<WaterTracking>('water_tracking')
        .query()
        .fetch();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaysRecords = data.filter(record => {
        const recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === today.getTime();
      });

      const logs: WaterLog[] = todaysRecords.map(record => ({
        ammount: record.ammount,
        date: record.date,
        id: record.id,
      }));

      setRecentLogs(logs.slice(-5).reverse());

      const total = todaysRecords.reduce((sum, record) => {
        const value = Number(record.ammount);
        return sum + (isNaN(value) ? 0 : value);
      }, 0);

      setTotalAmmount(total);
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  useEffect(() => {
    if (shouldUpdate) {
      getWaterForToday();
      setShouldUpdate(false);
    }
  }, [shouldUpdate]);

  async function getData() {
    try {
      const smallWaterData = await database
        .get<AccountSettings>('account_settings')
        .query(Q.where('field', 'smallWater'))
        .fetch();
      const mediumWaterData = await database
        .get<AccountSettings>('account_settings')
        .query(Q.where('field', 'mediumWater'))
        .fetch();
      const largeWaterData = await database
        .get<AccountSettings>('account_settings')
        .query(Q.where('field', 'largeWater'))
        .fetch();
      setCupSizes({
        small: +smallWaterData[0]?.value || 0,
        medium: +mediumWaterData[0]?.value || 0,
        large: +largeWaterData[0]?.value || 0,
      });
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  async function addWater(ammount: number, cupSize?: string) {
    try {
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      await database.write(async () => {
        await database.get<WaterTracking>('water_tracking').create(w => {
          w.ammount = ammount.toString();
          w.date = new Date().toISOString();
        });
      });

      setShouldUpdate(true);

      const message = cupSize
        ? `Added ${ammount}ml (${cupSize} cup)`
        : `Added ${ammount}ml`;

      addNotification({
        type: 'SUCCESS',
        message,
      });
    } catch (error) {
      console.log(error);
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const getProgressColor = () => {
    if (percentage < 50) return '#2196F3'; // Blue from style file
    if (percentage < 85) return '#4CAF50'; // Green from style file
    return '#FF9800'; // Orange from style file
  };

  return (
    <ScrollView style={styles.page}>
      <View style={[styles.homeContainer, { paddingTop: 0 }]}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.mealsHeader}>
            <View>
              <Text style={styles.mealsTitle}>Water Tracker</Text>
              <Text style={styles.mealsSubtitle}>
                Stay hydrated throughout the day
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Card */}
        <View
          style={[
            styles.container,
            { borderLeftWidth: 4, borderLeftColor: '#2196F3' },
          ]}
        >
          <View style={styles.statsHeader}>
            <FontAwesomeIcon icon={faTint} color="#2196F3" size={20} />
            <Text style={styles.sectionTitle}>Today's Progress</Text>
          </View>

          <View style={styles.statsContent}>
            <Text style={styles.caloriesValue}>{totalAmmount}</Text>
            <Text style={styles.caloriesUnit}>ml</Text>
          </View>

          <View style={{ marginBottom: 16 }}>
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
              <Text style={styles.macroLabel}>0ml</Text>
              <Text style={[styles.macroValue, { color: getProgressColor() }]}>
                {Math.round(percentage)}%
              </Text>
              <Text style={styles.macroLabel}>{dailyGoal}ml</Text>
            </View>
          </View>

          <View style={styles.statsFooter}>
            <Text style={styles.statsSubtitle}>Goal: {dailyGoal}ml</Text>
          </View>
        </View>

        {/* Quick Add Section */}
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 20,
            }}
          >
            {Object.entries(cupSizes).map(([size, amount]) => (
              <View key={size} style={{ alignItems: 'center' }}>
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <Pressable
                    style={({ pressed }) => [
                      {
                        backgroundColor: pressed ? '#333' : '#2a2a2a',
                        padding: 20,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 2,
                        borderColor: '#2196F3',
                        marginBottom: 8,
                      },
                    ]}
                    onPress={() => addWater(amount, size)}
                  >
                    <FontAwesomeIcon
                      icon={faGlassWater}
                      color="#2196F3"
                      size={size === 'small' ? 20 : size === 'medium' ? 24 : 28}
                    />
                  </Pressable>
                </Animated.View>
                <Text style={styles.macroLabel}>
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </Text>
                <Text style={styles.texts}>{amount}ml</Text>
              </View>
            ))}
          </View>

          {/* Custom Amount Input */}
          <Text style={styles.sectionTitle}>Custom Amount</Text>
          <Input
            label="Enter amount in ml"
            backgroundColor="#2a2a2a"
            placeholder="e.g., 250"
            onSubmit={e => {
              if (e.nativeEvent.text && !isNaN(+e.nativeEvent.text)) {
                addWater(+e.nativeEvent.text);
              }
            }}
            style={{
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#3a3a3a',
            }}
          />
        </View>

        {/* History Section */}
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Recent Logs</Text>

          {recentLogs.length > 0 ? (
            <ScrollView style={{ maxHeight: 200 }}>
              {recentLogs.map((log, index) => (
                <View
                  key={log.id || index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    borderBottomWidth: index < recentLogs.length - 1 ? 1 : 0,
                    borderBottomColor: '#3a3a3a',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: '#2a2a2a',
                      padding: 8,
                      borderRadius: 10,
                      marginRight: 12,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faDroplet}
                      color="#2196F3"
                      size={14}
                    />
                  </View>
                  <Text style={[styles.textl, { flex: 1 }]}>
                    {log.ammount}ml
                  </Text>
                  <Text style={styles.texts}>
                    {new Date(log.date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
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
              <Text style={styles.emptyStateTitle}>No logs yet</Text>
              <Text style={styles.emptyStateText}>
                Start by adding some water using the buttons above!
              </Text>
            </View>
          )}
        </View>

        {/* Stats Summary */}
        <View style={[styles.container, { marginBottom: 80 }]}>
          <Text style={styles.sectionTitle}>Today's Stats</Text>
          <View style={styles.statsSummary}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalAmmount}</Text>
              <Text style={styles.statLabel}>Total ml</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: getProgressColor() }]}>
                {Math.round(percentage)}%
              </Text>
              <Text style={styles.statLabel}>Goal Progress</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{recentLogs.length}</Text>
              <Text style={styles.statLabel}>Logs Today</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
