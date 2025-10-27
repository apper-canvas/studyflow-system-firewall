import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format, isPast, isToday, isTomorrow, parseISO } from "date-fns";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Textarea from "@/components/atoms/Textarea";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Modal from "@/components/molecules/Modal";
import FilterBar from "@/components/molecules/FilterBar";

const Assignments = () => {
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState("dueDate")
const [formData, setFormData] = useState({
    course_id_c: "",
    title_c: "",
    description_c: "",
    due_date_c: "",
    priority_c: "medium",
    weight_c: 10
  })

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ])
      
      setAssignments(assignmentsData)
      setCourses(coursesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

const handleOpenModal = (assignment = null) => {
    if (assignment) {
      setEditingAssignment(assignment)
      const courseId = typeof assignment.course_id_c === 'object' ? assignment.course_id_c.Id : assignment.course_id_c
      setFormData({
        course_id_c: courseId.toString(),
        title_c: assignment.title_c,
        description_c: assignment.description_c || "",
        due_date_c: format(parseISO(assignment.due_date_c), "yyyy-MM-dd'T'HH:mm"),
        priority_c: assignment.priority_c,
        weight_c: assignment.weight_c
      })
    } else {
      setEditingAssignment(null)
      setFormData({
        course_id_c: courses.length > 0 ? courses[0].Id.toString() : "",
        title_c: "",
        description_c: "",
        due_date_c: "",
        priority_c: "medium",
        weight_c: 10
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingAssignment(null)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title_c.trim() || !formData.due_date_c || !formData.course_id_c) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const assignmentData = {
        course_id_c: parseInt(formData.course_id_c),
        title_c: formData.title_c,
        description_c: formData.description_c,
        due_date_c: new Date(formData.due_date_c).toISOString(),
        priority_c: formData.priority_c,
        weight_c: parseInt(formData.weight_c),
        completed_c: false,
        grade_c: null
      }

      let updatedAssignment
      if (editingAssignment) {
        updatedAssignment = await assignmentService.update(editingAssignment.Id, assignmentData)
        setAssignments(prev => prev.map(a => a.Id === editingAssignment.Id ? updatedAssignment : a))
        toast.success("Assignment updated successfully!")
      } else {
        updatedAssignment = await assignmentService.create(assignmentData)
        setAssignments(prev => [...prev, updatedAssignment])
        toast.success("Assignment created successfully!")
      }
      handleCloseModal()
    } catch (err) {
      toast.error(editingAssignment ? "Failed to update assignment" : "Failed to create assignment")
    }
  }

  const handleToggleComplete = async (assignmentId) => {
    try {
      const updatedAssignment = await assignmentService.toggleComplete(assignmentId)
      setAssignments(prev => 
        prev.map(a => a.Id === assignmentId ? updatedAssignment : a)
      )
      toast.success(updatedAssignment.completed ? "Assignment marked as complete!" : "Assignment marked as pending")
    } catch (err) {
      toast.error("Failed to update assignment")
    }
  }

  const handleDelete = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) {
      return
    }

    try {
      await assignmentService.delete(assignmentId)
      setAssignments(prev => prev.filter(a => a.Id !== assignmentId))
      toast.success("Assignment deleted successfully!")
    } catch (err) {
      toast.error("Failed to delete assignment")
    }
  }

const getCourseById = (courseId) => {
    const id = typeof courseId === 'object' ? courseId.Id : courseId
    return courses.find(c => c.Id === id)
  }

  const getDueDateColor = (dueDate, completed) => {
    if (completed) return "text-success-600"
    const date = parseISO(dueDate)
    if (isPast(date) && !isToday(date)) return "text-danger-600"
    if (isToday(date)) return "text-warning-600"
    if (isTomorrow(date)) return "text-orange-600"
    return "text-slate-600"
  }

  const getDueDateText = (dueDate, completed) => {
    if (completed) return "Completed"
    const date = parseISO(dueDate)
    if (isPast(date) && !isToday(date)) return "Overdue"
    if (isToday(date)) return "Due Today"
    if (isTomorrow(date)) return "Due Tomorrow"
    return format(date, "MMM d, h:mm a")
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "danger"
      case "medium": return "warning"
      case "low": return "success"
      default: return "default"
    }
  }

  // Filter and sort assignments
const filteredAssignments = assignments.filter(assignment => {
    const courseId = typeof assignment.course_id_c === 'object' ? assignment.course_id_c.Id : assignment.course_id_c
    
    if (filters.courseId && courseId.toString() !== filters.courseId) return false
    if (filters.priority && assignment.priority_c !== filters.priority) return false
    
    if (filters.status) {
      switch (filters.status) {
        case "completed":
          if (!assignment.completed_c) return false
          break
        case "pending":
          if (assignment.completed_c) return false
          break
        case "overdue":
          if (assignment.completed_c || !isPast(parseISO(assignment.due_date_c)) || isToday(parseISO(assignment.due_date_c))) return false
          break
      }
    }
    
    return true
  })

