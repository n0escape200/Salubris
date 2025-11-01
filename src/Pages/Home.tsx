import React, { useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { styles } from '../Utils/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { LineChart } from 'react-native-chart-kit';

export default function Home() {
  const [chartWidth, setChartWidth] = useState(0);

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
          <Text style={styles.textxl}>9999</Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.textxl}>Progress for the week:</Text>

          <View
            style={{ width: '100%' }}
            onLayout={event => {
              const { width } = event.nativeEvent.layout;
              setChartWidth(width);
            }}
          >
            <LineChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                  {
                    data: Array.from({ length: 6 }, () => Math.random() * 100),
                  },
                ],
              }}
              width={chartWidth}
              height={300}
              chartConfig={{
                backgroundColor: '#1c1c1c',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                propsForDots: {
                  r: '2',
                  strokeWidth: '2',
                  stroke: '#ffffffff',
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        </View>

        <View style={styles.container}>
          <Text style={styles.textxl}>Progress per month:</Text>
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [
                {
                  data: Array.from({ length: 6 }, () => Math.random() * 100),
                },
              ],
            }}
            width={chartWidth}
            height={300}
            chartConfig={{
              backgroundColor: '#1c1c1c',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: {
                r: '2',
                strokeWidth: '2',
                stroke: '#ffffffff',
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
