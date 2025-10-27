import assignmentData from "@/services/mockData/assignments.json"

let assignments = [...assignmentData]

export const assignmentService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...assignments]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const assignment = assignments.find(a => a.Id === parseInt(id))
    if (!assignment) {
      throw new Error("Assignment not found")
    }
    return { ...assignment }
  },

  async getByCourse(courseId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return assignments.filter(a => a.courseId === parseInt(courseId))
  },

  async create(assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const maxId = assignments.length > 0 ? Math.max(...assignments.map(a => a.Id)) : 0
    const newAssignment = {
      ...assignmentData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      completed: false,
      grade: null
    }
    assignments.push(newAssignment)
    return { ...newAssignment }
  },

  async update(id, assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 350))
    const index = assignments.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Assignment not found")
    }
    assignments[index] = { ...assignments[index], ...assignmentData }
    return { ...assignments[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = assignments.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Assignment not found")
    }
    assignments.splice(index, 1)
    return { success: true }
  },

  async toggleComplete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = assignments.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Assignment not found")
    }
    assignments[index].completed = !assignments[index].completed
    return { ...assignments[index] }
  }
}