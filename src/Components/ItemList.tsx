import { Image, Pressable, Text, View } from 'react-native';
import { styles } from '../Utils/Styles';
import { useState } from 'react';
import CustomModal from './CustomModal';

export default function ItemList() {
  const [isActive, setIsactive] = useState(false);
  return (
    <>
      <Pressable
        onPress={() => {
          setIsactive(true);
        }}
      >
        <View
          style={{
            backgroundColor: '#303030ff',
            padding: 10,
            borderRadius: 5,
            borderColor: '#696969ff',
            borderWidth: 2,
            display: 'flex',
            flexDirection: 'row',
            gap: 5,
            height: 130,
          }}
        >
          <Image
            source={{ uri: 'https://picsum.photos/200/300' }}
            style={{ borderRadius: 5, width: 130 }}
          />
          <View>
            <View>
              <Text style={styles.textxl}>Chicken</Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: 100,
                }}
              >
                <Text style={styles.textl}>Kcal:</Text>
                <Text style={styles.textl}>999</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: 100,
                }}
              >
                <Text style={styles.textl}>Protein:</Text>
                <Text style={styles.textl}>999</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: 100,
                }}
              >
                <Text style={styles.textl}>Carbs:</Text>
                <Text style={styles.textl}>999</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: 100,
                }}
              >
                <Text style={styles.textl}>Fats:</Text>
                <Text style={styles.textl}>999</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
      {isActive && (
        <CustomModal
          open={isActive}
          onClose={() => {
            setIsactive(false);
          }}
        />
      )}
    </>
  );
}
