import {
  createAction,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import * as UserAction from './user.action'

export interface UserState {
  maskUserName: boolean;
}

const initialState: UserState = {
  maskUserName: false,
};

const getUserFeatureState = createFeatureSelector<UserState>('user');
export const getMaskUserName = createSelector(
  getUserFeatureState,
  (state) => state.maskUserName
);

export const userReducer = createReducer(
  initialState,
  on(UserAction.maskUserName, (state) => {
    console.log(state);
    return {
      ...state,
      maskUserName: !state.maskUserName,
    };
  })
);
