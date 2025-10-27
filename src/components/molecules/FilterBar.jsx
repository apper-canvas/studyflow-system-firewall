import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import Badge from "@/components/atoms/Badge"

const FilterBar = ({ 
  courses = [], 
  onFilterChange = () => {},
  activeFilters = {},
  showCourseFilter = true,
  showPriorityFilter = true,
  showStatusFilter = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...activeFilters,
      [key]: value === "all" ? "" : value
    })
  }

  const clearFilters = () => {
    onFilterChange({})
  }

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => value !== "" && value !== null).length
  }

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" }
  ]

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Filter" size={20} className="text-slate-500" />
            <span className="font-medium text-slate-700">Filters</span>
            {getActiveFilterCount() > 0 && (
              <Badge variant="primary" size="sm">
                {getActiveFilterCount()}
              </Badge>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {showCourseFilter && (
              <Select
                value={activeFilters.courseId || "all"}
                onChange={(e) => handleFilterChange("courseId", e.target.value)}
                className="w-48"
              >
                <option value="all">All Courses</option>
                {courses.map((course) => (
                  <option key={course.Id} value={course.Id}>
                    {course.name}
                  </option>
                ))}
              </Select>
            )}

            {showPriorityFilter && (
              <Select
                value={activeFilters.priority || "all"}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
                className="w-40"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}

            {showStatusFilter && (
              <Select
                value={activeFilters.status || "all"}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-36"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-slate-500 hover:text-slate-700"
            >
              <ApperIcon name="X" size={16} className="mr-1" />
              Clear
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden"
          >
            <ApperIcon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
            />
          </Button>
        </div>
      </div>

      {/* Mobile expanded filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 md:hidden">
          {showCourseFilter && (
            <Select
              label="Course"
              value={activeFilters.courseId || "all"}
              onChange={(e) => handleFilterChange("courseId", e.target.value)}
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.Id} value={course.Id}>
                  {course.name}
                </option>
              ))}
            </Select>
          )}

          {showPriorityFilter && (
            <Select
              label="Priority"
              value={activeFilters.priority || "all"}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}

          {showStatusFilter && (
            <Select
              label="Status"
              value={activeFilters.status || "all"}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </div>
      )}
    </div>
  )
}

export default FilterBar