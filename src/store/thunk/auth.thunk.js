/* eslint-disable */
import { toast } from "react-toastify";

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// import { setUser } from "../reducer/auth.reducer";
// import { setUser } from "../reducer/auth.reducer";

const login = createAsyncThunk(
  "auth/login",
  async ({ email, password, navigate }, { dispatch }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/members/login`,
        { email, password }
      );
      // dispatch(setUser(response.data));
      navigate("/");
      localStorage.setItem("userData", JSON.stringify(response.data));
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.error(error, "error");
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  }
);

export default login;
