import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import fontSize, { moderateScale } from '../utils/metrix';


const Welcome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Center Content */}
      <View style={styles.content}>
        {/* Icon box */}
        <View style={styles.iconBox}>
          <Ionicons name="checkmark" size={moderateScale(40)} color="#fff" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Get things done.</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Just a click away from{'\n'}planning your tasks.
        </Text>

        {/* Top Dots */}
        <View style={styles.topDotsContainer}>
          <View style={[styles.dot, { opacity: 0.3 }]} />
          <View style={[styles.dot, { opacity: 1 }]} />
          <View style={[styles.dot, { opacity: 0.3 }]} />
        </View>
      </View>

      {/* Decorative Ellipse */}
      <View style={styles.bottomEclipse} />

      {/* Bottom-right Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('Signup')}>
        <Ionicons name="arrow-forward" size={moderateScale(60)} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: moderateScale(24),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  topDotsContainer: {
    flexDirection: 'row',
    marginTop: moderateScale(20),
    right: moderateScale(80),
    gap: moderateScale(8),
  },
  dot: {
    width: moderateScale(8),
    height: moderateScale(8),
    backgroundColor: '#6C63FF',
    borderRadius: moderateScale(4),
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(-60),
    marginLeft: moderateScale(30),
  },
  iconBox: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(20),
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(32),
  },
  title: {
    fontSize: fontSize(27),
    fontWeight: '800',
    color: '#6C63FF',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: fontSize(15),
    color: '#999',
    textAlign: 'left',
    marginTop: moderateScale(8),
    lineHeight: moderateScale(20),
    marginRight: moderateScale(50),
  },
  nextButton: {
    position: 'absolute',
    bottom: moderateScale(28),
    right: moderateScale(30),
  },
  bottomEclipse: {
    position: 'absolute',
    width: moderateScale(200),
    height: moderateScale(200),
    borderRadius: moderateScale(100),
    backgroundColor: '#6C63FF',
    bottom: moderateScale(-60),
    right: moderateScale(-60),
    zIndex: 0,
  },
});
