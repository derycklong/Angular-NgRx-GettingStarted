import { createAction, props } from '@ngrx/store';
import { Product } from '../../product';

export const loadProductsSuccess = createAction(
  '[Product API] Load Success',
  props<{ products: Product[] }>()
);

export const loadProductsFailure = createAction(
  '[Product API] Load Fail',
  props<{ error: string }>()
);

export const updateProductSuccess = createAction(
  '[Product API] Update Product Success',
  props<{ product: Product }>()
);

export const updateProductFailure = createAction(
  '[Product API] Update Product Fail',
  props<{ error: string }>()
);

export const createProductSuccess = createAction(
  '[Product API] Add Product Success',
  props<{ product: Product }>()
);

export const createProductFailure = createAction(
  '[Product API] Add Product Failure',
  props<{ error: string }>()
);

export const deleteProductSuccess = createAction(
  '[Product API] Delete Product Success',
  props<{ productId: number }>()
);

export const deleteProductFailure = createAction(
  '[Product API] Delete Product Failure',
  props<{ error: string }>()
);
