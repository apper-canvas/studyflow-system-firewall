import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Error = ({ 
  message = "Something went wrong", 
  onRetry = null, 
  type = "general" 
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case "network":
        return {
          icon: "WifiOff",
          title: "Connection Error",
          description: "Please check your internet connection and try again.",
          color: "text-orange-500"
        }
      case "notfound":
        return {
          icon: "FileX",
          title: "No Data Found",
          description: "We couldn't find what you're looking for.",
          color: "text-blue-500"
        }
      case "permission":
        return {
          icon: "Lock",
          title: "Access Denied",
          description: "You don't have permission to access this resource.",
          color: "text-red-500"
        }
      default:
        return {
          icon: "AlertTriangle",
          title: "Oops! Something went wrong",
          description: "An unexpected error occurred. Please try again.",
          color: "text-red-500"
        }
    }
  }

  const config = getErrorConfig()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring", bounce: 0.4 }}
        className={`w-20 h-20 ${config.color} mb-6`}
      >
        <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-full flex items-center justify-center shadow-lg">
          <ApperIcon name={config.icon} size={40} className={config.color} />
        </div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-xl font-semibold text-slate-800 mb-3"
      >
        {config.title}
      </motion.h3>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-2 mb-8"
      >
        <p className="text-slate-600 leading-relaxed max-w-md">
          {config.description}
        </p>
        {message !== "Something went wrong" && (
          <p className="text-sm text-slate-500 font-mono bg-slate-100 px-3 py-2 rounded-lg max-w-md">
            {message}
          </p>
        )}
      </motion.div>

      {onRetry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            onClick={onRetry}
            variant="primary"
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 text-xs text-slate-400"
      >
        If this problem persists, please contact support
      </motion.div>
    </motion.div>
  )
}

export default Error