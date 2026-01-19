import { Pressable, Text, View } from 'react-native';
import { styles } from '../Utils/Styles';
import { useContext, useState } from 'react';
import { TrackingContext } from '../Utils/Contexts/TrackingContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ScrollView } from 'react-native-gesture-handler';
import TrackLineItem from './TrackLineItem';
import CustomModal from './CustomModal';
import Form from './Form';
import Autocomplete from './Autocomplete';
import Product, { ProductType } from '../DB/Models/Product';
import { mapState } from '../Utils/Functions';
import Input from './Input';
import { database } from '../DB/Database';
import { useNotification } from '../Utils/Contexts/NotificationContext';
import TrackLine from '../DB/Models/TrackLine';
import CustomButton from './CustomButton';
import DatePicker from 'react-native-date-picker';

export default function MacroTracking() {
  const [open, setOpen] = useState(false);
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
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  async function createEntry() {
    try {
      await database.write(async () => {
        // Create or use the product info from the form
        const productData = {
          name: productForm.name,
          calories: productForm.calories,
          protein: productForm.protein,
          carbs: productForm.carbs,
          fats: productForm.fats,
        };

        // Optionally, save the product if it has a name and doesn't exist
        if (!productForm.id && productForm.name.trim() !== '') {
          await database.get<Product>('products').create(p => {
            p.name = productData.name;
            p.calories = productData.calories;
            p.protein = productData.protein;
            p.carbs = productData.carbs;
            p.fats = productData.fats;
          });
          addNotification({
            type: 'SUCCESS',
            message: `${productData.name} saved successfully`,
          });
        }

        // Create a track line using the nutritional info directly
        await database.get<TrackLine>('track_lines').create(trackLine => {
          trackLine.date = new Date().toISOString();
          trackLine.quantity = +quantity.value || 0;
          trackLine.unit = quantity.unit;
          trackLine.name = productData.name;
          trackLine.calories = productData.calories;
          trackLine.protein = productData.protein;
          trackLine.carbs = productData.carbs;
          trackLine.fats = productData.fats;
        });

        addNotification({
          type: 'SUCCESS',
          message: `Track line added successfully`,
        });

        trackContext?.setUpdateLine(true);
      });

      setOpen(false);
      // Reset form after adding
      setProductForm({
        id: undefined,
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
      });
      setQuantity({ value: '', unit: 'g' });
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  function reset() {
    setOpen(false);
    setProductForm({
      id: undefined,
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    });
  }

  const trackContext = useContext(TrackingContext);
  return (
    <View style={styles.page}>
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
            <Text style={styles.textl}>
              {trackContext?.macros.calories.toFixed(2)}
            </Text>
            <Text style={styles.textl}>
              {trackContext?.macros.protein.toFixed(2)}
            </Text>
            <Text style={styles.textl}>
              {trackContext?.macros.carbs.toFixed(2)}
            </Text>
            <Text style={styles.textl}>
              {trackContext?.macros.fats.toFixed(2)}
            </Text>
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
        <CustomButton
          label="Pick date"
          fontSize={13}
          customStyle={{
            marginTop: 0,
            padding: 1,
            paddingVertical: 2,
            paddingHorizontal: 20,
          }}
          onPress={() => {
            setOpenDatePicker(true);
          }}
        />
      </View>

      <ScrollView style={{ ...styles.container, padding: 10 }}>
        {trackContext?.todayLines.length === 0 ? (
          <Text style={styles.textxl}>No data</Text>
        ) : (
          trackContext?.todayLines.map((line, index) => (
            <TrackLineItem key={line.id} index={index} line={line} />
          ))
        )}
      </ScrollView>

      <CustomModal title="Add product" open={open} onClose={reset}>
        <Form onSubmit={createEntry} onCancel={reset}>
          <Autocomplete
            placeholder="Products"
            options={trackContext?.products || []}
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
                initValue={quantity.unit}
                options={['kg', 'g']}
                onChange={v => setQuantity(q => ({ ...q, unit: v }))}
                textInputStyle={{ textAlign: 'center' }}
              />
            </View>
          </View>
        </Form>
      </CustomModal>
      <DatePicker
        theme="dark"
        modal
        mode="date"
        locale="en-GB"
        open={openDatePicker}
        date={date}
        onConfirm={date => {
          setOpenDatePicker(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpenDatePicker(false);
        }}
      />
    </View>
  );
}
