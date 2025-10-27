import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Illustration */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
            className="relative mb-8"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                <ApperIcon name="BookX" size={48} className="text-white" />
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ 
                y: [-5, 5, -5],
                rotate: [-5, 5, -5]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-warning-400 to-orange-500 rounded-full shadow-lg"
            />
            <motion.div
              animate={{ 
                y: [5, -5, 5],
                rotate: [5, -5, 5]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-2 -left-6 w-6 h-6 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full shadow-lg"
            />
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-6xl font-bold gradient-text mb-4">
              404
            </h1>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              Page Not Found
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Looks like this page decided to skip class! The page you're looking for 
              doesn't exist or has been moved to a different location.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4"
          >
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <ApperIcon name="Home" size={18} className="mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate("/courses")}
                className="flex-1"
              >
                <ApperIcon name="BookOpen" size={16} className="mr-2" />
                View Courses
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/assignments")}
                className="flex-1"
              >
                <ApperIcon name="ClipboardList" size={16} className="mr-2" />
                View Assignments
              </Button>
            </div>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 text-xs text-slate-400"
          >
            <div className="flex items-center justify-center space-x-2">
              <ApperIcon name="Info" size={14} />
              <span>Need help? Check out your dashboard for all available features</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound