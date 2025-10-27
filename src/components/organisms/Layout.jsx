import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
const Layout = () => {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
const navigation = [
    { name: "Dashboard", path: "/", icon: "Home" },
    { name: "Courses", path: "/courses", icon: "BookOpen" },
    { name: "Assignments", path: "/assignments", icon: "ClipboardList" },
    { name: "Calendar", path: "/calendar", icon: "Calendar" },
    { name: "Grades", path: "/grades", icon: "TrendingUp" },
    { name: "Students", path: "/students", icon: "Users" }
  ]

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }

  const handleNavigate = (path) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-xl lg:hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="GraduationCap" size={18} className="text-white" />
                </div>
                <h1 className="text-xl font-bold gradient-text">StudyFlow</h1>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            <nav className="p-4 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.path)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-medium transition-all duration-200",
                    isActive(item.path)
                      ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg"
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                  )}
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop layout */}
      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white border-r border-slate-200 shadow-sm">
            <div className="flex items-center px-6 py-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ApperIcon name="GraduationCap" size={22} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">StudyFlow</h1>
                  <p className="text-xs text-slate-500">Student Management</p>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.path)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-medium transition-all duration-200",
                    isActive(item.path)
                      ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg transform scale-105"
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:transform hover:scale-102"
                  )}
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>

<div className="p-4 border-t border-slate-200">
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Student</p>
                      <p className="text-xs text-slate-500">Academic Year 2024</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                  className="w-full text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                >
                  <ApperIcon name="LogOut" size={14} className="mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-64">
          {/* Mobile header */}
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="Menu" size={20} />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-md flex items-center justify-center">
                    <ApperIcon name="GraduationCap" size={14} className="text-white" />
                  </div>
                  <h1 className="text-lg font-bold gradient-text">StudyFlow</h1>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/assignments")}
                className="text-primary-600"
              >
                <ApperIcon name="Plus" size={16} />
              </Button>
            </div>
          </div>

          {/* Page content */}
          <main className="min-h-screen">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout