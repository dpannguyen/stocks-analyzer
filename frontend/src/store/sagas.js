import {all} from 'redux-saga/effects'
import LayoutSaga from './layout/saga';
//public

export default function* rootSaga() {
  yield all([
    LayoutSaga()
  ])
}