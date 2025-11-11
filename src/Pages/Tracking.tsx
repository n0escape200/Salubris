import { Pressable, Text, View } from 'react-native';
import { styles } from '../Utils/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import CustomModal from '../Components/CustomModal';
import Autocomplete from '../Components/Autocomplete';
import Input from '../Components/Input';
import Form from '../Components/Form';
import { database } from '../DB/Database';
import Product, { ProductType } from '../DB/Models/Product';
import TrackLine from '../DB/Models/TrackLine';
import { useNotification } from '../Utils/NotificationContext';
import { Q } from '@nozbe/watermelondb';

export default function Tracking() {
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const autocompleteRef = useRef<any>(null);
  const [productForm, setProductForm] = useState<ProductType>({
    id: undefined,
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    trackLineId: undefined,
  });
  const { addNotification } = useNotification();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts();
  }, []);

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

  async function createEntry() {}

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

      <View style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
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
        <View>
          <Text style={styles.textxl}>{new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      <CustomModal
        title="Add product"
        open={open}
        childRef={autocompleteRef}
        onPressOutside={() => setIsFocused(false)}
        onClose={() => setOpen(false)}
      >
        <Form
          onSubmit={(shouldSubmit: boolean) => {
            if (shouldSubmit) createEntry();
          }}
          onCancel={() => setOpen(false)}
        >
          <Autocomplete
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            ref={autocompleteRef}
            options={products}
            optionLabel="name"
            onChange={(value: ProductType) => setProductForm(value)}
          />
          <Input
            label="Name"
            value={productForm.name}
            validate
            onChange={value =>
              setProductForm(prev => ({ ...prev, name: value }))
            }
          />
          <Input
            label="Calories"
            value={`${productForm.calories}`}
            validate
            onChange={value =>
              setProductForm(prev => ({ ...prev, calories: +value }))
            }
          />
          <Input
            label="Protein"
            value={`${productForm.protein}`}
            validate
            onChange={value =>
              setProductForm(prev => ({ ...prev, protein: +value }))
            }
          />
          <Input
            label="Carbs"
            value={`${productForm.carbs}`}
            validate
            onChange={value =>
              setProductForm(prev => ({ ...prev, carbs: +value }))
            }
          />
          <Input
            label="Fats"
            value={`${productForm.fats}`}
            validate
            onChange={value =>
              setProductForm(prev => ({ ...prev, fats: +value }))
            }
          />
        </Form>
      </CustomModal>
    </View>
  );
}
