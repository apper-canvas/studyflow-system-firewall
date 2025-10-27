import { getApperClient } from "@/services/apperClient"

export const assignmentService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('assignment_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "course_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.getRecordById('assignment_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "course_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "grade_c"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Assignment not found")
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error)
      throw new Error("Assignment not found")
    }
  },

  async create(assignmentData) {
    try {
      const apperClient = getApperClient()
      const params = {
        records: [{
          Name: assignmentData.title || assignmentData.title_c,
          course_id_c: parseInt(assignmentData.courseId || assignmentData.course_id_c?.Id || assignmentData.course_id_c),
          title_c: assignmentData.title || assignmentData.title_c,
          description_c: assignmentData.description || assignmentData.description_c || "",
          due_date_c: assignmentData.dueDate || assignmentData.due_date_c,
          priority_c: assignmentData.priority || assignmentData.priority_c,
          weight_c: parseInt(assignmentData.weight || assignmentData.weight_c || 10),
          completed_c: assignmentData.completed !== undefined ? assignmentData.completed : (assignmentData.completed_c !== undefined ? assignmentData.completed_c : false),
          grade_c: assignmentData.grade !== undefined ? parseInt(assignmentData.grade) : (assignmentData.grade_c !== undefined ? parseInt(assignmentData.grade_c) : null)
        }]
      }

      const response = await apperClient.createRecord('assignment_c', params)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to create assignment: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || "Failed to create assignment")
        }
        return response.results[0].data
      }

      return response.data
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, assignmentData) {
    try {
      const apperClient = getApperClient()
      const params = {
        records: [{
          Id: parseInt(id),
          Name: assignmentData.title || assignmentData.title_c,
          course_id_c: parseInt(assignmentData.courseId || assignmentData.course_id_c?.Id || assignmentData.course_id_c),
          title_c: assignmentData.title || assignmentData.title_c,
          description_c: assignmentData.description || assignmentData.description_c || "",
          due_date_c: assignmentData.dueDate || assignmentData.due_date_c,
          priority_c: assignmentData.priority || assignmentData.priority_c,
          weight_c: parseInt(assignmentData.weight || assignmentData.weight_c || 10),
          completed_c: assignmentData.completed !== undefined ? assignmentData.completed : (assignmentData.completed_c !== undefined ? assignmentData.completed_c : false),
          grade_c: assignmentData.grade !== undefined && assignmentData.grade !== null ? parseInt(assignmentData.grade) : (assignmentData.grade_c !== undefined && assignmentData.grade_c !== null ? parseInt(assignmentData.grade_c) : null)
        }]
      }

      const response = await apperClient.updateRecord('assignment_c', params)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to update assignment: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || "Failed to update assignment")
        }
        return response.results[0].data
      }

      return response.data
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('assignment_c', params)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to delete assignment: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || "Failed to delete assignment")
        }
      }

      return { success: true }
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error)
      throw error
    }
  },

  async toggleComplete(id) {
    try {
      const assignment = await this.getById(id)
      const updatedAssignment = await this.update(id, {
        completed_c: !assignment.completed_c
      })
      return updatedAssignment
    } catch (error) {
      console.error("Error toggling assignment completion:", error?.response?.data?.message || error)
      throw error
    }
  }
}