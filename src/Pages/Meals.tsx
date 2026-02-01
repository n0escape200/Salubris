import { Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from '../Utils/Styles';
import Vocabulary from '../Utils/Vocabulary';
import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faTrash, faUtensils } from '@fortawesome/free-solid-svg-icons';
import Meal from '../DB/Models/Meal';
import MealItem from '../Components/MealItem';
import CustomModal from '../Components/CustomModal';
import Form from '../Components/Form';
import Product, { ProductType } from '../DB/Models/Product';
import Input from '../Components/Input';
import Autocomplete from '../Components/Autocomplete';
import { TrackingContext } from '../Utils/Contexts/TrackingContext';
import { useNotification } from '../Utils/Contexts/NotificationContext';

type MealProduct = {
  id: string;
  quantity: number;
  unit?: string;
};

export default function Meals() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<{
    id: string | null;
    name: string;
    products: MealProduct[];
  }>({
    id: null,
    name: '',
    products: [],
  });

  const trackingContext = useContext(TrackingContext);
  const { addNotification } = useNotification();

  // Use meals from context
  const meals = trackingContext?.meals || [];

  // Function to add a new empty product row
  const addProductRow = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { id: '', quantity: 0 }],
    }));
  };

  // Function to remove a product row
  const removeProductRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  // Function to update product selection
  const updateProduct = (index: number, product: ProductType) => {
    setFormData(prev => {
      const newProducts = [...prev.products];
      newProducts[index] = {
        ...newProducts[index],
        id: product.id || '',
      };
      return { ...prev, products: newProducts };
    });
  };

  // Function to update quantity
  const updateQuantity = (index: number, quantity: string) => {
    setFormData(prev => {
      const newProducts = [...prev.products];
      newProducts[index] = {
        ...newProducts[index],
        quantity: parseFloat(quantity) || 0,
      };
      return { ...prev, products: newProducts };
    });
  };

  // Function to edit a meal
  const handleEditMeal = (meal: Meal) => {
    setFormData({
      id: meal.id,
      name: meal.name,
      products: meal.products || [],
    });
    setOpen(true);
  };

  // Function to save the meal
  const saveMeal = async () => {
    try {
      // Validate form
      if (!formData.name.trim()) {
        addNotification({ type: 'ERROR', message: 'Please enter a meal name' });
        return;
      }

      if (formData.products.length === 0) {
        addNotification({
          type: 'ERROR',
          message: 'Please add at least one product',
        });
        return;
      }

      // Check if all products have valid IDs
      const hasInvalidProducts = formData.products.some(p => !p.id.trim());
      if (hasInvalidProducts) {
        addNotification({
          type: 'ERROR',
          message: 'Please select all products',
        });
        return;
      }

      if (formData.id && trackingContext?.editMeal) {
        // Update existing meal
        const meal = meals.find(m => m.id === formData.id);
        if (meal) {
          await trackingContext.editMeal(meal, {
            name: formData.name,
            products: formData.products,
          });
        }
      } else if (trackingContext?.refreshMeals) {
        // This will trigger the database update via the context
        await trackingContext.refreshMeals();
      }

      // Close modal and reset form
      setOpen(false);
      setFormData({
        id: null,
        name: '',
        products: [],
      });
    } catch (error) {
      console.error('Error saving meal:', error);
      addNotification({ type: 'ERROR', message: 'Failed to save meal' });
    }
  };

  // Reset form and close modal
  const handleCloseModal = () => {
    setOpen(false);
    setFormData({
      id: null,
      name: '',
      products: [],
    });
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.mealsHeader}>
        <View style={styles.headerContent}>
          <FontAwesomeIcon icon={faUtensils} size={28} color="#FF9800" />
          <View>
            <Text style={styles.mealsTitle}>{Vocabulary.meals}</Text>
            <Text style={styles.mealsSubtitle}>
              {meals.length} meal{meals.length !== 1 ? 's' : ''} saved
            </Text>
          </View>
        </View>

        <Pressable onPress={() => setOpen(true)} style={styles.addMealButton}>
          <FontAwesomeIcon icon={faPlus} size={20} color="white" />
        </Pressable>
      </View>

      {/* Meals List */}
      <ScrollView
        style={styles.mealsListContainer}
        showsVerticalScrollIndicator={false}
      >
        {meals.length === 0 ? (
          <View style={styles.emptyMealsState}>
            <FontAwesomeIcon icon={faUtensils} size={48} color="#555" />
            <Text style={styles.emptyMealsTitle}>No meals created</Text>
            <Text style={styles.emptyMealsText}>
              Create your first meal to quickly add it to your daily tracking
            </Text>
            <Pressable
              onPress={() => setOpen(true)}
              style={styles.createFirstMealButton}
            >
              <Text style={styles.createFirstMealText}>Create First Meal</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.mealsGrid}>
            {meals.map((meal: Meal) => (
              <MealItem
                key={meal.id}
                meal={meal}
                setRefresh={() => trackingContext?.refreshMeals?.()}
                onEdit={handleEditMeal}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create/Edit Meal Modal */}
      <CustomModal
        title={formData.id ? 'Edit Meal' : 'Create New Meal'}
        open={open}
        onClose={handleCloseModal}
      >
        <Form onSubmit={saveMeal} onCancel={handleCloseModal}>
          <View style={styles.mealFormContainer}>
            {/* Meal Name */}
            <Input
              label="Meal Name"
              placeholder="e.g., Breakfast Bowl, Post-Workout Shake"
              value={formData.name}
              validate
              onChange={v => setFormData(p => ({ ...p, name: v }))}
              backgroundColor="black"
            />

            {/* Products List */}
            <View style={styles.productsSection}>
              <Text style={styles.sectionTitle}>Products in Meal</Text>

              {formData.products.map((product, index) => (
                <View key={index} style={styles.productRow}>
                  <Pressable
                    onPress={() => removeProductRow(index)}
                    style={styles.removeProductButton}
                    hitSlop={10}
                  >
                    <FontAwesomeIcon icon={faTrash} color="#f44336" size={16} />
                  </Pressable>

                  <View style={styles.productInputs}>
                    <View style={styles.productNameInput}>
                      <Autocomplete
                        placeholder="Select product"
                        options={trackingContext?.products || []}
                        optionLabel="name"
                        onChange={(value: ProductType) =>
                          updateProduct(index, value)
                        }
                      />
                    </View>

                    <View style={styles.quantityInput}>
                      <Input
                        label="Quantity"
                        value={product.quantity.toString()}
                        validate
                        type="number"
                        onChange={v => updateQuantity(index, v)}
                        placeholder="g"
                      />
                    </View>
                  </View>
                </View>
              ))}

              {/* Add Product Button */}
              <Pressable
                onPress={addProductRow}
                style={styles.addProductButton}
              >
                <FontAwesomeIcon icon={faPlus} size={16} color="#4CAF50" />
                <Text style={styles.addProductText}>Add Product</Text>
              </Pressable>
            </View>

            {/* Meal Summary */}
            {formData.products.length > 0 && (
              <View style={styles.mealSummary}>
                <Text style={styles.summaryTitle}>
                  Meal includes {formData.products.length} product
                  {formData.products.length !== 1 ? 's' : ''}
                </Text>
                <Text style={styles.summaryText}>
                  All quantities are in grams (g)
                </Text>
              </View>
            )}
          </View>
        </Form>
      </CustomModal>
    </View>
  );
}
