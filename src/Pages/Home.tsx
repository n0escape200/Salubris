import React, { useContext, useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { styles } from '../Utils/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { LineChart } from 'react-native-chart-kit';
import { TrackingContext } from '../Utils/Contexts/TrackingContext';
import { useNotification } from '../Utils/Contexts/NotificationContext';
import { database } from '../DB/Database';
import { Q } from '@nozbe/watermelondb';
import Product from '../DB/Models/Product';

export default function Home() {
  const { addNotification } = useNotification();
  const [chartWidth, setChartWidth] = useState(0);
  const [todayCalories, setTodayCalories] = useState(0);
  const [weeklyCalories, setWeeklyCalories] = useState<number[]>(
    new Array(7).fill(0),
  );
  const [monthlyCalories, setMonthlyCalories] = useState<number[]>(
    new Array(12).fill(0),
  );
  const trackingContext = useContext(TrackingContext);

  // Get calories of any track lines
  const getCaloriesFromLines = async (lines: any[]) => {
    return Promise.all(
      lines.map(async line => {
        console.log('line', line.product_id.id);
        const product = await database
          .get<Product>('products')
          .find(line.product_id.id)
          .catch(() => null);

        if (!product) return 0;

        const factor =
          (line.unit !== 'g' ? line.quantity * 1000 : line.quantity) / 100;

        return product.calories * factor;
      }),
    );
  };

  const calculateCaloriesToday = async () => {
    if (!trackingContext) return;
    const calories = await getCaloriesFromLines(trackingContext.todayLines);
    setTodayCalories(calories.reduce((sum, val) => sum + val, 0));
  };

  const calculateWeeklyCalories = async () => {
    if (!trackingContext) return;
    const calories = await getCaloriesFromLines(trackingContext.thisWeekLines);
    const arr = new Array(7).fill(0);

    trackingContext.thisWeekLines.forEach((line, i) => {
      const d = new Date(line.date);
      const index = (d.getDay() + 6) % 7; // Mon=0 ... Sun=6
      arr[index] += calories[i];
    });

    setWeeklyCalories(arr);
  };

  // Monthly calories chart
  const calculateMonthlyCalories = async () => {
    if (!trackingContext) return;
    const calories = await getCaloriesFromLines(trackingContext.thisMonthLines);
    const arr = new Array(12).fill(0);

    trackingContext.thisMonthLines.forEach((line, i) => {
      const d = new Date(line.date);
      arr[d.getMonth()] += calories[i];
    });

    setMonthlyCalories(arr);
  };

  // Recalculate when DB/lines update
  useEffect(() => {
    if (!trackingContext) return;
    calculateCaloriesToday();
    calculateWeeklyCalories();
    calculateMonthlyCalories();
  }, [
    trackingContext?.todayLines,
    trackingContext?.thisWeekLines,
    trackingContext?.thisMonthLines,
  ]);

  useEffect(() => {
    console.log(trackingContext);
  }, []);

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={{ gap: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesomeIcon icon={faUser} color="white" size={30} />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ color: 'white', fontSize: 21 }}>Welcome back</Text>
            <Text style={{ color: 'white', fontSize: 17 }}>user</Text>
          </View>
        </View>

        <View style={styles.container}>
          <Text style={styles.textxl}>Calories consumed for the day 🔥</Text>
          <Text style={styles.textxl}>{Math.round(todayCalories)}</Text>
        </View>

        {/* WEEKLY CHART */}
        <View style={styles.container}>
          <Text style={styles.textxl}>Progress for the week:</Text>

          <View
            style={{ width: '100%' }}
            onLayout={event => setChartWidth(event.nativeEvent.layout.width)}
          >
            <LineChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{ data: weeklyCalories }],
              }}
              width={chartWidth}
              height={300}
              chartConfig={{
                backgroundColor: '#1c1c1c',
                color: opacity => `rgba(255,255,255,${opacity})`,
                labelColor: opacity => `rgba(255,255,255,${opacity})`,
                propsForDots: { r: '3', strokeWidth: '2', stroke: '#ffffff' },
              }}
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>
        </View>

        {/* MONTHLY CHART */}
        <View style={styles.container}>
          <Text style={styles.textxl}>Progress per month:</Text>
          <LineChart
            data={{
              labels: [
                'J',
                'F',
                'M',
                'A',
                'M',
                'J',
                'Jl',
                'A',
                'S',
                'O',
                'N',
                'D',
              ],
              datasets: [{ data: monthlyCalories }],
            }}
            width={chartWidth}
            height={300}
            chartConfig={{
              backgroundColor: '#1c1c1c',
              color: opacity => `rgba(255,255,255,${opacity})`,
              labelColor: opacity => `rgba(255,255,255,${opacity})`,
              propsForDots: { r: '3', strokeWidth: '2', stroke: '#ffffff' },
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
