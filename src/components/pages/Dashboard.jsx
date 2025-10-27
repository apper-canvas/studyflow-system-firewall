import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format, isToday, isTomorrow, isThisWeek, isPast } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { courseService } from "@/services/api/courseService"
import { assignmentService } from "@/services/api/assignmentService"
import { toast } from "react-toastify"

const Dashboard = () => {
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadData} />

  // Calculate dashboard statistics
  const upcomingAssignments = assignments
    .filter(a => !a.completed && new Date(a.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  const todayAssignments = assignments.filter(a => 
    !a.completed && isToday(new Date(a.dueDate))
  )

  const overdueAssignments = assignments.filter(a => 
    !a.completed && isPast(new Date(a.dueDate)) && !isToday(new Date(a.dueDate))
  )

  const completedThisWeek = assignments.filter(a => 
    a.completed && isThisWeek(new Date(a.createdAt))
  ).length

  const totalAssignments = assignments.length
  const completedAssignments = assignments.filter(a => a.completed).length
  const completionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0

  // Calculate overall GPA (simplified)
  const gradesAssignments = assignments.filter(a => a.grade !== null)
  const averageGrade = gradesAssignments.length > 0 
    ? gradesAssignments.reduce((sum, a) => sum + a.grade, 0) / gradesAssignments.length
    : 0
  const gpa = (averageGrade / 100 * 4).toFixed(2)

  const getDueDateColor = (dueDate) => {
    const date = new Date(dueDate)
    if (isPast(date) && !isToday(date)) return "text-danger-600"
    if (isToday(date)) return "text-warning-600"
    if (isTomorrow(date)) return "text-orange-600"
    return "text-slate-600"
  }

  const getDueDateText = (dueDate) => {
    const date = new Date(dueDate)
    if (isPast(date) && !isToday(date)) return "Overdue"
    if (isToday(date)) return "Due Today"
    if (isTomorrow(date)) return "Due Tomorrow"
    return format(date, "MMM d, h:mm a")
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-danger-600"
      case "medium": return "text-warning-600"
      case "low": return "text-success-600"
      default: return "text-slate-600"
    }
  }

  const getCourseById = (courseId) => {
    return courses.find(c => c.Id === courseId)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Academic Dashboard
          </h1>
          <p className="text-slate-600">
            Stay on top of your coursework and track your progress
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Upcoming Assignments */}
          <Card className="premium-card">
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Upcoming</p>
                  <p className="text-2xl font-bold text-primary-600 count-up">
                    {upcomingAssignments.length}
                  </p>
                  <p className="text-xs text-slate-500">assignments</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Clock" size={24} className="text-white" />
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Due Today */}
          <Card className="premium-card">
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Due Today</p>
                  <p className="text-2xl font-bold text-warning-600 count-up">
                    {todayAssignments.length}
                  </p>
                  <p className="text-xs text-slate-500">urgent tasks</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="AlertCircle" size={24} className="text-white" />
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Completion Rate */}
          <Card className="premium-card">
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Completion</p>
                  <p className="text-2xl font-bold text-success-600 count-up">
                    {completionRate}%
                  </p>
                  <p className="text-xs text-slate-500">{completedAssignments}/{totalAssignments} done</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="CheckCircle" size={24} className="text-white" />
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Current GPA */}
          <Card className="premium-card">
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Current GPA</p>
                  <p className="text-2xl font-bold text-secondary-600 count-up">
                    {gpa}
                  </p>
                  <p className="text-xs text-slate-500">out of 4.0</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" size={24} className="text-white" />
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Assignments */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="premium-card">
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Upcoming Assignments
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.location.href = "/assignments"}
                  >
                    View All
                  </Button>
                </div>
              </Card.Header>
              <Card.Content>
                {upcomingAssignments.length === 0 ? (
                  <Empty 
                    type="assignments"
                    title="All caught up!"
                    description="No upcoming assignments. Great work staying on track!"
                    actionText="View All Assignments"
                    onAction={() => window.location.href = "/assignments"}
                  />
                ) : (
                  <div className="space-y-4">
                    {upcomingAssignments.map((assignment, index) => {
                      const course = getCourseById(assignment.courseId)
                      return (
                        <motion.div
                          key={assignment.Id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <button
                            onClick={() => handleToggleComplete(assignment.Id)}
                            className="w-5 h-5 border-2 border-slate-300 rounded hover:border-primary-500 transition-colors flex items-center justify-center"
                          >
                            {assignment.completed && (
                              <ApperIcon name="Check" size={14} className="text-primary-600" />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              {course && (
                                <Badge 
                                  variant="outline"
                                  className="text-xs"
                                  style={{ 
                                    borderColor: course.color,
                                    color: course.color,
                                    backgroundColor: `${course.color}15`
                                  }}
                                >
                                  {course.name}
                                </Badge>
                              )}
                              <Badge 
                                variant={assignment.priority === "high" ? "danger" : 
                                       assignment.priority === "medium" ? "warning" : "success"}
                                size="sm"
                              >
                                {assignment.priority}
                              </Badge>
                            </div>
                            
                            <p className="font-medium text-slate-800 truncate">
                              {assignment.title}
                            </p>
                            <p className={`text-sm ${getDueDateColor(assignment.dueDate)} font-medium`}>
                              {getDueDateText(assignment.dueDate)}
                            </p>
                          </div>

                          <ApperIcon 
                            name="Circle" 
                            size={8} 
                            className={getPriorityColor(assignment.priority)}
                            fill="currentColor"
                          />
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </Card.Content>
            </Card>
          </motion.div>

          {/* Today's Schedule & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Today's Schedule */}
            <Card className="premium-card">
              <Card.Header>
                <h3 className="text-lg font-semibold text-slate-800">
                  Today's Schedule
                </h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {courses.slice(0, 3).map((course, index) => (
                    <motion.div
                      key={course.Id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm truncate">
                          {course.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {course.schedule}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Quick Actions */}
            <Card className="premium-card">
              <Card.Header>
                <h3 className="text-lg font-semibold text-slate-800">
                  Quick Actions
                </h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = "/assignments"}
                  >
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Add Assignment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = "/courses"}
                  >
                    <ApperIcon name="BookOpen" size={16} className="mr-2" />
                    Add Course
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = "/calendar"}
                  >
                    <ApperIcon name="Calendar" size={16} className="mr-2" />
                    View Calendar
                  </Button>
                </div>
              </Card.Content>
            </Card>

            {/* Overdue Alert */}
            {overdueAssignments.length > 0 && (
              <Card className="border-danger-200 bg-danger-50">
                <Card.Content>
                  <div className="flex items-start space-x-3">
                    <ApperIcon name="AlertTriangle" size={20} className="text-danger-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-danger-800 mb-1">
                        {overdueAssignments.length} Overdue Assignment{overdueAssignments.length > 1 ? "s" : ""}
                      </p>
                      <p className="text-sm text-danger-600 mb-3">
                        You have assignments that need immediate attention
                      </p>
                      <Button 
                        size="sm" 
                        variant="danger"
                        onClick={() => window.location.href = "/assignments"}
                      >
                        Review Now
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard