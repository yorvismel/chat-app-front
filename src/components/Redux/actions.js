// actions.js
import axios from "axios";
import {
  ADD_USER,
  ADD_USER_FAILURE,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  SEND_MESSAGE,
  FETCH_CHATS_SUCCESS,
  FETCH_CHATS_FAILURE,
  SEND_MESSAGE_FAILURE,
} from "./action-types";

export const addUser = (userName) => {
  return async (dispatch) => {
    try {
      const response = await axios.post("https://chatwebapp-p1px.onrender.com/users", {
        userName,
        
      });
      dispatch({
        type: ADD_USER,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: ADD_USER_FAILURE,
        payload: error,
      });
    }
  };
};

export const fetchUsers = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get("https://chatwebapp-p1px.onrender.com/users");
      const users = response.data;
      dispatch({
        type: FETCH_USERS_SUCCESS,
        payload: users,
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: FETCH_USERS_FAILURE,
      });
    }
  };
};

export const sendMessage = (userNameSend, message) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `https://chatwebapp-p1px.onrender.com/chats/group/${userNameSend}`,
        { message }
      );
      const newChat = response.data;
      dispatch({
        type: SEND_MESSAGE,
        payload: newChat,
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: SEND_MESSAGE_FAILURE,
        payload: "Error al enviar el mensaje",
      });
    }
  };
};

export const fetchChats = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`https://chatwebapp-p1px.onrender.com/chats/group`);
      const chats = response.data;
      console.log("este es el chat", chats);
      dispatch({
        type: FETCH_CHATS_SUCCESS,
        payload: chats,
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: FETCH_CHATS_FAILURE,
      });
    }
  };
};
