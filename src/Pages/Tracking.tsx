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
import { useNotification } from '../Utils/NotificationContext';
import { Q } from '@nozbe/watermelondb';

export default function Tracking() {
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const autocompleteRef = useRef<any>(null);
  const [productForm, setProdcutForm] = useState<ProductType>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    track_line_id: undefined,
  });
  const { addNotification } = useNotification();
  const [products, setProducts] = useState<Array<Product>>();

  async function getProducts() {
    try {
      const allProducts = await database
        .get<Product>('products')
        .query()
        .fetch();
      setProducts(allProducts);
    } catch (error) {
      addNotification({
        type: 'ERROR',
        message: `${error}`,
      });
    }
  }

  async function createEntry() {
    try {
      const productsData = await database.get<Product>('products').query();
      const hasProdcut = productsData.find(product => product.name);
      if (hasProdcut) {
        addNotification({
          type: 'ERROR',
          message: `Produt ${Product.name} already exists`,
        });
        return;
      }
      await database
        .get<Product>('products')
        .query(Q.where('name', productForm.name));
      await database.write(async () => {
        await database.get<Product>('products').create(product => {
          product.name = productForm.name;
          product.calories = productForm.calories;
          product.protein = productForm.protein;
          product.carbs = productForm.carbs;
          product.fats = productForm.fats;
        });
      });
      addNotification({
        type: 'SUCCESS',
        message: `Prodcut ${productForm.name} added succesfully`,
      });
      setOpen(false);
    } catch (error) {
      addNotification({
        type: 'ERROR',
        message: `${error}`,
      });
    }
  }

  useEffect(() => {
    getProducts();
    console.log('test');
  }, []);

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

      <View style={styles.container}></View>

      <CustomModal
        title="Add product"
        open={open}
        childRef={autocompleteRef}
        onPressOutside={() => setIsFocused(false)}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Form
          onSubmit={(shouldSubmit: boolean) => {
            if (shouldSubmit) {
              createEntry();
            }
          }}
          onCancel={() => {
            setOpen(false);
          }}
        >
          <Autocomplete
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            ref={autocompleteRef}
            options={['test1', 'test2', 'test3', 'test4']}
          />
          <Input
            onChange={value => {
              setProdcutForm(prev => ({ ...prev, name: value }));
            }}
            label="Name"
            validate
          />
          <Input
            onChange={value => {
              setProdcutForm(prev => ({ ...prev, calories: +value }));
            }}
            label="Calories"
            validate
          />
          <Input
            onChange={value => {
              setProdcutForm(prev => ({ ...prev, protein: +value }));
            }}
            label="Protein"
            validate
          />
          <Input
            onChange={value => {
              setProdcutForm(prev => ({ ...prev, carbs: +value }));
            }}
            label="Carbs"
            validate
          />
          <Input
            onChange={value => {
              setProdcutForm(prev => ({ ...prev, fats: +value }));
            }}
            label="Fats"
            validate
          />
        </Form>
      </CustomModal>
    </View>
  );
}
