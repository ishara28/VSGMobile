import {View, ActivityIndicator, StyleSheet, Modal} from 'react-native';
import {COMMON_COLORS} from '../../resources/colors';

interface VSpinnerProps {
  visible: boolean;
}
const VSpinner: React.FC<VSpinnerProps> = ({visible}) => {
  return (
    <Modal transparent animationType="none" visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={visible}
            color={COMMON_COLORS.SUCCESS.W900}
            size={40}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicatorWrapper: {
    backgroundColor: 'white',
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
  },
});

export default VSpinner;
