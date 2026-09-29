import React, {useCallback, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProgressBar} from '../components/ProgressBar';
import {Course} from '../domain/models';
import {RootStackParamList} from '../navigation/types';
import {useCourses} from '../state/CourseContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export function DashboardScreen({navigation}: Props) {
  const {courses, loading, error, loadCourses} = useCourses();

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const openCourse = useCallback((course: Course) => {
    navigation.navigate('CourseDetails', {courseId: course.id});
  }, [navigation]);

  function renderCourse({item}: {item: Course}) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Continue ${item.title}`}
        onPress={() => openCourse(item)}
        style={({pressed}) => [styles.courseCard, pressed ? styles.pressed : null]}>
        <View style={styles.courseTopline}>
          <View style={styles.courseIcon}><Text style={styles.courseIconText}>{item.title.charAt(0)}</Text></View>
          <Text style={styles.courseTag}>{item.lessons.length} LESSONS</Text>
        </View>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <Text style={styles.instructor}>with {item.instructor}</Text>
        <View style={styles.progressHeading}>
          <Text style={styles.progressLabel}>Your progress</Text>
          <Text style={styles.progressValue}>{item.progress}%</Text>
        </View>
        <ProgressBar progress={item.progress} />
        <View style={styles.continueRow}>
          <Text style={styles.continueText}>Continue learning</Text>
          <Text style={styles.arrow}>›</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={courses}
        keyExtractor={course => course.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.greeting}>YOUR CLASSROOM</Text>
            <Text style={styles.heading}>Keep your momentum.</Text>
            <Text style={styles.subheading}>Pick up right where you left off.</Text>
            {error && courses.length > 0 ? (
              <View style={styles.refreshWarning}>
                <Text style={styles.refreshWarningText}>Could not refresh · showing saved courses</Text>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.stateBox}><ActivityIndicator color="#5B5CE2" /><Text style={styles.stateText}>Loading your courses…</Text></View>
          ) : error ? (
            <View style={styles.stateBox}>
              <Text style={styles.stateTitle}>Courses unavailable</Text>
              <Text style={styles.stateText}>{error}</Text>
              <Pressable onPress={() => {loadCourses();}} style={styles.retryButton}><Text style={styles.retryText}>Try again</Text></Pressable>
            </View>
          ) : (
            <View style={styles.stateBox}><Text style={styles.stateTitle}>No courses yet</Text><Text style={styles.stateText}>Your courses will appear here when they are available.</Text></View>
          )
        }
        refreshControl={<RefreshControl refreshing={loading && courses.length > 0} onRefresh={() => {loadCourses();}} tintColor="#5B5CE2" />}
        renderItem={renderCourse}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#F6F7FB'},
  listContent: {paddingHorizontal: 20, paddingBottom: 28, flexGrow: 1},
  header: {paddingTop: 14, paddingBottom: 18},
  greeting: {fontSize: 11, letterSpacing: 1.6, fontWeight: '800', color: '#777C91'},
  heading: {fontSize: 26, lineHeight: 32, fontWeight: '800', color: '#20253A', marginTop: 7},
  subheading: {fontSize: 14, color: '#777C91', marginTop: 5},
  refreshWarning: {backgroundColor: '#FFF3D9', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, marginTop: 15},
  refreshWarningText: {fontSize: 12, color: '#8A5A00', fontWeight: '600'},
  courseCard: {backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#ECEEF4'},
  pressed: {opacity: 0.85},
  courseTopline: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  courseIcon: {width: 42, height: 42, borderRadius: 14, backgroundColor: '#EEEEFF', alignItems: 'center', justifyContent: 'center'},
  courseIconText: {fontSize: 18, fontWeight: '800', color: '#5B5CE2'},
  courseTag: {fontSize: 10, fontWeight: '800', letterSpacing: 0.8, color: '#85899A'},
  courseTitle: {fontSize: 18, fontWeight: '800', color: '#20253A', marginTop: 15},
  instructor: {fontSize: 13, color: '#777C91', marginTop: 4},
  progressHeading: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, marginBottom: 8},
  progressLabel: {fontSize: 12, color: '#777C91'},
  progressValue: {fontSize: 12, fontWeight: '800', color: '#5B5CE2'},
  continueRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16},
  continueText: {fontSize: 13, fontWeight: '700', color: '#4549C8'},
  arrow: {fontSize: 25, lineHeight: 26, color: '#5B5CE2'},
  stateBox: {alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 45},
  stateTitle: {fontSize: 17, fontWeight: '800', color: '#20253A', textAlign: 'center'},
  stateText: {fontSize: 14, lineHeight: 21, color: '#777C91', textAlign: 'center', marginTop: 10},
  retryButton: {marginTop: 18, paddingHorizontal: 20, paddingVertical: 11, borderRadius: 12, backgroundColor: '#5B5CE2'},
  retryText: {fontSize: 13, fontWeight: '700', color: '#FFFFFF'},
});
