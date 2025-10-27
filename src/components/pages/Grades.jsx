import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Courses from "@/components/pages/Courses";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import { cn } from "@/utils/cn";

const Grades = () => {
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState("all")

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
    const id = typeof courseId === 'object' ? courseId.Id : courseId
    return courses.find(c => c.Id === id)
  }

const calculateCourseGrade = (courseId) => {
    const courseAssignments = assignments.filter(a => {
      const assignmentCourseId = typeof a.course_id_c === 'object' ? a.course_id_c.Id : a.course_id_c
      return assignmentCourseId === courseId && a.grade_c !== null
    })
    
    if (courseAssignments.length === 0) return null
    
    const totalWeight = courseAssignments.reduce((sum, a) => sum + a.weight_c, 0)
    const weightedSum = courseAssignments.reduce((sum, a) => sum + (a.grade_c * a.weight_c), 0)
    
    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : null
  }

const calculateOverallGPA = () => {
    const courseGrades = courses.map(course => {
      const grade = calculateCourseGrade(course.Id)
      return grade !== null ? { grade, credits: course.credits_c } : null
    }).filter(Boolean)
    
    if (courseGrades.length === 0) return 0
    
    const totalCredits = courseGrades.reduce((sum, c) => sum + c.credits, 0)
    const totalGradePoints = courseGrades.reduce((sum, c) => {
      const gradePoint = convertToGradePoint(c.grade)
      return sum + (gradePoint * c.credits)
    }, 0)
    
    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0
  }

  const convertToGradePoint = (percentage) => {
    if (percentage >= 97) return 4.0
    if (percentage >= 93) return 3.7
    if (percentage >= 90) return 3.3
    if (percentage >= 87) return 3.0
    if (percentage >= 83) return 2.7
    if (percentage >= 80) return 2.3
    if (percentage >= 77) return 2.0
    if (percentage >= 73) return 1.7
    if (percentage >= 70) return 1.3
    if (percentage >= 67) return 1.0
    if (percentage >= 65) return 0.7
    return 0.0
  }

  const getLetterGrade = (percentage) => {
    if (percentage >= 97) return "A+"
    if (percentage >= 93) return "A"
    if (percentage >= 90) return "A-"
    if (percentage >= 87) return "B+"
    if (percentage >= 83) return "B"
    if (percentage >= 80) return "B-"
    if (percentage >= 77) return "C+"
    if (percentage >= 73) return "C"
    if (percentage >= 70) return "C-"
    if (percentage >= 67) return "D+"
    if (percentage >= 65) return "D"
    return "F"
  }

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "success"
    if (percentage >= 80) return "warning"
    if (percentage >= 70) return "orange"
    return "danger"
  }

const filteredAssignments = selectedCourse === "all" 
    ? assignments.filter(a => a.grade_c !== null)
    : assignments.filter(a => {
        const courseId = typeof a.course_id_c === 'object' ? a.course_id_c.Id : a.course_id_c
        return courseId.toString() === selectedCourse && a.grade_c !== null
      })
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

const overallGPA = calculateOverallGPA();
  const hasGradedAssignments = assignments.some(a => a.grade_c !== null)
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
            Grade Center
          </h1>
          <p className="text-slate-600">
            Track your academic performance and calculate your GPA
          </p>
        </motion.div>

        {!hasGradedAssignments ? (
          <Empty 
            type="grades"
            title="No grades available"
            description="Your grades will appear here once assignments are scored. Complete some assignments to see your progress!"
            actionText="View Assignments"
            onAction={() => window.location.href = "/assignments"}
          />
        ) : (
          <>
            {/* Overview Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              {/* Overall GPA */}
{/* Overall GPA */}
              <Card className="premium-card">
                <Card.Content>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ApperIcon name="Award" size={28} className="text-white" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Overall GPA</p>
                    <p className="text-3xl font-bold gradient-text count-up">
                      {overallGPA}
                    </p>
                    <p className="text-xs text-slate-500">out of 4.0</p>
                  </div>
                </Card.Content>
              </Card>

              {/* Top Course Cards */}
              {courses.slice(0, 3).map((course, index) => {
                const grade = calculateCourseGrade(course.Id)
                if (grade === null) return null
                
                return (
                  <Card key={course.Id} className="premium-card">
                    <Card.Content>
                      <div className="text-center">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                          style={{ backgroundColor: course.color_c || '#64748b' }}
                        >
                          <ApperIcon name="BookOpen" size={20} className="text-white" />
                        </div>
                        <p className="text-sm font-medium text-slate-600 mb-1 truncate">
                          {course.name_c}
                        </p>
                        <p className="text-2xl font-bold text-slate-800 count-up">
                          {grade}%
                        </p>
                        <p className="text-xs text-slate-500">
                          {course.credits_c} credits
                        </p>
                      </div>
                    </Card.Content>
                  </Card>
)
              })}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Course Breakdown */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
<Card className="premium-card">
                  <Card.Header>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-800">
                        Grade Breakdown
                      </h3>
                      <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                      >
                        <option value="all">All Courses</option>
                        {courses.map((course) => (
                          <option key={course.Id} value={course.Id.toString()}>
                            {course.name_c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-4">
                      {filteredAssignments.length === 0 ? (
                        <div className="text-center py-8">
                          <ApperIcon name="BookOpen" size={32} className="text-slate-400 mx-auto mb-3" />
                          <p className="text-slate-500">
                            No graded assignments for the selected course
                          </p>
                        </div>
) : (
                        filteredAssignments.map((assignment, index) => {
                          const course = getCourseById(assignment.course_id_c)
                          return (
                            <motion.div
                              key={assignment.Id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center space-x-4 p-4 bg-white border border-slate-200 rounded-lg"
                            >
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: course?.color_c || "#64748b" }}
                              />
                              
                              <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-slate-800 truncate">
                                {assignment.title_c}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                {course && (
                                  <Badge variant="outline" size="sm">
                                    {course.name_c}
                                  </Badge>
                                )}
                                <Badge variant="outline" size="sm">
                                  {assignment.weight_c}% weight
                                </Badge>
                              </div>
</div>

                              <div className="flex items-center space-x-3 flex-shrink-0">
                              <Badge
                                variant={getGradeColor(assignment.grade_c)}
                                size="lg"
                                className="font-bold"
                              >
                                {assignment.grade_c}%
                              </Badge>
                              <div className="text-center">
                                <div className="text-lg font-bold text-slate-800">
                                  {getLetterGrade(assignment.grade_c)}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {convertToGradePoint(assignment.grade_c)} pts
                                </div>
                              </div>
                            </div>
                            </motion.div>
                          )
                        })
                      )}
                    </div>
                  </Card.Content>
                </Card>
              </motion.div>

              {/* Grade Distribution */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                {/* GPA Breakdown */}
                <Card className="premium-card">
                  <Card.Header>
                    <h3 className="text-lg font-semibold text-slate-800">
                      GPA Breakdown
                    </h3>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-4">
                      {courses.map((course) => {
                        const grade = calculateCourseGrade(course.Id)
                        if (grade === null) return null
                        
const gpa = convertToGradePoint(grade)
                        
                        return (
                          <div key={course.Id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: course.color_c }}
                                />
                                <span className="text-sm font-medium text-slate-700 truncate">
                                  {course.name_c}
                                </span>
                              </div>
                              <div className="text-sm font-bold text-slate-800">
                                {gpa.toFixed(1)}
                              </div>
                            </div>
                            
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(gpa / 4) * 100}%` }}
                                transition={{ duration: 1 }}
                                className="h-2 rounded-full"
                                style={{ backgroundColor: course.color_c }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </Card.Content>
                </Card>

                {/* Grade Statistics */}
                <Card className="premium-card">
                  <Card.Header>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Grade Statistics
                    </h3>
                  </Card.Header>
<Card.Content>
                    {(() => {
                      const gradedAssignments = assignments.filter(a => a.grade_c !== null)
                      if (gradedAssignments.length === 0) return null
                      
                      const grades = gradedAssignments.map(a => a.grade_c)
                      const average = Math.round(grades.reduce((sum, g) => sum + g, 0) / grades.length)
                      const highest = Math.max(...grades)
                      const lowest = Math.min(...grades)
                      
                      return (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Average Grade</span>
                            <Badge variant={getGradeColor(average)} size="sm">
                              {average}%
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Highest Grade</span>
                            <Badge variant="success" size="sm">
                              {highest}%
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Lowest Grade</span>
                            <Badge variant={getGradeColor(lowest)} size="sm">
                              {lowest}%
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Total Assignments</span>
                            <span className="font-bold text-slate-800">
                              {gradedAssignments.length}
                            </span>
                          </div>
                        </div>
                      )
                    })()}
                  </Card.Content>
                </Card>

                {/* Academic Standing */}
                <Card className="premium-card">
                  <Card.Header>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Academic Standing
                    </h3>
                  </Card.Header>
                  <Card.Content>
                    {(() => {
                      const gpa = parseFloat(overallGPA)
                      let standing, color, icon
                      
                      if (gpa >= 3.5) {
                        standing = "Dean's List"
                        color = "success"
                        icon = "Award"
                      } else if (gpa >= 3.0) {
                        standing = "Good Standing"
                        color = "primary"
                        icon = "ThumbsUp"
                      } else if (gpa >= 2.0) {
                        standing = "Satisfactory"
                        color = "warning"
                        icon = "AlertCircle"
                      } else {
                        standing = "Academic Probation"
                        color = "danger"
                        icon = "AlertTriangle"
                      }
                      
                      return (
                        <div className="text-center">
                          <div className={`w-16 h-16 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <ApperIcon name={icon} size={28} className="text-white" />
                          </div>
                          <p className="font-bold text-slate-800 mb-1">
                            {standing}
                          </p>
                          <p className="text-sm text-slate-600">
                            Current Status
                          </p>
                        </div>
                      )
                    })()}
                  </Card.Content>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Grades