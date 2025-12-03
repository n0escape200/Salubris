import { Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from '../Utils/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Input from '../Components/Input';
import Dropdown from '../Components/Dropdown';
import ItemList from '../Components/ItemList';
import { useContext, useState } from 'react';
import { TrackingContext } from '../Utils/Contexts/TrackingContext';
import CustomButton from '../Components/CustomButton';
import ImportProduct from '../Components/ImportProduct';

export default function Products() {
  const trackingContext = useContext(TrackingContext);
  const [openImport, setOpenImport] = useState(false);
  return (
    <View style={styles.page}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 20,
          alignItems: 'center',
        }}
      >
        <Text style={styles.textxl}>Products:</Text>
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: '#3a3a3aff',
            padding: 3,
            borderRadius: 50,
          }}
        >
          <FontAwesomeIcon size={20} color="#ffffffff" icon={faPlus} />
        </Pressable>
        <CustomButton
          label="Import product"
          fontSize={15}
          width={150}
          onPress={() => {
            setOpenImport(true);
          }}
        />
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
      <ImportProduct
        open={openImport}
        onClose={() => {
          setOpenImport(false);
        }}
      />
    </View>
  );
}
