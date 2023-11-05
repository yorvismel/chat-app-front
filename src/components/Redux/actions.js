import axios from "axios";
import {
  CREATE_PERSONAL_CHAT_SUCCESS,
  CREATE_PERSONAL_CHAT_FAILURE,
  GET_PERSONAL_CHATS_SUCCESS,
  GET_PERSONAL_CHATS_FAILURE,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAILURE,
} from "./action-types";

export const createPersonalChat = (message, userNameSend, userNameReceiver) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `https://chatwebapp-p1px.onrender.com/chat/personal/${userNameSend}/${userNameReceiver}`,
        { message }
      );

      dispatch({
        type: CREATE_PERSONAL_CHAT_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: CREATE_PERSONAL_CHAT_FAILURE,
        payload: error,
      });
    }
  };
};

export const getPersonalChats = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `https://chatwebapp-p1px.onrender.com/chats`
      );
      
      dispatch({
        type: GET_PERSONAL_CHATS_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: GET_PERSONAL_CHATS_FAILURE,
        payload: error,
      });
    }
  };
};


export const createUser = (userName) => {
  return async (dispatch) => {
    try {
      const response = await axios.post("https://chatwebapp-p1px.onrender.com/users", {
        userName,
      });
      dispatch({
        type: CREATE_USER_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: CREATE_USER_FAILURE,
        payload: error,
      });
    }
  };
};

export const getAllUsers = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get("https://chatwebapp-p1px.onrender.com/users");
      dispatch({
        type: GET_ALL_USERS_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: GET_ALL_USERS_FAILURE,
        payload: error,
      });
    }
  };
};
