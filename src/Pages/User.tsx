import { View, Text, ScrollView } from 'react-native';
import { styles } from '../Utils/Styles';
import CustomModal from '../Components/CustomModal';
import { useState, useEffect } from 'react';
import CustomButton from '../Components/CustomButton';
import { database } from '../DB/Database';
import Product from '../DB/Models/Product';

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

      <CustomModal
        title="Database"
        open={dbActive}
        onClose={() => setDbActive(false)}
      >
        <ScrollView
          style={{
            maxHeight: 400,
            marginTop: 10,
            backgroundColor: '#2c2c2c',
            borderRadius: 10,
            padding: 10,
          }}
        >
          {products.length === 0 ? (
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                padding: 20,
              }}
            >
              No products found in the database.
            </Text>
          ) : (
            products.map(product => (
              <View
                key={product.id}
                style={{
                  borderBottomColor: '#444',
                  borderBottomWidth: 1,
                  paddingVertical: 8,
                }}
              >
                <Text style={[styles.textl, { color: 'white' }]}>
                  {product.name}
                </Text>
                <Text style={{ color: '#ccc' }}>
                  🥗 {product.calories} cal | 🥩 {product.protein}g protein | 🍞{' '}
                  {product.carbs}g carbs | 🧈 {product.fats}g fats
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </CustomModal>
    </View>
  );
}
