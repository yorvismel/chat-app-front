// reducer.js
import {
  SEND_MESSAGE,
  FETCH_CHATS_SUCCESS,
  FETCH_CHATS_FAILURE,
  ADD_USER,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  ADD_USER_FAILURE,
  SEND_MESSAGE_FAILURE,
} from "./action-types";

const initialState = {
  chats: [],
  loading: false,
  error: null,
  users: [],
  currentUser: "",
  loadingUsers: "",
  errorUsers: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_MESSAGE:
      return {
        ...state,
        chats: [...state.chats, action.payload],
      };
    case SEND_MESSAGE_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case FETCH_CHATS_SUCCESS:
      return {
        ...state,
        chats: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_CHATS_FAILURE:
      return {
        ...state,
        loading: false,
        error: "Error al recuperar los chats.",
      };
    case ADD_USER:
      return {
        ...state,
        currentUser: action.payload.userName,
      };
    // En tu reducer.js

    case ADD_USER_FAILURE:
      return {
        ...state,
        errorUsers: action.payload,
      };

    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
      };
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        loadingUsers: false,
        errorUsers: "Error al recuperar los usuarios.",
        users: [],
      };
    default:
      return state;
  }
};

export default rootReducer;
