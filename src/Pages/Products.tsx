import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { styles } from '../Utils/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faBarcode,
  faFileImport,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import Input from '../Components/Input';
import Dropdown from '../Components/Dropdown';
import ItemList from '../Components/ItemList';
import { useContext, useEffect, useRef, useState } from 'react';
import { TrackingContext } from '../Utils/Contexts/TrackingContext';
import ImportProduct from '../Components/ImportProduct';
import CustomModal from '../Components/CustomModal';
import Form from '../Components/Form';
import Product, { ProductType } from '../DB/Models/Product';
import { database } from '../DB/Database';
import { useNotification } from '../Utils/Contexts/NotificationContext';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import axios from 'axios';

export default function Products() {
  const autocompleteRef = useRef<any>(null);
  const { addNotification } = useNotification();
  const { hasPermission, requestPermission } = useCameraPermission();
  const trackingContext = useContext(TrackingContext);
  const [openImport, setOpenImport] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [productForm, setProductForm] = useState<ProductType>({
    id: undefined,
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [exportData, setExportData] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [openCamera, setOpenCamera] = useState(false);
  const device = useCameraDevice('back');
  useEffect(() => {
    if (exportData.name !== '' && !openAdd) {
      setOpenAdd(true);
      setProductForm(prev => ({
        ...prev,
        name: exportData.name,
        calories: exportData.calories,
        protein: exportData.protein,
        carbs: exportData.carbs,
        fats: exportData.fats,
      }));
    }
  }, [exportData]);

  async function addProduct() {
    try {
      await database.write(async () => {
        await database.get<Product>('products').create(p => {
          p.name = productForm.name;
          p.calories = productForm.calories;
          p.protein = productForm.protein;
          p.carbs = productForm.carbs;
          p.fats = productForm.fats;
        });
        addNotification({
          type: 'SUCCESS',
          message: `${productForm.name} created successfully`,
        });
        trackingContext?.setUpdateLine(true);
        setOpenAdd(false);
      });
    } catch (error) {
      addNotification({
        type: 'ERROR',
        message: `${error}`,
      });
    }
  }

  async function handleOpenCamera() {
    try {
      if (!hasPermission) {
        await requestPermission();
      }
      if (device == null) {
        addNotification({ type: 'ERROR', message: 'No camera detected' });
      }
      setOpenCamera(true);
    } catch (error) {
      addNotification({
        type: 'ERROR',
        message: `${error}`,
      });
    }
  }

  let codesArray: string[] = [];

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: async codes => {
      const scannedCode = codes[0]?.value;
      if (!scannedCode) return; // safety check

      codesArray.push(scannedCode);

      if (codesArray.length === 10) {
        const freq: Record<string, number> = {};
        let maxCount = 0;
        let maxValue = '';

        for (const code of codesArray) {
          freq[code] = (freq[code] || 0) + 1;
          if (freq[code] > maxCount) {
            maxCount = freq[code];
            maxValue = code;
          }
        }
        console.log(maxValue);
        await axios
          .get(`https://world.openfoodfacts.net/api/v3/product/${maxValue}`)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err.response);
            addNotification({ type: 'ERROR', message: `${err}` });
          });
        setOpenCamera(false);
      }
    },
  });

  return (
    <View style={styles.page}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 20,
          alignItems: 'center',
        }}
      >
        <Text style={styles.textxl}>Products:</Text>
        <Pressable
          onPress={() => {
            setOpenAdd(true);
          }}
          style={{
            backgroundColor: '#3a3a3aff',
            padding: 3,
            borderRadius: 50,
          }}
        >
          <FontAwesomeIcon size={20} color="#ffffffff" icon={faPlus} />
        </Pressable>
        <Pressable
          onPress={() => {
            setOpenImport(true);
          }}
          style={{
            backgroundColor: '#3a3a3aff',
            padding: 7,
            borderRadius: 15,
          }}
        >
          <FontAwesomeIcon color="white" icon={faFileImport} />
        </Pressable>
        <Pressable
          style={{
            backgroundColor: '#3a3a3aff',
            padding: 7,
            borderRadius: 15,
          }}
          onPress={() => {
            handleOpenCamera();
          }}
        >
          <FontAwesomeIcon color="white" icon={faBarcode} />
        </Pressable>
      </View>
      <View style={styles.container}>
        <Input label="Search" />
        <Dropdown options={['test1', 'test2', 'test3', 'test4']} />
      </View>

      <ScrollView
        style={[styles.container, { position: 'relative', padding: 10 }]}
      >
        <View style={{ gap: 10 }}>
          {trackingContext?.products.map((product, index) => {
            return <ItemList key={index} product={product} />;
          })}
        </View>
      </ScrollView>
      <ImportProduct
        open={openImport}
        onClose={() => {
          setOpenImport(false);
        }}
        setExportData={setExportData}
      />
      <CustomModal
        title="Add product"
        open={openAdd}
        childRef={autocompleteRef}
        onClose={() => {
          setOpenAdd(false);
        }}
      >
        <Form
          onSubmit={() => {
            addProduct();
          }}
          onCancel={() => {
            setOpenAdd(false);
            setExportData({
              name: '',
              calories: 0,
              protein: 0,
              carbs: 0,
              fats: 0,
            });
            setProductForm({
              id: undefined,
              name: '',
              calories: 0,
              protein: 0,
              carbs: 0,
              fats: 0,
            });
          }}
        >
          <Input
            label="Name"
            value={productForm.name}
            validate
            onChange={v => {}}
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
        </Form>
      </CustomModal>
      {device && openCamera && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={openCamera}
          codeScanner={codeScanner}
        />
      )}
    </View>
  );
}
