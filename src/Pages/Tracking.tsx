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
import { mapState } from '../Utils/Functions';
import TrackLine, { TrackLineType } from '../DB/Models/TrackLine';

export default function Tracking() {
  const [open, setOpen] = useState(false);
  const [isFocusedProducts, setIsFocusedProducts] = useState(false);
  const [isFocusedMass, setIsFocusedMass] = useState(false);
  const autocompleteRef = useRef<any>(null);
  const [productForm, setProductForm] = useState<ProductType>({
    id: undefined,
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [quantity, setQuantity] = useState({
    value: '',
    unit: '',
  });
  const { addNotification } = useNotification();
  const [products, setProducts] = useState<Product[]>([]);
  const [trackLines, setTrackLines] = useState<TrackLineType[]>([]);

  useEffect(() => {
    getProducts();
    getTrackLines();
  }, []);

  useEffect(() => {
    console.log(trackLines);
  }, [trackLines]);

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
  async function createEntry() {
    try {
      await database.write(async () => {
        let product;

        if (productForm.id) {
          product = await database
            .get<Product>('products')
            .find(productForm.id);
        } else {
          product = await database.get<Product>('products').create(product => {
            product.name = productForm.name;
            product.calories = productForm.calories;
            product.protein = productForm.protein;
            product.carbs = productForm.carbs;
            product.fats = productForm.fats;
          });
          addNotification({
            type: 'SUCCESS',
            message: `${product.name} created successfully`,
          });
        }

        await database.get<TrackLine>('track_lines').create(trackLine => {
          trackLine.date = new Date().toString();
          trackLine.quantity = +quantity.value;
          trackLine.unit = quantity.unit;
          trackLine.product_id.set(product);
        });
        addNotification({
          type: 'SUCCESS',
          message: `Track line was added successfully`,
        });
      });

      setOpen(false);
    } catch (error) {
      console.log(error);
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

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
        onPressOutside={() => {
          setIsFocusedProducts(false);
          setIsFocusedMass(false);
        }}
        onClose={() => setOpen(false)}
      >
        <Form
          onSubmit={async () => {
            await createEntry();
          }}
          onCancel={() => setOpen(false)}
        >
          <Autocomplete
            placeholder="Products"
            isFocused={isFocusedProducts}
            setIsFocused={setIsFocusedProducts}
            ref={autocompleteRef}
            options={products}
            optionLabel="name"
            onChange={(value: ProductType) =>
              mapState(value, productForm, setProductForm)
            }
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
            type="number"
          />
          <Input
            label="Protein"
            value={`${productForm.protein}`}
            validate
            onChange={value =>
              setProductForm(prev => ({ ...prev, protein: +value }))
            }
            type="number"
          />
          <Input
            label="Carbs"
            value={`${productForm.carbs}`}
            validate
            onChange={value =>
              setProductForm(prev => ({ ...prev, carbs: +value }))
            }
            type="number"
          />
          <Input
            label="Fats"
            value={`${productForm.fats}`}
            validate
            onChange={value =>
              setProductForm(prev => ({ ...prev, fats: +value }))
            }
            type="number"
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <View style={{ width: '70%' }}>
              <Input
                label="Quantity"
                value={`${quantity.value}`}
                validate
                onChange={value =>
                  setQuantity(prev => ({ ...prev, value: value }))
                }
                type="number"
              />
            </View>
            <View style={{ width: '20%' }}>
              <Autocomplete
                placeholder="Unit"
                ref={autocompleteRef}
                isFocused={isFocusedMass}
                setIsFocused={setIsFocusedMass}
                initValue={'g'}
                options={['kg', 'g']}
                onChange={value => {
                  setQuantity(prev => ({ ...prev, unit: value }));
                }}
              />
            </View>
          </View>
        </Form>
      </CustomModal>
    </View>
  );
}
