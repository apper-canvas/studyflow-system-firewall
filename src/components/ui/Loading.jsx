import { motion } from "framer-motion"

const Loading = ({ type = "dashboard" }) => {
  const shimmerVariants = {
    initial: { x: "-100%" },
    animate: { 
      x: "100%",
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
      }
    }
  }

  if (type === "dashboard") {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="relative overflow-hidden bg-gray-200 h-8 w-48 rounded-lg mb-2">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </div>
            <div className="relative overflow-hidden bg-gray-200 h-4 w-64 rounded">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </div>
          </div>

          {/* Cards grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="relative overflow-hidden bg-gray-200 h-4 w-24 rounded mb-4">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  />
                </div>
                <div className="relative overflow-hidden bg-gray-200 h-8 w-16 rounded mb-2">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  />
                </div>
                <div className="relative overflow-hidden bg-gray-200 h-3 w-20 rounded">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Large content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border">
              <div className="relative overflow-hidden bg-gray-200 h-6 w-32 rounded mb-6">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </div>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="relative overflow-hidden bg-gray-200 h-10 w-10 rounded-lg">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                        variants={shimmerVariants}
                        initial="initial"
                        animate="animate"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="relative overflow-hidden bg-gray-200 h-4 w-3/4 rounded">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                          variants={shimmerVariants}
                          initial="initial"
                          animate="animate"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        />
                      </div>
                      <div className="relative overflow-hidden bg-gray-200 h-3 w-1/2 rounded">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                          variants={shimmerVariants}
                          initial="initial"
                          animate="animate"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="relative overflow-hidden bg-gray-200 h-6 w-28 rounded mb-6">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="relative overflow-hidden bg-gray-200 h-16 rounded-lg">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default list loading
  return (
    <div className="space-y-4 p-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center space-x-4">
            <div className="relative overflow-hidden bg-gray-200 h-12 w-12 rounded-lg">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="relative overflow-hidden bg-gray-200 h-4 w-3/4 rounded">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              </div>
              <div className="relative overflow-hidden bg-gray-200 h-3 w-1/2 rounded">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Loading