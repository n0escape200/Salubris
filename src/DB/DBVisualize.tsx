import { Pressable, Text, View } from 'react-native';
import CustomModal from '../Components/CustomModal';
import Table from '../Components/Table';
import { database } from './Database';
import Product from './Models/Product';
import TrackLine from './Models/TrackLine';
import Meal from './Models/Meal';
import { useEffect, useState } from 'react';
import { useNotification } from '../Utils/Contexts/NotificationContext';
import { styles } from '../Utils/Styles';

type DBVisualizeProps = {
  open: boolean;
  onClose: () => void;
};

export default function DBVisualize(props: DBVisualizeProps) {
  const { open, onClose } = props;
  const [products, setProducts] = useState<Product[]>([]);
  const [trackLines, setTrackLines] = useState<TrackLine[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [tab, setTab] = useState('products');
  const { addNotification } = useNotification();

  async function getProducts() {
    try {
      const allProducts = await database
        .get<Product>('products')
        .query()
        .fetch();
      setProducts(allProducts);
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  async function getTrackLines() {
    try {
      const allTrackLines = await database
        .get<TrackLine>('track_lines')
        .query()
        .fetch();
      setTrackLines(allTrackLines);
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  async function getMeals() {
    try {
      const allMeals = await database.get<Meal>('meals').query().fetch();
      setMeals(allMeals);
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  useEffect(() => {
    getProducts();
    getTrackLines();
    getMeals();
  }, []);

  return (
    <CustomModal title="Database" open={open} onClose={onClose}>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
        <Pressable onPress={() => setTab('products')}>
          <Text
            style={[
              styles.textl,
              {
                backgroundColor: tab === 'products' ? '#555' : 'grey',
                padding: 5,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              },
            ]}
          >
            Products
          </Text>
        </Pressable>
        <Pressable onPress={() => setTab('trackline')}>
          <Text
            style={[
              styles.textl,
              {
                backgroundColor: tab === 'trackline' ? '#555' : 'grey',
                padding: 5,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              },
            ]}
          >
            Track Lines
          </Text>
        </Pressable>
        <Pressable onPress={() => setTab('meals')}>
          <Text
            style={[
              styles.textl,
              {
                backgroundColor: tab === 'meals' ? '#555' : 'grey',
                padding: 5,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              },
            ]}
          >
            Meals
          </Text>
        </Pressable>
      </View>

      {tab === 'products' && (
        <Table
          header={['name', 'calories', 'protein', 'carbs', 'fats']}
          options={products}
        />
      )}

      {tab === 'trackline' && (
        <Table
          header={[
            'name',
            'date',
            'quantity',
            'unit',
            'calories',
            'protein',
            'carbs',
            'fats',
          ]}
          options={trackLines}
        />
      )}

      {tab === 'meals' && (
        <Table
          header={['name', 'products']}
          options={meals.map(meal => ({
            ...meal,
            // Format products array for display
            products: meal.products
              ? JSON.stringify(meal.products.map(p => `${p.id}:${p.quantity}g`))
              : '[]',
          }))}
        />
      )}
    </CustomModal>
  );
}
