import { Button, Pressable, Text, TextInput, View } from 'react-native';
import { styles } from '../Utils/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';
import CustomModal from '../Components/CustomModal';
import Autocomplete from '../Components/Autocomplete';
import Input from '../Components/Input';
import Form from '../Components/Form';
import { database } from '../DB/Database';
import Product from '../DB/Models/Product';
import ProductClass from '../Utils/Classes';
export default function Tracking() {
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const autocompleteRef = useRef<any>(null);
  const [productForm, setProdcutForm] = useState(new ProductClass());

  async function createEntry() {
    try {
      await database.write(async () => {
        await database.get<Product>('products').create(product => {
          product.name = productForm.name;
          product.calories = productForm.calories;
          product.protein = productForm.protein;
          product.carbs = productForm.carbs;
          product.fats = productForm.fats;
        });
      });
    } catch (error) {
      console.error('❌ Error creating product:', error);
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

      <CustomModal
        title="Add product"
        open={open}
        childRef={autocompleteRef}
        onPressOutside={() => setIsFocused(false)}
      >
        <Form
          onSubmit={() => {
            createEntry();
            setOpen(false);
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
          />
          <Input
            onChange={value => {
              setProdcutForm(prev => ({ ...prev, calories: +value }));
            }}
            label="Calories"
          />{' '}
          <Input
            onChange={value => {
              setProdcutForm(prev => ({ ...prev, protein: +value }));
            }}
            label="Protein"
          />
          <Input
            onChange={value => {
              setProdcutForm(prev => ({ ...prev, carbs: +value }));
            }}
            label="Carbs"
          />
          <Input
            onChange={value => {
              setProdcutForm(prev => ({ ...prev, fats: +value }));
            }}
            label="Fats"
          />
        </Form>
      </CustomModal>
    </View>
  );
}
