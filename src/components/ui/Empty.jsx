import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "No data available", 
  description = "Get started by adding some content",
  actionText = "Add New",
  onAction = null,
  icon = "Inbox",
  type = "general"
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case "courses":
        return {
          icon: "BookOpen",
          title: "No courses yet",
          description: "Start by adding your first course to begin organizing your academic schedule.",
          actionText: "Add Course",
          gradient: "from-blue-500 to-purple-600"
        }
      case "assignments":
        return {
          icon: "ClipboardList",
          title: "No assignments found",
          description: "Keep track of your homework and projects by adding assignments here.",
          actionText: "Add Assignment",
          gradient: "from-green-500 to-blue-600"
        }
      case "grades":
        return {
          icon: "TrendingUp",
          title: "No grades to display",
          description: "Your grade calculations will appear here once you add assignments with scores.",
          actionText: "View Assignments",
          gradient: "from-purple-500 to-pink-600"
        }
      case "calendar":
        return {
          icon: "Calendar",
          title: "No events scheduled",
          description: "Your upcoming assignments and course schedules will appear here.",
          actionText: "Add Event",
          gradient: "from-indigo-500 to-cyan-600"
        }
      case "search":
        return {
          icon: "Search",
          title: "No results found",
          description: "Try adjusting your search terms or filters to find what you're looking for.",
          actionText: "Clear Filters",
          gradient: "from-orange-500 to-red-600"
        }
      default:
        return {
          icon: icon,
          title: title,
          description: description,
          actionText: actionText,
          gradient: "from-slate-500 to-slate-600"
        }
    }
  }

  const config = getEmptyConfig()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.2, 
          type: "spring", 
          bounce: 0.5 
        }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full flex items-center justify-center shadow-xl">
          <div className={`w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-full flex items-center justify-center`}>
            <ApperIcon 
              name={config.icon} 
              size={32} 
              className="text-white" 
            />
          </div>
        </div>
        
        {/* Decorative elements */}
        <motion.div
          animate={{ 
            y: [-2, 2, -2],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg"
        />
        <motion.div
          animate={{ 
            y: [2, -2, 2],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute -bottom-1 -left-3 w-3 h-3 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full shadow-lg"
        />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-2xl font-bold text-slate-800 mb-3 gradient-text"
      >
        {config.title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-slate-600 leading-relaxed max-w-md mb-8"
      >
        {config.description}
      </motion.p>

      {onAction && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            onClick={onAction}
            variant="primary"
            size="lg"
            className={`bg-gradient-to-r ${config.gradient} hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg`}
          >
            <ApperIcon name="Plus" size={18} className="mr-2" />
            {config.actionText}
          </Button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8 flex items-center space-x-2 text-sm text-slate-400"
      >
        <ApperIcon name="Lightbulb" size={16} />
        <span>Tip: Stay organized and never miss a deadline!</span>
      </motion.div>
    </motion.div>
  )
}

export default Empty