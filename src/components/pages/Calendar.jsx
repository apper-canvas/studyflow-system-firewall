import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  addMonths, 
  subMonths,
  parseISO,
  isSameDay,
  startOfWeek,
  endOfWeek
} from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { assignmentService } from "@/services/api/assignmentService"
import { courseService } from "@/services/api/courseService"
import { cn } from "@/utils/cn"

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("month") // month, week, day
  const [selectedDate, setSelectedDate] = useState(new Date())

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

  const getCourseById = (courseId) => {
    return courses.find(c => c.Id === courseId)
  }

  const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => 
      isSameDay(parseISO(assignment.dueDate), date)
    )
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => 
      direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1)
    )
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  // Generate calendar days
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

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
              Academic Calendar
            </h1>
            <p className="text-slate-600">
              View your assignments and course schedules at a glance
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1">
              <Button
                variant={viewMode === "month" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("month")}
                className="rounded-md"
              >
                Month
              </Button>
              <Button
                variant={viewMode === "week" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("week")}
                className="rounded-md"
              >
                Week
              </Button>
            </div>
            
            <Button 
              variant="outline"
              onClick={goToToday}
            >
              Today
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card className="premium-card">
              <Card.Header>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigateMonth("prev")}
                      className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <ApperIcon name="ChevronLeft" size={20} />
                    </button>
                    
                    <h2 className="text-xl font-bold text-slate-800">
                      {format(currentDate, "MMMM yyyy")}
                    </h2>
                    
                    <button
                      onClick={() => navigateMonth("next")}
                      className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <ApperIcon name="ChevronRight" size={20} />
                    </button>
                  </div>
                  
                  <div className="text-sm text-slate-500">
                    {assignments.filter(a => !a.completed).length} pending assignments
                  </div>
                </div>
              </Card.Header>
              
              <Card.Content>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Week day headers */}
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="p-3 text-center text-sm font-medium text-slate-600 bg-slate-50 rounded-lg"
                    >
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {calendarDays.map((day, index) => {
                    const dayAssignments = getAssignmentsForDate(day)
                    const isCurrentMonth = isSameMonth(day, currentDate)
                    const isDayToday = isToday(day)
                    const isSelected = isSameDay(day, selectedDate)
                    
                    return (
                      <motion.button
                        key={day.toISOString()}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.01 }}
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          "p-2 text-sm rounded-lg transition-all duration-200 min-h-[80px] flex flex-col",
                          isCurrentMonth 
                            ? "text-slate-800 hover:bg-slate-100" 
                            : "text-slate-400",
                          isDayToday && "bg-primary-50 border-2 border-primary-200",
                          isSelected && !isDayToday && "bg-slate-100 border-2 border-slate-300",
                          dayAssignments.length > 0 && "font-medium"
                        )}
                      >
                        <span className={cn(
                          "flex-shrink-0",
                          isDayToday && "text-primary-600 font-bold"
                        )}>
                          {format(day, "d")}
                        </span>
                        
                        {/* Assignment indicators */}
                        <div className="flex-1 mt-1 space-y-1 overflow-hidden">
                          {dayAssignments.slice(0, 2).map((assignment) => {
                            const course = getCourseById(assignment.courseId)
                            return (
                              <div
                                key={assignment.Id}
                                className="w-full h-1.5 rounded-full opacity-75"
                                style={{ backgroundColor: course?.color || "#64748b" }}
                                title={`${assignment.title} - ${course?.name}`}
                              />
                            )
                          })}
                          
                          {dayAssignments.length > 2 && (
                            <div className="text-xs text-slate-500 font-medium">
                              +{dayAssignments.length - 2} more
                            </div>
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </Card.Content>
            </Card>
          </motion.div>

          {/* Selected Date Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Selected Date Header */}
            <Card className="premium-card">
              <Card.Header>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {format(selectedDate, "EEEE")}
                  </h3>
                  <p className="text-2xl font-bold gradient-text">
                    {format(selectedDate, "MMM d")}
                  </p>
                  <p className="text-sm text-slate-500">
                    {format(selectedDate, "yyyy")}
                  </p>
                </div>
              </Card.Header>
            </Card>

            {/* Selected Date Assignments */}
            <Card className="premium-card">
              <Card.Header>
                <h4 className="text-md font-semibold text-slate-800">
                  Assignments Due
                </h4>
              </Card.Header>
              <Card.Content>
                {(() => {
                  const dayAssignments = getAssignmentsForDate(selectedDate)
                  
                  if (dayAssignments.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <ApperIcon name="Calendar" size={32} className="text-slate-400 mx-auto mb-3" />
                        <p className="text-sm text-slate-500">
                          No assignments due on this day
                        </p>
                      </div>
                    )
                  }
                  
                  return (
                    <div className="space-y-3">
                      {dayAssignments.map((assignment, index) => {
                        const course = getCourseById(assignment.courseId)
                        return (
                          <motion.div
                            key={assignment.Id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                              "p-3 rounded-lg border",
                              assignment.completed 
                                ? "bg-success-50 border-success-200" 
                                : "bg-white border-slate-200"
                            )}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                                style={{ backgroundColor: course?.color || "#64748b" }}
                              />
                              
                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  "font-medium text-sm",
                                  assignment.completed 
                                    ? "line-through text-slate-500" 
                                    : "text-slate-800"
                                )}>
                                  {assignment.title}
                                </p>
                                
                                {course && (
                                  <p className="text-xs text-slate-500 mt-1">
                                    {course.name}
                                  </p>
                                )}
                                
                                <div className="flex items-center mt-2 space-x-2">
                                  <Badge 
                                    variant={
                                      assignment.priority === "high" ? "danger" : 
                                      assignment.priority === "medium" ? "warning" : "success"
                                    }
                                    size="sm"
                                  >
                                    {assignment.priority}
                                  </Badge>
                                  
                                  {assignment.completed && (
                                    <Badge variant="success" size="sm">
                                      <ApperIcon name="Check" size={12} className="mr-1" />
                                      Done
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )
                })()}
              </Card.Content>
            </Card>

            {/* Quick Stats */}
            <Card className="premium-card">
              <Card.Header>
                <h4 className="text-md font-semibold text-slate-800">
                  This Month
                </h4>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {(() => {
                    const monthAssignments = assignments.filter(a => 
                      isSameMonth(parseISO(a.dueDate), currentDate)
                    )
                    const completed = monthAssignments.filter(a => a.completed).length
                    const total = monthAssignments.length
                    const pending = total - completed
                    
                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Total</span>
                          <span className="font-bold text-slate-800">{total}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Completed</span>
                          <span className="font-bold text-success-600">{completed}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Pending</span>
                          <span className="font-bold text-warning-600">{pending}</span>
                        </div>
                        
                        {total > 0 && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-slate-600">Progress</span>
                              <span className="font-medium text-slate-800">
                                {Math.round((completed / total) * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(completed / total) * 100}%` }}
                                transition={{ duration: 1 }}
                                className="h-2 rounded-full bg-gradient-to-r from-success-500 to-primary-500"
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Calendar