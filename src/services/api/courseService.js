import courseData from "@/services/mockData/courses.json"

let courses = [...courseData]

export const courseService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...courses]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const course = courses.find(c => c.Id === parseInt(id))
    if (!course) {
      throw new Error("Course not found")
    }
    return { ...course }
  },

  async create(courseData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const maxId = courses.length > 0 ? Math.max(...courses.map(c => c.Id)) : 0
    const newCourse = {
      ...courseData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    }
    courses.push(newCourse)
    return { ...newCourse }
  },

  async update(id, courseData) {
    await new Promise(resolve => setTimeout(resolve, 350))
    const index = courses.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Course not found")
    }
    courses[index] = { ...courses[index], ...courseData }
    return { ...courses[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = courses.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Course not found")
    }
    courses.splice(index, 1)
    return { success: true }
  }
}