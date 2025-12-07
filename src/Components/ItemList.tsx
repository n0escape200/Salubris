import { Text, View } from 'react-native';
import { styles } from '../Utils/Styles';
import { ProductType } from '../DB/Models/Product';

type ItemListProps = {
  product: ProductType;
};

export default function ItemList({ product }: ItemListProps) {
  return (
    <View
      style={{
        backgroundColor: '#303030ff',
        padding: 10,
        borderRadius: 5,
        borderColor: '#696969ff',
        borderWidth: 2,
        marginBottom: 10,
      }}
    >
      <Text style={styles.textxl}>{product?.name || 'Product name'}</Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 100,
        }}
      >
        <Text style={styles.textl}>Kcal:</Text>
        <Text style={styles.textl}>{product?.calories || 0}</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 100,
        }}
      >
        <Text style={styles.textl}>Protein:</Text>
        <Text style={styles.textl}>{product?.protein || 0}</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 100,
        }}
      >
        <Text style={styles.textl}>Carbs:</Text>
        <Text style={styles.textl}>{product?.carbs || 0}</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 100,
        }}
      >
        <Text style={styles.textl}>Fats:</Text>
        <Text style={styles.textl}>{product?.fats || 0}</Text>
      </View>
    </View>
  );
}
