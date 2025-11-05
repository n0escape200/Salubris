import { Text, View } from 'react-native';

type TableProps = {
  header: Array<string>;
  options: Array<any>; // Each element is an object
};

export default function Table(props: TableProps) {
  const { header, options } = props;

  return (
    <View style={{ width: '100%' }}>
      {/* Header Row */}
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        {header.map((h, index) => (
          <View
            key={index}
            style={{
              backgroundColor: 'grey',
              flex: 1,
              alignItems: 'center',
              padding: 5,
              borderWidth: 1,
              borderColor: '#ccccccff',
            }}
          >
            <Text style={{ color: 'white' }}>{h}</Text>
          </View>
        ))}
      </View>

      {/* Data Rows */}
      {options.map((opt, rowIndex) => (
        <View
          key={rowIndex}
          style={{
            flexDirection: 'row',
          }}
        >
          {header.map((h, colIndex) => (
            <View
              key={colIndex}
              style={{
                flex: 1,
                alignItems: 'center',
                padding: 5,
                borderWidth: 1,
                borderColor: '#ccccccff',
              }}
            >
              <Text style={{ color: 'white' }}>
                {opt[h.toLocaleLowerCase()]}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
