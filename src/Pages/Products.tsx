import { Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from '../Utils/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Input from '../Components/Input';
import Dropdown from '../Components/Dropdown';
import ItemList from '../Components/ItemList';
import { useContext } from 'react';
import { TrackingContext } from '../Utils/Contexts/TrackingContext';

export default function Products() {
  const trackingContext = useContext(TrackingContext);
  return (
    <View style={styles.page}>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
        <Text style={styles.textxl}>Products:</Text>
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: '#3a3a3aff',
            alignSelf: 'flex-start',
            padding: 3,
            borderRadius: 50,
          }}
        >
          <FontAwesomeIcon size={20} color="#ffffffff" icon={faPlus} />
        </Pressable>
      </View>
      <View style={styles.container}>
        <Input label="Search" />
        <Dropdown options={['test1', 'test2', 'test3', 'test4']} />
      </View>
      <ScrollView
        style={[styles.container, { position: 'relative', padding: 10 }]}
      >
        <View style={{ gap: 10 }}>
          {trackingContext?.products.map((product, index) => {
            return <ItemList key={index} product={product} />;
          })}
        </View>
      </ScrollView>
    </View>
  );
}
