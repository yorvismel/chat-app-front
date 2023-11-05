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

const initialState = {
  personalChats: [],
  users: [],
  currentUser: "",
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_PERSONAL_CHAT_SUCCESS:
      return {
        ...state,
        personalChats: [...state.personalChats, action.payload],
      };
    case CREATE_PERSONAL_CHAT_FAILURE:
      return state;

    case GET_PERSONAL_CHATS_SUCCESS:
      return {
        ...state,
        personalChats:[...state.personalChats, ...action.payload],
      };
    case GET_PERSONAL_CHATS_FAILURE:
      return state;

    case CREATE_USER_SUCCESS:
      return {
        ...state,
        currentUser: action.payload.userName,
      };
    case CREATE_USER_FAILURE:
      return state;

    case GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
      };
    case GET_ALL_USERS_FAILURE:
      return state;

    default:
      return state;
  }
};

export default rootReducer;
