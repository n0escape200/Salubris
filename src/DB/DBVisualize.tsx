import { View } from 'react-native';
import CustomModal from '../Components/CustomModal';
import Table from '../Components/Table';
type DBVIsualizeProps = {
  open: boolean;
  onClose: () => void;
};

const options = [
  {
    name: 'Grilled Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6,
  },
  {
    name: 'Brown Rice',
    calories: 216,
    protein: 5,
    carbs: 45,
    fats: 1.8,
  },
  {
    name: 'Broccoli',
    calories: 55,
    protein: 4.7,
    carbs: 11.2,
    fats: 0.6,
  },
  {
    name: 'Salmon',
    calories: 208,
    protein: 20,
    carbs: 0,
    fats: 13,
  },
  {
    name: 'Avocado',
    calories: 240,
    protein: 3,
    carbs: 12.8,
    fats: 22,
  },
  {
    name: 'Eggs',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fats: 11,
  },
  {
    name: 'Oatmeal',
    calories: 150,
    protein: 5,
    carbs: 27,
    fats: 3,
  },
  {
    name: 'Almonds',
    calories: 575,
    protein: 21,
    carbs: 22,
    fats: 49,
  },
  {
    name: 'Greek Yogurt',
    calories: 100,
    protein: 10,
    carbs: 4,
    fats: 0,
  },
  {
    name: 'Sweet Potato',
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fats: 0.1,
  },
];

export default function DBVIsualize(props: DBVIsualizeProps) {
  const { open, onClose } = props;
  return (
    <CustomModal title="Database" open={open} onClose={() => onClose()}>
      <Table
        header={['name', 'calories', 'protein', 'carbs', 'fats']}
        options={options}
      />
    </CustomModal>
  );
}
