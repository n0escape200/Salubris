import { useState, useContext } from 'react';
import { View } from 'react-native';
import { TrackingContext } from '../../Utils/Contexts/TrackingContext';
import { useNotification } from '../../Utils/Contexts/NotificationContext';
import { database } from '../../DB/Database';
import Product, { ProductType } from '../../DB/Models/Product';
import TrackLine from '../../DB/Models/TrackLine';
import CustomModal from '../CustomModal';
import Form from '../Form';
import Autocomplete from '../Autocomplete';
import Input from '../Input';
import { mapState } from '../../Utils/Functions';
import { styles } from '../../Utils/Styles';

type ProductModalProps = {
  open: boolean;
  onClose: () => void;
  date: Date;
  editingLine?: TrackLine;
};

export default function ProductModal({
  open,
  onClose,
  date,
  editingLine,
}: ProductModalProps) {
  const [productForm, setProductForm] = useState<ProductType>({
    id: editingLine?.id || undefined,
    name: editingLine?.name || '',
    calories: editingLine?.calories || 0,
    protein: editingLine?.protein || 0,
    carbs: editingLine?.carbs || 0,
    fats: editingLine?.fats || 0,
  });

  const [quantity, setQuantity] = useState({
    value: editingLine?.quantity?.toString() || '',
    unit: editingLine?.unit || 'g',
  });

  const trackContext = useContext(TrackingContext);
  const { addNotification } = useNotification();

  const getLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    try {
      await database.write(async () => {
        const productData = {
          name: productForm.name,
          calories: productForm.calories,
          protein: productForm.protein,
          carbs: productForm.carbs,
          fats: productForm.fats,
        };

        // Save product if it's new
        if (!productForm.id && productForm.name.trim() !== '') {
          await database.get<Product>('products').create(p => {
            p.name = productData.name;
            p.calories = productData.calories;
            p.protein = productData.protein;
            p.carbs = productData.carbs;
            p.fats = productData.fats;
          });
        }

        if (editingLine) {
          // Update existing track line
          const trackLine = await database
            .get<TrackLine>('track_lines')
            .find(editingLine.id);

          await trackLine.update(tl => {
            tl.date = getLocalDateString(date);
            tl.quantity = +quantity.value || 0;
            tl.unit = quantity.unit;
            tl.name = productData.name;
            tl.calories = productData.calories;
            tl.protein = productData.protein;
            tl.carbs = productData.carbs;
            tl.fats = productData.fats;
          });

          addNotification({
            type: 'SUCCESS',
            message: 'Item updated successfully',
          });
        } else {
          // Create new track line
          await database.get<TrackLine>('track_lines').create(trackLine => {
            trackLine.date = getLocalDateString(date);
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
            message: 'Item added successfully',
          });
        }

        trackContext?.setUpdateLines(true);
      });

      onClose();
      resetForm();
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  };

  const resetForm = () => {
    setProductForm({
      id: undefined,
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    });
    setQuantity({ value: '', unit: 'g' });
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <CustomModal
      title={editingLine ? 'Edit Item' : 'Add Item'}
      open={open}
      onClose={handleClose}
    >
      <Form onSubmit={handleSubmit} onCancel={handleClose}>
        <View
          style={{ backgroundColor: '#1c1c1c', padding: 15, borderRadius: 10 }}
        >
          <Autocomplete
            placeholder="Search products"
            options={trackContext?.products || []}
            optionLabel="name"
            onChange={(value: ProductType) =>
              mapState(value, productForm, setProductForm)
            }
          />
        </View>

        <View
          style={{ backgroundColor: '#1c1c1c', padding: 15, borderRadius: 10 }}
        >
          <Input
            label="Name"
            value={productForm.name}
            validate
            onChange={v => setProductForm(p => ({ ...p, name: v }))}
          />

          <View style={styles.macroGrid}>
            <Input
              label="Calories"
              value={`${productForm.calories}`}
              validate
              type="number"
              style={styles.macroInput}
              onChange={v => setProductForm(p => ({ ...p, calories: +v }))}
            />
            <Input
              label="Protein"
              value={`${productForm.protein}`}
              validate
              type="number"
              style={styles.macroInput}
              onChange={v => setProductForm(p => ({ ...p, protein: +v }))}
            />
            <Input
              label="Carbs"
              value={`${productForm.carbs}`}
              validate
              type="number"
              style={styles.macroInput}
              onChange={v => setProductForm(p => ({ ...p, carbs: +v }))}
            />
            <Input
              label="Fats"
              value={`${productForm.fats}`}
              validate
              type="number"
              style={styles.macroInput}
              onChange={v => setProductForm(p => ({ ...p, fats: +v }))}
            />
          </View>

          <View style={styles.quantityContainer}>
            <View style={styles.quantityInput}>
              <Input
                label="Quantity"
                value={quantity.value}
                validate
                type="number"
                onChange={v => setQuantity(q => ({ ...q, value: v }))}
              />
            </View>
            <View style={styles.unitSelector}>
              <Autocomplete
                placeholder="Unit"
                initValue={quantity.unit}
                options={['g', 'kg', 'ml', 'L']}
                onChange={v => setQuantity(q => ({ ...q, unit: v }))}
                textInputStyle={styles.unitInput}
              />
            </View>
          </View>
        </View>
      </Form>
    </CustomModal>
  );
}
