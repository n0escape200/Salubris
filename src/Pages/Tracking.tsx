import { Pressable, Text, View } from 'react-native';
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
import ProductClass from '../Utils/Models';
import { useNotification } from '../Utils/NotificationContext';

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
      useNotification().addNotification({
        type: 'SUCCESS',
        message: 'Prodcut added succesfully',
      });
    } catch (error) {
      useNotification().addNotification({
        type: 'ERROR',
        message: 'Error adding the prodcut',
      });
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
        onPressOutside={() => setIsFocused(false)}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Form
          onSubmit={(shouldSubmit: boolean) => {
            if (shouldSubmit) {
              createEntry();
              setOpen(false);
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
