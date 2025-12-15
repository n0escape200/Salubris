import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CustomModal from './CustomModal';
import Input from './Input';
import { useNotification } from '../Utils/Contexts/NotificationContext';
import axios from 'axios';
import { getApiUrl } from '../Utils/Constants';
import {
  Dimensions,
  Linking,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { styles } from '../Utils/Styles';
import Divider from './Divider';

type ImportProductProps = {
  open: boolean;
  onClose: () => void;
  setExportData: Dispatch<SetStateAction<any>>;
};

export default function ImportProduct({
  open,
  onClose,
  setExportData,
}: ImportProductProps) {
  const { addNotification } = useNotification();
  const { height } = Dimensions.get('window');
  const [product, setProduct] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNoData, setIsNotData] = useState(false);
  const maxScrollHeight = height * 0.65;

  function getMacro(product: any, macro: string): number {
    const value = (product.foodNutrients as Array<any>).filter(value =>
      (value.nutrientName as string).includes(macro),
    );
    if (value.length >= 1) {
      return value[0].value;
    }
    return 0;
  }

  useEffect(() => {
    if (data.length > 0 && !isNoData) {
      setIsLoading(false);
    }
  }, [data]);

  async function handleProductSearch() {
    try {
      await axios.get(getApiUrl(product)).then(data => {
        console.log(data.data);
        if (data.data.foods.length > 0) {
          setData(data.data.foods);
        } else {
          setIsNotData(true);
          setIsLoading(false);
        }
      });
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  function handleExportData(productId: number) {
    const product: any = data.filter((p: any) => p.fdcId === productId)[0];
    console.log(product);
    setExportData({
      name: product.description,
      calories: getMacro(product, 'Energy'),
      protein: getMacro(product, 'Protein'),
      carbs: getMacro(product, 'Carbohydrate'),
      fats: getMacro(product, 'fat'),
    });
    setData([]);
    setProduct('');
    onClose();
  }
  return (
    <CustomModal
      open={open}
      onClose={() => {
        onClose();
        setData([]);
        setProduct('');
        setIsLoading(false);
        setIsNotData(false);
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginBottom: 13,
        }}
      >
        <Text style={{ color: 'white' }}>Using data from </Text>
        <Text
          style={{ color: '#2e7fe7ff' }}
          onPress={() => Linking.openURL('https://fdc.nal.usda.gov')}
        >
          U.S. Department of Agriculture
        </Text>
      </View>
      <Input
        label="Product"
        validate
        value={product}
        onChange={value => {
          setProduct(value);
        }}
        onSubmit={() => {
          setData([]);
          handleProductSearch();
          setIsLoading(true);
          setIsNotData(false);
        }}
      />
      <ScrollView
        style={{
          ...styles.container,
          marginTop: 20,
          maxHeight: maxScrollHeight,
        }}
      >
        {isLoading && <Text style={{ color: 'white' }}>Loading...</Text>}
        {isNoData && <Text style={{ color: 'white' }}>No data</Text>}
        {data.length > 0 && (
          <>
            {data.map((product: any, index) => {
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => {
                    handleExportData(product.fdcId);
                  }}
                >
                  <View
                    style={{
                      backgroundColor: '#727272ff',
                      marginBottom: 20,
                      padding: 10,
                      borderRadius: 15,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 15 }}>
                      {(product.description as string).length > 40
                        ? `${(product.description as string).slice(0, 40)}...`
                        : product.description}
                    </Text>
                    <Divider />
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 10,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Text style={{ color: 'white' }}>{`Kcal:${getMacro(
                        product,
                        'Energy',
                      )}`}</Text>
                      <Text style={{ color: 'white' }}>{`Protein:${getMacro(
                        product,
                        'Protein',
                      )}`}</Text>
                      <Text style={{ color: 'white' }}>{`Carbs:${getMacro(
                        product,
                        'Carbohydrate',
                      )}`}</Text>
                      <Text style={{ color: 'white' }}>{`Fat:${getMacro(
                        product,
                        'fat',
                      )}`}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </>
        )}
      </ScrollView>
    </CustomModal>
  );
}
