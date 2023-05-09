import { SET_LIST_DATA } from './constant';

export const tableListData = (data = [], action) => {
  switch (action.type) {
    case SET_LIST_DATA:
      return action.data.data;

    default:
      return data;
  }
};
