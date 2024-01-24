import axios from "axios";
import { toast } from "react-toastify";
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  GET_DEPARTMENTS,
  DELETE_DEPARTMENTS,
  UPDATE_DEPARTMENTS,
} from "../../API/Urls";

const notifyLogout = () => {
  toast.error("You Have been Logout");
};

// Get All Departments:
const getDepartments = createAsyncThunk(
  "departments/getDepartments",
  async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    try {
      const response = await axios.get(GET_DEPARTMENTS, {
        headers: {
          Authorization: `Bearer ${userData.accesstoken}`,
        },
      });
      return response?.data;
    } catch (err) {
      if (err.message === "Request failed with status code 401") {
        notifyLogout();
        window.location.reload();
        localStorage.clear();
      }
      return err;
    }
  }
);

// Async thunk for adding departments
const addDepartments = createAsyncThunk(
    "departments/addDepartments",
    async (value) => {
      // Retrieve user data from localStorage
      const userData = JSON.parse(localStorage.getItem("userData"));
  
      // Make a POST request to the API
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/department/create`,
        {
          name: value.name,
          departmentHead: value.departmentHead,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.accesstoken}`,
          },
        }
      );
  
      return { message: response.data.message, data: response.data };
    }
  );
  

const deleteDepartments = createAsyncThunk(
  "departments/deleteDepartments",
  async (id) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    try {
      const response = await axios.delete(`${DELETE_DEPARTMENTS  }/${id}`, {
        headers: {
          Authorization: `Bearer ${userData.accesstoken}`,
        },
      });
      return response?.data;
    } catch (err) {
      return err;
    }
  }
);

// Update departments:
const updateDepartments = createAsyncThunk(
  "departments/updateDepartments",
  async ({ value, departmentId }) => {
    // console.log("Id", id);
    const userData = JSON.parse(localStorage.getItem("userData"));
    try {
      const response = await axios.patch(
        `${UPDATE_DEPARTMENTS  }/${departmentId}`,
        value,
        {
          headers: {
            Authorization: `Bearer ${userData.accesstoken}`,
          },
        }
      );
      return response?.data;
    } catch (err) {
      return err;
    }
  }
);

export { addDepartments, getDepartments, deleteDepartments, updateDepartments };
