import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Modal from "@/components/molecules/Modal"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import { courseService } from "@/services/api/courseService"
import { assignmentService } from "@/services/api/assignmentService"
import { toast } from "react-toastify"

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
const [formData, setFormData] = useState({
    name_c: "",
    instructor_c: "",
    schedule_c: "",
    color_c: "#2563eb",
    semester_c: "Fall 2024",
    credits_c: 3
  })

  const colorOptions = [
    { value: "#2563eb", label: "Blue", color: "#2563eb" },
    { value: "#7c3aed", label: "Purple", color: "#7c3aed" },
    { value: "#0891b2", label: "Cyan", color: "#0891b2" },
    { value: "#059669", label: "Green", color: "#059669" },
    { value: "#dc2626", label: "Red", color: "#dc2626" },
    { value: "#d97706", label: "Orange", color: "#d97706" },
    { value: "#be185d", label: "Pink", color: "#be185d" },
    { value: "#4338ca", label: "Indigo", color: "#4338ca" }
  ]

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ])
      
      setCourses(coursesData)
      setAssignments(assignmentsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course)
      setFormData({
        name_c: course.name_c,
        instructor_c: course.instructor_c,
        schedule_c: course.schedule_c,
        color_c: course.color_c,
        semester_c: course.semester_c,
        credits_c: course.credits_c
      })
    } else {
      setEditingCourse(null)
      setFormData({
        name_c: "",
        instructor_c: "",
        schedule_c: "",
        color_c: "#2563eb",
        semester_c: "Fall 2024",
        credits_c: 3
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCourse(null)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name_c.trim() || !formData.instructor_c.trim() || !formData.schedule_c.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      let updatedCourse
      if (editingCourse) {
        updatedCourse = await courseService.update(editingCourse.Id, formData)
        setCourses(prev => prev.map(c => c.Id === editingCourse.Id ? updatedCourse : c))
        toast.success("Course updated successfully!")
      } else {
        updatedCourse = await courseService.create(formData)
        setCourses(prev => [...prev, updatedCourse])
        toast.success("Course created successfully!")
      }
      handleCloseModal()
    } catch (err) {
      toast.error(editingCourse ? "Failed to update course" : "Failed to create course")
    }
  }

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course? This will also remove all associated assignments.")) {
      return
    }

    try {
      await courseService.delete(courseId)
      setCourses(prev => prev.filter(c => c.Id !== courseId))
      toast.success("Course deleted successfully!")
    } catch (err) {
      toast.error("Failed to delete course")
    }
  }

const getCourseStats = (courseId) => {
    const courseAssignments = assignments.filter(a => {
      const assignmentCourseId = typeof a.course_id_c === 'object' ? a.course_id_c.Id : a.course_id_c
      return assignmentCourseId === courseId
    })
    const completed = courseAssignments.filter(a => a.completed_c).length
    const total = courseAssignments.length
    const overdue = courseAssignments.filter(a => 
      !a.completed_c && new Date(a.due_date_c) < new Date()
    ).length
    
    // Calculate average grade
    const gradedAssignments = courseAssignments.filter(a => a.grade_c !== null)
    const averageGrade = gradedAssignments.length > 0
      ? Math.round(gradedAssignments.reduce((sum, a) => sum + a.grade_c, 0) / gradedAssignments.length)
      : null

    return { completed, total, overdue, averageGrade }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              My Courses
            </h1>
            <p className="text-slate-600">
              Manage your courses and track your academic progress
            </p>
          </div>
          
          <Button 
            onClick={() => handleOpenModal()}
            className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Course
          </Button>
        </motion.div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <Empty 
            type="courses"
            onAction={() => handleOpenModal()}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {courses.map((course, index) => {
              const stats = getCourseStats(course.Id)
              const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
              
              return (
                <motion.div
                  key={course.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="premium-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <Card.Content>
                      {/* Course Header */}
<div className="flex items-start justify-between mb-4">
                        <div 
                          className="w-4 h-16 rounded-full flex-shrink-0"
                          style={{ backgroundColor: course.color_c }}
                        />
                        
                        <div className="flex-1 ml-4 min-w-0">
                          <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1 truncate">
                            {course.name_c}
                          </h3>
                          <p className="text-sm text-slate-600 mb-1">
                            {course.instructor_c}
                          </p>
                          <p className="text-xs text-slate-500">
                            {course.schedule_c}
                          </p>
                        </div>

                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={() => handleOpenModal(course)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                          >
                            <ApperIcon name="Edit2" size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(course.Id)}
                            className="p-1 text-slate-400 hover:text-danger-600 rounded transition-colors"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Course Stats */}
                      <div className="space-y-3 mb-4">
                        {/* Progress Bar */}
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-slate-600">Progress</span>
                            <span className="font-medium text-slate-800">{completionRate}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${completionRate}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                            />
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="CheckCircle" size={14} className="text-success-500" />
                              <span className="text-slate-600">{stats.completed}/{stats.total}</span>
                            </div>
                            {stats.overdue > 0 && (
                              <div className="flex items-center space-x-1">
                                <ApperIcon name="AlertCircle" size={14} className="text-danger-500" />
                                <span className="text-danger-600">{stats.overdue}</span>
                              </div>
                            )}
                          </div>
                          
                          {stats.averageGrade && (
                            <Badge 
                              variant={stats.averageGrade >= 90 ? "success" : 
                                     stats.averageGrade >= 80 ? "warning" : "danger"}
                              size="sm"
                            >
                              {stats.averageGrade}%
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Course Details */}
<div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                        <span>{course.semester_c}</span>
                        <span>{course.credits_c} credits</span>
                      </div>
                    </Card.Content>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Add/Edit Course Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          title={editingCourse ? "Edit Course" : "Add New Course"}
          size="md"
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
<Input
              label="Course Name"
              value={formData.name_c}
              onChange={(e) => handleInputChange("name_c", e.target.value)}
              placeholder="e.g., Computer Science Fundamentals"
              required
            />
            
<Input
              label="Instructor"
              value={formData.instructor_c}
              onChange={(e) => handleInputChange("instructor_c", e.target.value)}
              placeholder="e.g., Dr. Sarah Johnson"
              required
            />
            
<Input
              label="Schedule"
              value={formData.schedule_c}
              onChange={(e) => handleInputChange("schedule_c", e.target.value)}
              placeholder="e.g., MWF 10:00-11:00 AM"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Select
                label="Semester"
                value={formData.semester_c}
                onChange={(e) => handleInputChange("semester_c", e.target.value)}
              >
                <option value="Fall 2024">Fall 2024</option>
                <option value="Spring 2025">Spring 2025</option>
                <option value="Summer 2025">Summer 2025</option>
              </Select>
              
<Input
                type="number"
                label="Credits"
                value={formData.credits_c}
                onChange={(e) => handleInputChange("credits_c", parseInt(e.target.value))}
                min="1"
                max="6"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Course Color
              </label>
              <div className="grid grid-cols-4 gap-3">
{colorOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange("color_c", option.value)}
                    className={`w-full h-12 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                      formData.color_c === option.value 
                        ? "border-slate-800 scale-105 shadow-lg" 
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    style={{ backgroundColor: option.color }}
                  >
                    {formData.color_c === option.value && (
                      <ApperIcon name="Check" size={16} className="text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <Button type="submit" className="flex-1">
                {editingCourse ? "Update Course" : "Create Course"}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleCloseModal}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}

export default Courses