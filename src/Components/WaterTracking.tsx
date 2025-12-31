import { faDroplet, faGlassWater } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from '../Utils/Styles';
import Input from './Input';
import { useEffect, useState } from 'react';
import { useNotification } from '../Utils/Contexts/NotificationContext';
import { database } from '../DB/Database';
import AccountSettings from '../DB/Models/AccountSettings';
import { Q } from '@nozbe/watermelondb';
import WaterTracking from '../DB/Models/WaterTracking';

export default function WaterTrackingPage() {
  const { addNotification } = useNotification();
  const [cupSizes, setCupSizes] = useState({
    small: 0,
    medium: 0,
    large: 0,
  });
  const [totalAmmount, setTotalAmmount] = useState(0);
  const [shouldUpdate, setShouldUpdate] = useState(true);

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
        small: +smallWaterData[0].value || 0,
        medium: +mediumWaterData[0].value || 0,
        large: +largeWaterData[0].value || 0,
      });
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  async function addWater(ammount: number) {
    try {
      await database.write(async () => {
        await database.get<WaterTracking>('water_tracking').create(w => {
          w.ammount = ammount.toString();
          w.date = new Date().toString();
        });
      });
    } catch (error) {
      console.log(error);
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  useEffect(() => {
    getData();
  }, []);
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Text style={{ color: 'white', fontSize: 28 }}>
          Water consumed for today
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
          }}
        >
          <FontAwesomeIcon color="white" icon={faDroplet} size={40} />
          <Text
            style={{ color: 'white', fontSize: 40 }}
          >{`${totalAmmount}ml`}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Pressable
              style={{
                backgroundColor: 'rgba(112, 112, 112, 1)',
                padding: 15,
                borderRadius: 10,
              }}
              onPress={() => {
                addWater(cupSizes.small);
                setShouldUpdate(true);
              }}
            >
              <FontAwesomeIcon icon={faGlassWater} color="white" size={20} />
            </Pressable>
            <Text style={{ color: 'white', fontSize: 17 }}>
              {`${cupSizes.small} ml`}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Pressable
              style={{
                backgroundColor: 'rgba(112, 112, 112, 1)',
                padding: 13,
                borderRadius: 10,
              }}
              onPress={() => {
                addWater(cupSizes.medium);
                setShouldUpdate(true);
              }}
            >
              <FontAwesomeIcon icon={faGlassWater} color="white" size={25} />
            </Pressable>
            <Text style={{ color: 'white', fontSize: 17 }}>
              {`${cupSizes.medium} ml`}
            </Text>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Pressable
              style={{
                backgroundColor: 'rgba(112, 112, 112, 1)',
                padding: 10,
                borderRadius: 10,
              }}
              onPress={() => {
                addWater(cupSizes.large);
                setShouldUpdate(true);
              }}
            >
              <FontAwesomeIcon icon={faGlassWater} color="white" size={30} />
            </Pressable>
            <Text style={{ color: 'white', fontSize: 17 }}>
              {`${cupSizes.large} ml`}
            </Text>
          </View>
        </View>
        <Input
          label="Custom ammount"
          type="number"
          backgroundColor="#1c1c1c"
          onSubmit={e => {
            if (e.nativeEvent.text !== '') {
              addWater(+e.nativeEvent.text);
              setShouldUpdate(true);
              addNotification({
                type: 'SUCCESS',
                message: `Added ${e.nativeEvent.text}ml`,
              });
            }
          }}
        />
      </View>
      {/* <Text style={{ color: 'white', fontSize: 25 }}>Consumption history</Text>
      <ScrollView style={styles.container}>
        <Text style={{ color: 'white', fontSize: 18 }}>No data</Text>
      </ScrollView> */}
    </View>
  );
}
