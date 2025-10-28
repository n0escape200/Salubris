import { Modal, Pressable, Text, View } from 'react-native';
import { styles } from '../Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import CustomModal from '../Components/CustomModal';

export default function Calories() {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.page}>
      <Text style={styles.textxl}>Calories consumed today</Text>
      <View style={styles.container}>
        <Text
          style={{
            color: 'white',
            fontSize: 17,
            margin: 'auto',
            marginBottom: 10,
          }}
        >
          Intake for Monday
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ display: 'flex', flexDirection: 'column' }}>
            <Text style={styles.textl}>Calories:</Text>
            <Text style={styles.textl}>Protein:</Text>
            <Text style={styles.textl}>Carbohydrates:</Text>
            <Text style={styles.textl}>Fat:</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'column' }}>
            <Text style={styles.textl}>999</Text>
            <Text style={styles.textl}>999</Text>
            <Text style={styles.textl}>999</Text>
            <Text style={styles.textl}>999</Text>
          </View>
        </View>
      </View>
      <Pressable
        onPress={() => {
          setOpen(true);
        }}
      >
        <FontAwesomeIcon
          style={{
            backgroundColor: '#3d3d3dff',
            borderRadius: 5,
          }}
          size={25}
          color="#ffffffff"
          icon={faPlus}
        />
      </Pressable>
      <View style={styles.container}></View>
      <CustomModal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      />
    </View>
  );
}
