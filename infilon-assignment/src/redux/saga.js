import { LIST_DATA, SET_LIST_DATA } from './constant';
import { put, takeEvery } from 'redux-saga/effects';

function* getListData() {
  let data = yield fetch('https://reqres.in/api/users?page=1');
  data = yield data.json();
  yield put({ type: SET_LIST_DATA, data });
}

function* productSaga() {
  yield takeEvery(LIST_DATA, getListData);
}

export default productSaga;
