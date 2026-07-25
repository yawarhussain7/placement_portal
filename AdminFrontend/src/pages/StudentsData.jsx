import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar'
import Header from '../components/common/Header';
import StudentFilters from '../components/student/StudentFilters';
import StudentStats from '../components/student/StudentStats';
import StudentTable from '../components/student/StudentTable';
import StudentModal from '../components/student/StudentModal';
import { getStudents, addStudent, updateStudent, deleteStudent, bulkDeleteStudents, exportStudents, searchStudentsByName, searchStudentsByEmail } from '../api/students.js'
import StudentViewModal from '../components/student/StudentViewModal'

const StudentsData = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [currentFilter, setCurrentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const studentData = await getStudents();
      if (studentData.success && Array.isArray(studentData.data)) {
        setStudents(studentData.data);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err.message);
      showNotification('Failed to fetch students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      try {
        setLoading(true);
        let result;
        
        // Check if search query is an email
        if (searchQuery.includes('@')) {
          result = await searchStudentsByEmail(searchQuery);
        } else {
          // Search by name
          result = await searchStudentsByName(searchQuery);
        }
        
        if (result.success && Array.isArray(result.data)) {
          setStudents(result.data);
          showNotification(`Found ${result.data.length} student(s)`);
        }
      } catch (err) {
        console.error('Search failed:', err.message);
        showNotification('Search failed. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    } else if (e.key === 'Enter' && !searchQuery.trim()) {
      // If search is cleared, fetch all students again
      fetchStudents();
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleViewStudent = (student) => {
    setViewingStudent(student);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleSaveStudent = async (studentData) => {
    try {
      if (editingStudent) {
        await updateStudent(editingStudent._id, studentData);
        setStudents(students.map(s => s._id === editingStudent._id ? { ...s, ...studentData } : s));
        showNotification('Student updated successfully');
      } else {
        const newStudent = await addStudent(studentData);
        if (newStudent.success) {
          setStudents([newStudent.data, ...students]);
          showNotification('Student added successfully');
        } else {
          showNotification(newStudent.message || 'Failed to add student', 'error');
        }
      }
    } catch (err) {
      console.error('Error saving student:', err);
      const errorMessage = err.response?.data?.message || 'Failed to save student';
      showNotification(errorMessage, 'error');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    try {
      await deleteStudent(id);
      setStudents(students.filter(s => s._id !== id));
      setSelectedStudents(selectedStudents.filter(sid => sid !== id));
      showNotification('Student deleted successfully');
    } catch (err) {
      console.error('Error deleting student:', err);
      showNotification('Failed to delete student', 'error');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) {
      showNotification('Please select students to delete', 'error');
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete ${selectedStudents.length} student(s)?`)) return;
    
    try {
      // Delete each selected student one by one
      const deletePromises = selectedStudents.map(id => deleteStudent(id));
      await Promise.all(deletePromises);
      
      // Remove deleted students from the list
      setStudents(students.filter(s => !selectedStudents.includes(s._id)));
      setSelectedStudents([]);
      showNotification(`${selectedStudents.length} student(s) deleted successfully`);
    } catch (err) {
      console.error('Error deleting students:', err);
      showNotification('Failed to delete students', 'error');
    }
  };

  const handleBulkExport = async () => {
    try {
      const blob = await exportStudents(selectedStudents);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showNotification('Students exported successfully');
    } catch (err) {
      console.error('Error exporting students:', err);
      showNotification('Failed to export students', 'error');
    }
  };

  const handleSelectStudent = (id, isSelected) => {
    if (isSelected) {
      setSelectedStudents([...selectedStudents, id]);
    } else {
      setSelectedStudents(selectedStudents.filter(sid => sid !== id));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedStudents(filteredStudents.map(s => s._id));
    } else {
      setSelectedStudents([]);
    }
  };

  // Structural dynamic processing for search syntax filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = (student.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (student.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (student.username || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = currentFilter === 'All' || 
                       (currentFilter === 'Active' && student.isActive) ||
                       (currentFilter === 'Inactive' && !student.isActive);
    const matchesDept = deptFilter === 'all';
    
    return matchesSearch && matchesTab && matchesDept;
  });

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Global Framework Sidebar Core Section Navigation wrapper */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Architecture Master Layout Header */}
        <Header 
          title="Students Management"
          breadcrumbs={[
            { label: 'Home', path: '/admin/dashboard' },
            { label: 'Students', path: '/admin/students' }
          ]}
        />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto max-w-[1600px] w-full mx-auto custom-scrollbar">
          
          {/* Notification Toast */}
          {notification && (
            <div className={`fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 ${
              notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {notification.type === 'error' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                )}
              </svg>
              <span className="text-sm font-semibold">{notification.message}</span>
            </div>
          )}

          {/* Top Section Descriptive Directory Header Grid Setup */}
          <StudentFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            deptFilter={deptFilter}
            setDeptFilter={setDeptFilter}
            onAddStudent={handleAddStudent}
            selectedStudents={selectedStudents}
            onBulkDelete={handleBulkDelete}
            onBulkExport={handleBulkExport}
            onSearch={handleSearch}
          />

          {/* Core Analytics Metric Row Blocks matching layout reference data fields */}
          <StudentStats students={students} loading={loading} />

          {/* Directory Status Table Matrix Element */}
          <StudentTable 
            students={filteredStudents}
            loading={loading}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            onViewStudent={handleViewStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            selectedStudents={selectedStudents}
            onSelectStudent={handleSelectStudent}
            onSelectAll={handleSelectAll}
          />

        </main>
      </div>

      {/* Student Modal for Add/Edit */}
      <StudentModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        student={editingStudent}
        onSave={handleSaveStudent}
      />

      {/* Student View Modal */}
      <StudentViewModal 
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
        student={viewingStudent}
      />
    </div>
  );
};

export default StudentsData;