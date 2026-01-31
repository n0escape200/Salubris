import { Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from '../Utils/Styles';
import Vocabulary from '../Utils/Vocabulary';
import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDumpster, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { database } from '../DB/Database';
import Meal from '../DB/Models/Meal';
import MealItem from '../Components/MealItem';
import CustomModal from '../Components/CustomModal';
import Form from '../Components/Form';
import Product, { ProductType } from '../DB/Models/Product';
import Input from '../Components/Input';
import Autocomplete from '../Components/Autocomplete';
import { TrackingContext } from '../Utils/Contexts/TrackingContext';
import { mapState } from '../Utils/Functions';

export default function Meals() {
  const [open, setOpen] = useState(false);
  const [meals, setMeals] = useState<Array<Meal>>([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    products: Array<string>(),
  });
  const trackingContext = useContext(TrackingContext);

  useEffect(() => {
    const getDate = async () => {
      const mealData = await database.get<Meal>('meals').query().fetch();
      setMeals(mealData);
    };
    getDate();
  }, []);

  return (
    <View style={styles.page}>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
        <Text style={styles.textxl}>{Vocabulary.meals}</Text>
        <Pressable
          onPress={() => setOpen(true)}
          style={{ backgroundColor: '#3a3a3a', padding: 6, borderRadius: 50 }}
        >
          <FontAwesomeIcon icon={faPlus} color="white" />
        </Pressable>
      </View>
      <ScrollView style={{ ...styles.container, padding: 10 }}>
        {meals.map((meal: Meal, index) => (
          <Pressable key={index}>
            <MealItem />
          </Pressable>
        ))}
      </ScrollView>

      <CustomModal
        title="Add meal"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Form
          onSubmit={() => {}}
          onCancel={() => {
            setOpen(false);
          }}
        >
          <View>
            <Input
              label="Name"
              value={formData.name}
              validate
              onChange={v => setFormData(p => ({ ...p, name: v }))}
            />
            {Array.from({ length: formData.products.length + 1 }).map(
              (_, index) => (
                <View
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}
                >
                  <Pressable
                    onPress={() => {
                      const item = formData.products[index];
                      const filteredArray = formData.products.filter(
                        p => p === item,
                      );
                      setFormData(prev => ({
                        ...prev,
                        products: filteredArray,
                      }));
                    }}
                    style={{ marginTop: 10 }}
                  >
                    <FontAwesomeIcon icon={faTrash} color="red" size={20} />
                  </Pressable>
                  <Autocomplete
                    style={{ width: '59%', marginTop: 10 }}
                    placeholder={`Product #${index + 1}`}
                    options={trackingContext?.products || []}
                    optionLabel="name"
                    onChange={(value: ProductType) =>
                      setFormData(prev => ({
                        ...prev,
                        products: [...prev.products, value.id || ''],
                      }))
                    }
                  />
                  <Input
                    style={{ width: '30%' }}
                    label="Name"
                    value={formData.name}
                    validate
                    onChange={v => setFormData(p => ({ ...p, name: v }))}
                  />
                </View>
              ),
            )}
          </View>
        </Form>
      </CustomModal>
    </View>
  );
}
