import { Pressable, Text, View } from 'react-native';
import CustomModal from '../Components/CustomModal';
import Table from '../Components/Table';
import { database } from './Database';
import Product from './Models/Product';
import { useEffect, useState } from 'react';
import { useNotification } from '../Utils/Contexts/NotificationContext';
import { styles } from '../Utils/Styles';
import TrackLine from './Models/TrackLine';
type DBVIsualizeProps = {
  open: boolean;
  onClose: () => void;
};

export default function DBVIsualize(props: DBVIsualizeProps) {
  const { open, onClose } = props;
  const [products, setProducts] = useState<Product[]>([]);
  const { addNotification } = useNotification();
  const [tab, setTab] = useState('products');
  const [trackLines, setTrackLines] = useState<TrackLine[]>([]);

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
      let allTrackLines = await database
        .get<TrackLine>('track_lines')
        .query()
        .fetch();
      setTrackLines(allTrackLines);
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  useEffect(() => {
    getProducts();
    getTrackLines();
  }, []);
  return (
    <CustomModal title="Database" open={open} onClose={() => onClose()}>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
        <Pressable
          onPress={() => {
            setTab('products');
          }}
        >
          <Text
            style={[
              styles.textl,
              {
                backgroundColor: 'grey',
                padding: 5,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              },
            ]}
          >
            Products
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setTab('trackline');
          }}
        >
          <Text
            style={[
              styles.textl,
              {
                backgroundColor: 'grey',
                padding: 5,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              },
            ]}
          >
            Trackline
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
        <Table header={['date', 'quantity', 'unit']} options={trackLines} />
      )}
    </CustomModal>
  );
}
