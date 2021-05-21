import {
  createFeatureSelector,
  createSelector,
  on,
} from '@ngrx/store';
import * as AppState from '../../state/app.state';
import { ProductState } from './product.reducer';


//1)To work in Tandem with Lazy Loading, so that product reducer is loaded when needed.
//2)For features that is not lazy loaded, add in the main appstate
//3)For features with lazy loading, add below extension to extend the main appstate in their
//own reducers.
export interface State extends AppState.State {
  products: ProductState;
}

//Pure function to select and create selector so in case the store structure is change, only need to change
//here, instead of going through the codes to hunt for the selectors
const getProductFeatureState = createFeatureSelector<ProductState>('products');

export const getShowProductCode = createSelector(
  getProductFeatureState,
  (state) => state.showProductCode
);

export const getCurrentProductId = createSelector(
  getProductFeatureState,
  (state) => state.currentProductId
);

export const getCurrentProduct = createSelector(
  getProductFeatureState,
  getCurrentProductId,
  (state, getCurrentProductId) => {
    if (getCurrentProductId === 0) {
      return {
        id: 0,
        productName: '',
        productCode: 'New',
        description: '',
        starRating: 0,
      };
    } else {
      return getCurrentProductId
        ? state.products.find((p) => p.id == getCurrentProductId)
        : null;
    }
  }
);

export const getProducts = createSelector(
  getProductFeatureState,
  (state) => state.products
);

export const getError = createSelector(
  getProductFeatureState,
  (state) => state.error
);
