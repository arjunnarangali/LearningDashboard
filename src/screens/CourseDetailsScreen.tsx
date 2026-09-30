import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProgressBar } from '../components/ProgressBar';
import { RootStackParamList } from '../navigation/types';
import { useCourseDetails } from '../hooks/useCourseDetails';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetails'>;

export function CourseDetailsScreen({ route }: Props) {
  const { course, completedLessons, savingLesson, saveError, complete } =
    useCourseDetails(route.params.courseId);

  if (!course) {
    return (
      <View style={styles.center}>
        <Text style={styles.missing}>Course not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.summaryCard}>
        <Text style={styles.eyebrow}>COURSE</Text>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.instructor}>with {course.instructor}</Text>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Course progress</Text>
          <Text style={styles.progressValue}>{course.progress}%</Text>
        </View>
        <ProgressBar progress={course.progress} />
      </View>

      <View style={styles.lessonHeading}>
        <Text style={styles.sectionTitle}>Lessons</Text>
        <Text style={styles.lessonCount}>
          {completedLessons} of {course.lessons.length} complete
        </Text>
      </View>

      {saveError ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {saveError}
        </Text>
      ) : null}

      {course.lessons.map((lesson, index) => {
        const isSaving = savingLesson === lesson.id;
        return (
          <View key={lesson.id} style={styles.lessonCard}>
            <View
              style={[
                styles.statusCircle,
                lesson.completed ? styles.completedCircle : null,
              ]}
            >
              <Text
                style={[
                  styles.statusMark,
                  lesson.completed ? styles.completedMark : null,
                ]}
              >
                {lesson.completed ? '✓' : String(index + 1).padStart(2, '0')}
              </Text>
            </View>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text
                style={[
                  styles.lessonStatus,
                  lesson.completed ? styles.doneText : null,
                ]}
              >
                {lesson.completed ? 'Completed' : 'Pending'}
              </Text>
            </View>
            {!lesson.completed ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Mark ${lesson.title} complete`}
                disabled={savingLesson !== null}
                onPress={() => {
                  complete(lesson.id);
                }}
                style={styles.completeButton}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#5B5CE2" />
                ) : (
                  <Text style={styles.completeText}>Complete</Text>
                )}
              </Pressable>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F7FB' },
  content: { padding: 20, paddingBottom: 36 },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ECEEF4',
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '800',
    color: '#777C91',
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    color: '#20253A',
    marginTop: 8,
  },
  instructor: { fontSize: 14, color: '#777C91', marginTop: 5 },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 9,
  },
  progressLabel: { fontSize: 12, color: '#777C91' },
  progressValue: { fontSize: 12, fontWeight: '800', color: '#5B5CE2' },
  lessonHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 27,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: '#20253A' },
  lessonCount: { fontSize: 12, color: '#777C91' },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECEEF4',
    padding: 13,
    marginBottom: 9,
  },
  statusCircle: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#F0F1F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCircle: { backgroundColor: '#E6F6EF' },
  statusMark: { fontSize: 11, fontWeight: '800', color: '#85899A' },
  completedMark: { fontSize: 16, color: '#1B9A68' },
  lessonInfo: { flex: 1, marginLeft: 12 },
  lessonTitle: { fontSize: 13, fontWeight: '700', color: '#30354A' },
  lessonStatus: { fontSize: 11, color: '#9297AA', marginTop: 4 },
  doneText: { color: '#1B9A68' },
  completeButton: {
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#EEEEFF',
  },
  completeText: { fontSize: 11, fontWeight: '700', color: '#5153D1' },
  error: { fontSize: 12, color: '#C43D4C', marginBottom: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missing: { fontSize: 15, color: '#777C91' },
});
