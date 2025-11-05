import { View } from 'react-native';
import CustomModal from '../Components/CustomModal';
import Table from '../Components/Table';
type DBVIsualizeProps = {
  open: boolean;
  onClose: () => void;
};

export default function DBVIsualize(props: DBVIsualizeProps) {
  const { open, onClose } = props;
  return (
    <CustomModal title="Database" open={open} onClose={() => onClose()}>
      <Table
        header={['name', 'calories', 'protein', 'carbs', 'fats']}
        options={[]}
      />
    </CustomModal>
  );
}
