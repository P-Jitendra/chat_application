import { v4 as uuid } from "uuid";
const initialState = [];

export default function reducer(state = initialState, action) {
  if (action.type === "loggedUser") {
    const findUser = state.find((user) => user.email === action.email);
    if (findUser === undefined) {
      return [...state, { id: uuid(), email: action.email, active: true }];
    }
    return state.map((user) => {
      if (user.email !== action.email) {
        return user;
      }
      return { ...user, active: !user.active };
    });
  } else if (action.type === "loggedOutUser") {
    return state.map((user) => {
      if (user.email !== action.email) {
        return user;
      }
      return { ...user, active: !user.active };
    });
  } else {
    //console.log(`Unhandled action : ${JSON.stringify(action)}`);
    return state;
  }
}
