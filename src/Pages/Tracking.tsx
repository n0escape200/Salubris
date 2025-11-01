import { Pressable, Text, View } from 'react-native';
import { styles } from '../Utils/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';
import CustomModal from '../Components/CustomModal';
import Autocomplete from '../Components/Autocomplete';

export default function Tracking() {
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const autocompleteRef = useRef<any>(null);

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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.textl}>Calories:</Text>
            <Text style={styles.textl}>Protein:</Text>
            <Text style={styles.textl}>Carbohydrates:</Text>
            <Text style={styles.textl}>Fat:</Text>
          </View>
          <View>
            <Text style={styles.textl}>999</Text>
            <Text style={styles.textl}>999</Text>
            <Text style={styles.textl}>999</Text>
            <Text style={styles.textl}>999</Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => setOpen(true)}
        style={{
          backgroundColor: '#3a3a3aff',
          alignSelf: 'flex-start',
          padding: 3,
          borderRadius: 50,
        }}
      >
        <FontAwesomeIcon size={25} color="#ffffffff" icon={faPlus} />
      </Pressable>

      <CustomModal
        open={open}
        onClose={() => setOpen(false)}
        childRef={autocompleteRef}
        onPressOutside={() => setIsFocused(false)}
      >
        <Autocomplete
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          ref={autocompleteRef}
        />
      </CustomModal>
    </View>
  );
}
