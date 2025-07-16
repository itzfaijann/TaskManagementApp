import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fontSize, { moderateScale } from '../utils/metrix';

const priorities = {
  low: '#a18aff',
  medium: '#fcb045',
  high: '#f85a5a',
};

const Tag = ({ text, color }) => (
  <View style={[styles.tag, { backgroundColor: color }]}>
    <Text style={styles.tagText}>{text}</Text>
  </View>
);
const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(task.id)}>
      <Ionicons name="trash" size={20} color="#fff" />
    </TouchableOpacity>
  );
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        activeOpacity={0.85}
        onLongPress={() => onToggle(task.id, !task.completed)}
        style={[
          styles.taskCard,
          { borderLeftColor: priorities[task.priority] },
          task.completed && { opacity: 0.5 },
        ]}
      >
        <View style={styles.taskTop}>
          <TouchableOpacity
            onPress={() => onToggle(task.id, !task.completed)}
            style={[
              styles.checkboxCircle,
              task.completed && styles.checkboxCircleCompleted,
            ]}
          >
            {task.completed ? (
              <Ionicons name="checkmark" size={14} color="#fff" />
            ) : null}
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: moderateScale(10) }}>
            <View style={styles.taskHeader}>
              <Text
                style={[
                  styles.taskTitle,
                  task.completed && {
                    textDecorationLine: 'line-through',
                    color: '#aaa',
                  },
                ]}
                numberOfLines={1}
              >
                {task.title}
              </Text>

              <TouchableOpacity onPress={() => onEdit(task)}>
                <Ionicons
                  name="create-outline"
                  size={moderateScale(18)}
                  color="#8266FF"
                />
              </TouchableOpacity>
            </View>

            {task.description ? (
              <Text style={styles.taskDesc} numberOfLines={2}>
                {task.description}
              </Text>
            ) : null}
<TouchableOpacity
  onPress={() => onToggle(task.id, !task.completed)}
  style={styles.markTextWrapper}
>
  <Text
    style={[
      styles.markText,
      task.priority === 'high' && styles.markTextHigh,
      task.priority === 'medium' && styles.markTextMedium,
      task.priority === 'low' && styles.markTextLow,
    ]}
  >
    {task.completed ? 'Mark as Incomplete' : 'Mark as Completed'}
  </Text>
</TouchableOpacity>

          </View>
        </View>

        <View style={styles.taskFooter}>
          <View style={styles.priorityDotWrapper}>
            <View
              style={[
                styles.priorityDot,
                { backgroundColor: priorities[task.priority] },
              ]}
            />
            <Text style={styles.priorityText}>{task.priority}</Text>
          </View>

      <View
  style={[
    styles.dueDateBadge,
    task.priority === 'high' && styles.dueDateBadgeHigh,
    task.priority === 'medium' && styles.dueDateBadgeMedium,
    task.priority === 'low' && styles.dueDateBadgeLow,
  ]}
>
  <Ionicons
    name="calendar-outline"
    size={14}
    color={
      task.priority === 'high'
        ? '#fff'
        : task.priority === 'medium'
        ? '#fff'
        : '#fff'
    }
  />
  <Text
    style={[
      styles.dueDateText,
      task.priority === 'high' && styles.dueDateTextHigh,
      task.priority === 'medium' && styles.dueDateTextMedium,
      task.priority === 'low' && styles.dueDateTextLow,
    ]}
  >
    {task.dueDate}
  </Text>
</View>

        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};


