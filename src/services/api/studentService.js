import { getApperClient } from '@/services/apperClient';

export const studentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords('student_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(studentId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } }
        ]
      };

      const response = await apperClient.getRecordById('student_c', studentId, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${studentId}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(studentData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const payload = {
        records: [{
          Name: studentData.Name || '',
          Tags: studentData.Tags || '',
          first_name_c: studentData.first_name_c || '',
          last_name_c: studentData.last_name_c || '',
          email_c: studentData.email_c || ''
        }]
      };

      const response = await apperClient.createRecord('student_c', payload);

      if (!response.success) {
        console.error(response.message);
        return { success: false, message: response.message };
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create student:`, failed);
          const errorMsg = failed[0].message || 'Failed to create student';
          return { success: false, message: errorMsg };
        }

        return { success: true, data: response.results[0].data };
      }

      return { success: false, message: 'Unknown error occurred' };
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error);
      return { success: false, message: error?.response?.data?.message || error.message };
    }
  },

  async update(studentId, studentData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields plus Id
      const payload = {
        records: [{
          Id: parseInt(studentId),
          Name: studentData.Name || '',
          Tags: studentData.Tags || '',
          first_name_c: studentData.first_name_c || '',
          last_name_c: studentData.last_name_c || '',
          email_c: studentData.email_c || ''
        }]
      };

      const response = await apperClient.updateRecord('student_c', payload);

      if (!response.success) {
        console.error(response.message);
        return { success: false, message: response.message };
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update student:`, failed);
          const errorMsg = failed[0].message || 'Failed to update student';
          return { success: false, message: errorMsg };
        }

        return { success: true, data: response.results[0].data };
      }

      return { success: false, message: 'Unknown error occurred' };
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error);
      return { success: false, message: error?.response?.data?.message || error.message };
    }
  },

  async delete(studentId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [parseInt(studentId)]
      };

      const response = await apperClient.deleteRecord('student_c', params);

      if (!response.success) {
        console.error(response.message);
        return { success: false, message: response.message };
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete student:`, failed);
          const errorMsg = failed[0].message || 'Failed to delete student';
          return { success: false, message: errorMsg };
        }

        return { success: true };
      }

      return { success: false, message: 'Unknown error occurred' };
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error);
      return { success: false, message: error?.response?.data?.message || error.message };
    }
  }
};