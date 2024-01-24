import axios from "axios";
import { toast } from "react-toastify";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { TeamsUrl , Add_TeamsUrl } from "../../API/Urls";

const notifyLogout = () => {
  toast.error("You Have been Logout");
};

export const getTeams = createAsyncThunk("data/getTeams", async () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  try {
    const response = await axios.get(TeamsUrl, {
      headers: {
        Authorization: `Bearer ${userData.accesstoken}`,
      },
    });
    toast.success(response.data.message);
    return response?.data;
  } catch (err) {
    console.log("TOken Error", err);
    if (err.message === "Request failed with status code 401") {
      notifyLogout();
      // window.location.reload();
      localStorage.clear();
    }
    return err;
  }
});

export const addTeam = createAsyncThunk(
  "data/addTeams",
  async ({ teamData }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    try {
      const response = await axios.post(Add_TeamsUrl, teamData, {
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

export const editTeam = createAsyncThunk("data/editTeams", async (teamData) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  try {
    const response = await axios.patch(
      `${TeamsUrl}/${teamData._id}`,
      teamData,
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
});

export const deleteTeam = createAsyncThunk("data/deleteTeam", async (id) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
  
    await axios.delete(`${TeamsUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${userData.accesstoken}`,
      },
    });
  });
  
