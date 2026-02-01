import { View, Text, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import TrackLineItem from '../TrackLineItem';
import TrackLine from '../../DB/Models/TrackLine';
import { styles } from '../../Utils/Styles';

type TrackLinesListProps = {
  trackLines: TrackLine[];
  onEditTrackLine: (line: TrackLine) => void;
};

export default function TrackLinesList({
  trackLines,
  onEditTrackLine,
}: TrackLinesListProps) {
  if (trackLines.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateTitle}>No Items Tracked</Text>
        <Text style={styles.emptyStateText}>
          Tap the "+ Item" or "Meal" button to start tracking your intake
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.trackListContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          Tracked Items ({trackLines.length})
        </Text>
      </View>

      {trackLines.map((line, index) => (
        <Pressable
          key={line.id}
          onPress={() => onEditTrackLine(line)}
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <TrackLineItem index={index} line={line} />
        </Pressable>
      ))}
    </ScrollView>
  );
}