const sortedAssignments = filteredAssignments.sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        return new Date(a.due_date_c) - new Date(b.due_date_c)
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority_c] - priorityOrder[a.priority_c]
      case "course":
        const courseA = getCourseById(a.course_id_c)?.name_c || ""
        const courseB = getCourseById(b.course_id_c)?.name_c || ""
        return courseA.localeCompare(courseB)
      case "title":
        return a.title_c.localeCompare(b.title_c)
      default:
        return 0
    }
  })

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
              Assignments
            </h1>
            <p className="text-slate-600">
              Track your assignments and never miss a deadline
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-40"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="course">Sort by Course</option>
              <option value="title">Sort by Title</option>
            </Select>
            
            <Button 
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Assignment
            </Button>
          </div>
        </motion.div>

        {/* Filter Bar */}
        <FilterBar 
          courses={courses}
          onFilterChange={setFilters}
          activeFilters={filters}
        />

        {/* Assignments List */}
        {sortedAssignments.length === 0 ? (
          <Empty 
            type={Object.keys(filters).some(key => filters[key]) ? "search" : "assignments"}
            title={Object.keys(filters).some(key => filters[key]) ? "No assignments match your filters" : "No assignments yet"}
            description={Object.keys(filters).some(key => filters[key]) 
              ? "Try adjusting your filters to see more results" 
              : "Add your first assignment to get started with tracking your coursework"
            }
            actionText={Object.keys(filters).some(key => filters[key]) ? "Clear Filters" : "Add Assignment"}
            onAction={Object.keys(filters).some(key => filters[key]) 
              ? () => setFilters({})
              : () => handleOpenModal()
            }
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
{sortedAssignments.map((assignment, index) => {
              const course = getCourseById(assignment.course_id_c)
              
              return (
                <motion.div
                  key={assignment.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`premium-card hover:shadow-lg transition-all duration-200 ${
                    assignment.completed_c 
                      ? "bg-success-50 border-success-200" 
                      : isPast(parseISO(assignment.due_date_c)) && !isToday(parseISO(assignment.due_date_c))
                        ? "bg-danger-50 border-danger-200"
                        : ""
                  }`}>
                    <Card.Content>
                      <div className="flex items-start space-x-4">
                        {/* Checkbox */}
<button
                          onClick={() => handleToggleComplete(assignment.Id)}
                          className={`mt-1 w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
                            assignment.completed_c
                              ? "bg-success-500 border-success-500"
                              : "border-slate-300 hover:border-primary-500"
                          }`}
                        >
                          {assignment.completed_c && (
                            <ApperIcon name="Check" size={14} className="text-white" />
                          )}
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
<div className="flex items-center space-x-2 mb-2">
                            {course && (
                              <Badge 
                                variant="outline"
                                className="text-xs"
                                style={{ 
                                  borderColor: course?.color_c,
                                  color: course?.color_c,
                                  backgroundColor: `${course?.color_c}15`
                                }}
                              >
                                {course?.name_c}
                              </Badge>
                            )}
                            <Badge 
                              variant={getPriorityColor(assignment.priority_c)}
                              size="sm"
                            >
                              {assignment.priority_c}
                            </Badge>
                            {assignment.weight_c && (
                              <Badge variant="outline" size="sm">
                                {assignment.weight_c}%
                              </Badge>
)}
                          </div>

                          <h3 className={`font-semibold text-slate-800 mb-1 ${
                            assignment.completed_c ? "line-through opacity-60" : ""
                          }`}>
                            {assignment.title_c}
                          </h3>
                          {assignment.description_c && (
                            <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                              {assignment.description_c}
                            </p>
                          )}

<div className="flex items-center space-x-4 text-sm">
                            <span className={`font-medium ${getDueDateColor(assignment.due_date_c, assignment.completed_c)}`}>
                              {getDueDateText(assignment.due_date_c, assignment.completed_c)}
                            </span>
                            
                            {assignment.grade_c !== null && (
                              <Badge 
                                variant={assignment.grade_c >= 90 ? "success" : 
                                       assignment.grade_c >= 80 ? "warning" : "danger"}
                                size="sm"
                              >
                                {assignment.grade_c}%
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleOpenModal(assignment)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                          >
                            <ApperIcon name="Edit2" size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(assignment.Id)}
                            className="p-1 text-slate-400 hover:text-danger-600 rounded transition-colors"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </button>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Add/Edit Assignment Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          title={editingAssignment ? "Edit Assignment" : "Add New Assignment"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Select
                label="Course"
                value={formData.course_id_c}
                onChange={(e) => handleInputChange("course_id_c", e.target.value)}
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.Id} value={course.Id}>
                    {course.name_c}
                  </option>
                ))}
              </Select>
              
              <Select
                label="Priority"
                value={formData.priority_c}
                onChange={(e) => handleInputChange("priority_c", e.target.value)}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </Select>
            </div>
            
<Input
              label="Assignment Title"
              value={formData.title_c}
              onChange={(e) => handleInputChange("title_c", e.target.value)}
              placeholder="e.g., Programming Assignment 3"
              required
            />
            
<Textarea
              label="Description"
              value={formData.description_c}
              onChange={(e) => handleInputChange("description_c", e.target.value)}
              placeholder="Brief description of the assignment..."
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Input
                type="datetime-local"
                label="Due Date"
                value={formData.due_date_c}
                onChange={(e) => handleInputChange("due_date_c", e.target.value)}
                required
              />
              
<Input
                type="number"
                label="Weight (%)"
                value={formData.weight_c}
                onChange={(e) => handleInputChange("weight_c", e.target.value)}
                min="1"
                max="100"
                placeholder="10"
              />
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <Button type="submit" className="flex-1">
                {editingAssignment ? "Update Assignment" : "Create Assignment"}
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

export default Assignments