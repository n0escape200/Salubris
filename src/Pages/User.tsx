import { View, Text, ScrollView } from 'react-native';
import { styles } from '../Utils/Styles';
import CustomModal from '../Components/CustomModal';
import { useState, useEffect } from 'react';
import CustomButton from '../Components/CustomButton';
import { database } from '../DB/Database';
import Product from '../DB/Models/Product';
import DBVIsualize from '../DB/DBVisualize';

export default function User() {
  const [dbActive, setDbActive] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const collection = database.get<Product>('products');
    const subscription = collection.query().observe().subscribe(setProducts);

    return () => subscription.unsubscribe(); // clean up on unmount
  }, []);

  return (
    <View style={styles.page}>
      <CustomButton label="Show database" onPress={() => setDbActive(true)} />
      <DBVIsualize
        open={dbActive}
        onClose={() => {
          setDbActive(false);
        }}
      />
    </View>
  );
}