const Main = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', priority: 'low' });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    fetchTasks();
    loadUserEmail();
  }, []);

  const loadUserEmail = async () => {
    const email = await AsyncStorage.getItem('userEmail');
    if (email) setUserEmail(email);
    else navigation.replace('Login');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userEmail');
    navigation.replace('Login');
  };

  const fetchTasks = async () => {
    const snapshot = await firestore().collection('tasks').orderBy('dueDate').get();
    setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleSave = async () => {
    if (!form.title || !form.dueDate) {
      Alert.alert('Error', 'Title and Due Date are required.');
      return;
    }
    if (editId) {
      await firestore().collection('tasks').doc(editId).update(form);
    } else {
      await firestore().collection('tasks').add({ ...form, completed: false });
    }
    setForm({ title: '', description: '', dueDate: '', priority: 'low' });
    setEditId(null);
    setModalVisible(false);
    fetchTasks();
  };

  const handleToggleComplete = async (id, status) => {
    await firestore().collection('tasks').doc(id).update({ completed: status });
    fetchTasks();
  };

  const handleEdit = (task) => {
    setForm({ title: task.title, description: task.description, dueDate: task.dueDate, priority: task.priority });
    setEditId(task.id);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    await firestore().collection('tasks').doc(id).delete();
    fetchTasks();
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
<View style={styles.header}>
  <View style={styles.circleTopRight} />
  <View style={styles.circleBottomLeft} />

  {userEmail ? (
    <Text style={styles.emailText}>{userEmail}</Text>
  ) : (
    <View style={{ width: moderateScale(80) }} /> // placeholder width
  )}

  <Text style={styles.headerTitle}>My tasks</Text>

  <TouchableOpacity onPress={handleLogout}>
    <Ionicons name="log-out-outline" size={24} color="#fff" />
  </TouchableOpacity>
</View>

        <TextInput
          placeholder="Search tasks..."
          placeholderTextColor="#ccc"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={moderateScale(40)} color="#ccc" />
            <Text style={styles.emptyText}>No tasks found</Text>
            <Text style={styles.emptySubText}>
              Tap <Ionicons name="add" size={moderateScale(14)} /> to add a new task
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editId ? 'Edit Task' : 'New Task'}</Text>
            <TextInput placeholder="Title" value={form.title} onChangeText={text => setForm({ ...form, title: text })} style={styles.input} />
            <TextInput placeholder="Description" value={form.description} onChangeText={text => setForm({ ...form, description: text })} style={styles.input} />
            <TextInput placeholder="Due Date (e.g. 2024-05-01)" value={form.dueDate} onChangeText={text => setForm({ ...form, dueDate: text })} style={styles.input} />
            <TextInput placeholder="Priority (low, medium, high)" value={form.priority} onChangeText={text => setForm({ ...form, priority: text })} style={styles.input} />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>{editId ? 'Update' : 'Create'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setModalVisible(false); setEditId(null); }}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  headerWrapper: {
    backgroundColor: '#8266FF',
    paddingBottom: moderateScale(16),
    borderBottomLeftRadius: moderateScale(20),
    borderBottomRightRadius: moderateScale(20),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(60),
  },

  circleTopRight: {
    position: 'absolute',
    top: moderateScale(46),
    right: -moderateScale(1),
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(50),
    backgroundColor: '#D0EEDB',
    opacity: 0.3,
    zIndex: 0,
  },

  circleBottomLeft: {
    position: 'absolute',
    bottom: -moderateScale(64),
    left: -moderateScale(20),
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(45),
    backgroundColor: '#D0EEDB',
    opacity: 0.3,
    zIndex: 0,
  },

  emailText: {
    color: '#fff',
    fontSize: fontSize(13),
    fontWeight: '500',
    maxWidth: moderateScale(120),
    overflow: 'hidden',
  },

  headerTitle: {
    color: '#fff',
    fontSize: fontSize(18),
    fontWeight: 'bold',
  },

  searchInput: {
    backgroundColor: '#6d58e8',
    color: '#fff',
    borderRadius: moderateScale(10),
    marginHorizontal: moderateScale(16),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    marginTop: moderateScale(10),
  },

  scrollContainer: {
    padding: moderateScale(16),
  },

  taskCard: {
    backgroundColor: '#fefefe',
    padding: moderateScale(16),
    borderRadius: moderateScale(14),
    marginBottom: moderateScale(14),
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
    borderLeftWidth: moderateScale(5),
  },

  taskTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: moderateScale(12),
  },

  checkboxCircle: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(2),
  },

  checkboxCircleCompleted: {
    backgroundColor: '#8266FF',
    borderColor: '#8266FF',
  },

  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  taskTitle: {
    fontSize: fontSize(15),
    fontWeight: 'bold',
    color: '#2d2d2d',
  },
  markTextWrapper: {
  marginTop: moderateScale(6),
},

markText: {
  fontSize: fontSize(12),
  color: '#8266FF',
  textDecorationLine: 'underline',
  fontStyle: 'italic',
},

  taskDesc: {
    fontSize: fontSize(13),
    color: '#555',
    marginTop: moderateScale(4),
    lineHeight: moderateScale(18),
  },

  taskFooter: {
    marginTop: moderateScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  priorityDotWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
  },

  priorityDot: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: 5,
  },

  priorityText: {
    fontSize: fontSize(12),
    color: '#555',
    textTransform: 'capitalize',
  },

  dueDateBadge: {
    backgroundColor: '#e9e5ff',
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  // Due Date Styles
dueDateBadgeHigh: {
  backgroundColor: '#f85a5a',
},
dueDateBadgeMedium: {
  backgroundColor: '#fcb045',
},
dueDateBadgeLow: {
  backgroundColor: '#a18aff',
},
dueDateTextHigh: {
  color: '#fff',
  fontWeight: 'bold',
},
dueDateTextMedium: {
  color: '#fff',
  fontWeight: 'bold',
},
dueDateTextLow: {
  color: '#fff',
  fontWeight: 'bold',
},

// Mark Text Styles
markTextHigh: {
  color: '#f85a5a',
},
markTextMedium: {
  color: '#fcb045',
},
markTextLow: {
  color: '#a18aff',
},


  dueDateText: {
    fontSize: fontSize(12),
    color: '#8266FF',
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: moderateScale(12),
  },

  tag: {
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    marginRight: moderateScale(6),
  },

  tagText: {
    color: '#fff',
    fontSize: fontSize(12),
  },

  fab: {
    position: 'absolute',
    bottom: moderateScale(24),
    alignSelf: 'center',
    backgroundColor: '#8266FF',
    borderRadius: moderateScale(30),
    width: moderateScale(60),
    height: moderateScale(60),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  modalContent: {
    margin: moderateScale(20),
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    elevation: 5,
  },

  modalTitle: {
    fontSize: fontSize(16),
    fontWeight: 'bold',
    marginBottom: moderateScale(10),
    textAlign: 'center',
  },

  input: {
    backgroundColor: '#f2f2f2',
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(10),
  },

  saveBtn: {
    backgroundColor: '#8266FF',
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },

  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  cancelBtn: {
    marginTop: moderateScale(10),
    alignItems: 'center',
  },

  cancelBtnText: {
    color: '#8266FF',
    fontWeight: 'bold',
  },

  deleteButton: {
    backgroundColor: '#f85a5a',
    justifyContent: 'center',
    alignItems: 'center',
    width: moderateScale(60),
    borderTopRightRadius: moderateScale(16),
    borderBottomRightRadius: moderateScale(16),
    marginBottom: moderateScale(12),
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(100),
    paddingHorizontal: moderateScale(20),
  },

  emptyText: {
    fontSize: fontSize(16),
    fontWeight: '600',
    color: '#999',
    marginTop: moderateScale(10),
  },

  emptySubText: {
    fontSize: fontSize(13),
    color: '#bbb',
    marginTop: moderateScale(4),
    textAlign: 'center',
  },
});
