import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Modal from '@/components/molecules/Modal';
import Input from '@/components/atoms/Input';
import { studentService } from '@/services/api/studentService';
import { toast } from 'react-toastify';

function Students() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    first_name_c: '',
    last_name_c: '',
    email_c: '',
    Tags: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student => {
      const searchLower = searchTerm.toLowerCase();
      return (
        student.Name?.toLowerCase().includes(searchLower) ||
        student.first_name_c?.toLowerCase().includes(searchLower) ||
        student.last_name_c?.toLowerCase().includes(searchLower) ||
        student.email_c?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(student = null) {
    setEditingStudent(student);
    if (student) {
      setFormData({
        Name: student.Name || '',
        first_name_c: student.first_name_c || '',
        last_name_c: student.last_name_c || '',
        email_c: student.email_c || '',
        Tags: student.Tags || ''
      });
    } else {
      setFormData({
        Name: '',
        first_name_c: '',
        last_name_c: '',
        email_c: '',
        Tags: ''
      });
    }
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormData({
      Name: '',
      first_name_c: '',
      last_name_c: '',
      email_c: '',
      Tags: ''
    });
  }

  function handleInputChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!formData.Name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!formData.email_c.trim()) {
      toast.error('Email is required');
      return;
    }

    setSubmitting(true);

    try {
      let result;
      if (editingStudent) {
        result = await studentService.update(editingStudent.Id, formData);
      } else {
        result = await studentService.create(formData);
      }

      if (result.success) {
        toast.success(editingStudent ? 'Student updated successfully' : 'Student created successfully');
        handleCloseModal();
        loadData();
      } else {
        toast.error(result.message || 'Operation failed');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(studentId) {
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      const result = await studentService.delete(studentId);
      if (result.success) {
        toast.success('Student deleted successfully');
        loadData();
      } else {
        toast.error(result.message || 'Failed to delete student');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    }
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Students</h1>
            <p className="text-slate-600">Manage student records</p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <ApperIcon name="UserPlus" size={18} className="mr-2" />
            Add Student
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <ApperIcon
            name="Search"
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
          />
          <Input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Student Grid */}
      {filteredStudents.length === 0 ? (
        <Empty
          title="No students found"
          description={searchTerm ? "Try adjusting your search" : "Get started by adding your first student"}
          actionText="Add Student"
          onAction={() => handleOpenModal()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <motion.div
              key={student.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-slate-800">
                          {student.Name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {student.first_name_c} {student.last_name_c}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(student)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Edit2" size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(student.Id)}
                        className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-slate-600">
                      <ApperIcon name="Mail" size={14} className="mr-2" />
                      {student.email_c || 'No email'}
                    </div>

                    {student.Tags && (
                      <div className="flex flex-wrap gap-2">
                        {student.Tags.split(',').map((tag, idx) => (
                          <Badge key={idx} variant="primary" size="sm">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingStudent ? 'Edit Student' : 'Add Student'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name *
            </label>
            <Input
              type="text"
              value={formData.Name}
              onChange={(e) => handleInputChange('Name', e.target.value)}
              placeholder="Enter student name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                First Name
              </label>
              <Input
                type="text"
                value={formData.first_name_c}
                onChange={(e) => handleInputChange('first_name_c', e.target.value)}
                placeholder="First name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Last Name
              </label>
              <Input
                type="text"
                value={formData.last_name_c}
                onChange={(e) => handleInputChange('last_name_c', e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email_c}
              onChange={(e) => handleInputChange('email_c', e.target.value)}
              placeholder="student@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tags
            </label>
            <Input
              type="text"
              value={formData.Tags}
              onChange={(e) => handleInputChange('Tags', e.target.value)}
              placeholder="Enter tags separated by commas"
            />
            <p className="text-xs text-slate-500 mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  {editingStudent ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingStudent ? 'Update Student' : 'Create Student'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Students;