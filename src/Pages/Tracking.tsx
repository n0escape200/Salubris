import { Pressable, ScrollView, Text, View } from 'react-native';
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
import TrackLine from '../DB/Models/TrackLine';
import TrackLineItem from '../Components/TrackLineItem';

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
  const [quantity, setQuantity] = useState({ value: '', unit: 'g' });
  const { addNotification } = useNotification();
  const [products, setProducts] = useState<Product[]>([]);
  const [trackLines, setTrackLines] = useState<TrackLine[]>([]);
  const [todayLines, setTodayLines] = useState<TrackLine[]>([]);
  const [shouldUpdate, setShouldUpdate] = useState(true);

  useEffect(() => {
    if (shouldUpdate) {
      getProducts();
      getTrackLines();
    }
    setShouldUpdate(false);
  }, [shouldUpdate]);

  useEffect(() => {
    filterTodayLines();
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
          product = await database.get<Product>('products').create(p => {
            p.name = productForm.name;
            p.calories = productForm.calories;
            p.protein = productForm.protein;
            p.carbs = productForm.carbs;
            p.fats = productForm.fats;
          });
          addNotification({
            type: 'SUCCESS',
            message: `${product.name} created successfully`,
          });
        }

        await database.get<TrackLine>('track_lines').create(trackLine => {
          trackLine.date = new Date().toISOString();
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
      setShouldUpdate(true);
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  function filterTodayLines() {
    const today = new Date().toISOString().slice(0, 10);
    const lines = trackLines.filter(line => line.date.slice(0, 10) === today);

    setTodayLines(lines);
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
          Intake for today
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.textl}>Calories:</Text>
            <Text style={styles.textl}>Protein:</Text>
            <Text style={styles.textl}>Carbohydrates:</Text>
            <Text style={styles.textl}>Fat:</Text>
          </View>
          <View>
            <Text style={styles.textl}>0</Text>
            <Text style={styles.textl}>0</Text>
            <Text style={styles.textl}>0</Text>
            <Text style={styles.textl}>0</Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 20 }}>
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
        <Text style={styles.textxl}>
          {new Intl.DateTimeFormat('en-GB').format(new Date())}
        </Text>
      </View>

      <ScrollView style={{ ...styles.container, padding: 10 }}>
        {todayLines.length === 0 ? (
          <Text style={styles.textxl}>No data</Text>
        ) : (
          todayLines.map((line, index) => (
            <TrackLineItem
              setShouldUpdate={setShouldUpdate}
              key={line.id}
              index={index}
              line={line}
            />
          ))
        )}
      </ScrollView>

      <CustomModal
        title="Add product"
        open={open}
        childRef={autocompleteRef}
        onPressOutside={() => {
          setIsFocusedProducts(false);
          setIsFocusedMass(false);
        }}
        onClose={() => {
          setShouldUpdate(true);
          setOpen(false);
        }}
      >
        <Form onSubmit={createEntry} onCancel={() => setOpen(false)}>
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
            onChange={v => setProductForm(p => ({ ...p, name: v }))}
          />
          <Input
            label="Calories"
            value={`${productForm.calories}`}
            validate
            type="number"
            onChange={v => setProductForm(p => ({ ...p, calories: +v }))}
          />
          <Input
            label="Protein"
            value={`${productForm.protein}`}
            validate
            type="number"
            onChange={v => setProductForm(p => ({ ...p, protein: +v }))}
          />
          <Input
            label="Carbs"
            value={`${productForm.carbs}`}
            validate
            type="number"
            onChange={v => setProductForm(p => ({ ...p, carbs: +v }))}
          />
          <Input
            label="Fats"
            value={`${productForm.fats}`}
            validate
            type="number"
            onChange={v => setProductForm(p => ({ ...p, fats: +v }))}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: '70%' }}>
              <Input
                label="Quantity"
                value={quantity.value}
                validate
                type="number"
                onChange={v => setQuantity(q => ({ ...q, value: v }))}
              />
            </View>
            <View style={{ width: '20%' }}>
              <Autocomplete
                placeholder="Unit"
                ref={autocompleteRef}
                isFocused={isFocusedMass}
                setIsFocused={setIsFocusedMass}
                initValue={quantity.unit}
                options={['kg', 'g']}
                onChange={v => setQuantity(q => ({ ...q, unit: v }))}
              />
            </View>
          </View>
        </Form>
      </CustomModal>
    </View>
  );
}
