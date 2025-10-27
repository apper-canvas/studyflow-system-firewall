import { getApperClient } from "@/services/apperClient"

export const courseService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('course_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "credits_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "ASC"}]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.getRecordById('course_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "credits_c"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Course not found")
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error)
      throw new Error("Course not found")
    }
  },

  async create(courseData) {
    try {
      const apperClient = getApperClient()
      const params = {
        records: [{
          Name: courseData.name || courseData.name_c,
          name_c: courseData.name || courseData.name_c,
          instructor_c: courseData.instructor || courseData.instructor_c,
          schedule_c: courseData.schedule || courseData.schedule_c,
          color_c: courseData.color || courseData.color_c,
          semester_c: courseData.semester || courseData.semester_c,
          credits_c: parseInt(courseData.credits || courseData.credits_c)
        }]
      }

      const response = await apperClient.createRecord('course_c', params)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to create course: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || "Failed to create course")
        }
        return response.results[0].data
      }

      return response.data
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, courseData) {
    try {
      const apperClient = getApperClient()
      const params = {
        records: [{
          Id: parseInt(id),
          Name: courseData.name || courseData.name_c,
          name_c: courseData.name || courseData.name_c,
          instructor_c: courseData.instructor || courseData.instructor_c,
          schedule_c: courseData.schedule || courseData.schedule_c,
          color_c: courseData.color || courseData.color_c,
          semester_c: courseData.semester || courseData.semester_c,
          credits_c: parseInt(courseData.credits || courseData.credits_c)
        }]
      }

      const response = await apperClient.updateRecord('course_c', params)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to update course: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || "Failed to update course")
        }
        return response.results[0].data
      }

      return response.data
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('course_c', params)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to delete course: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || "Failed to delete course")
        }
      }

      return { success: true }
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error)
      throw error
    }
  }
}