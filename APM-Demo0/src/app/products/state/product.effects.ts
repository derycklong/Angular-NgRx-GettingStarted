import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, mergeMap, tap } from 'rxjs/operators';
import { ProductService } from '../product.service';
import { ProductApiActions, ProductPageActions } from './actions/index'

@Injectable()
export class ProductEffects {
  constructor(
    private actions$: Actions,
    private productService: ProductService
  ) {}

  loadProduct$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductPageActions.loadProducts), //will only proceed if it matches the action
      mergeMap(() =>
        this.productService.getProducts().pipe(
          map((products) => ProductApiActions.loadProductsSuccess({ products })),
          catchError((error) =>
            of(ProductApiActions.loadProductsFailure({ error }))
          )
        )
      )
    );
  });

  updateProduct$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductPageActions.updateProduct),
      concatMap((action) =>
        this.productService.updateProduct(action.product).pipe(
          map((product) => ProductApiActions.updateProductSuccess({ product })),
          catchError((error) =>
            of(ProductApiActions.updateProductFailure({ error }))
          )
        )
      )
    );
  });

  createProduct$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductPageActions.createProduct),
      concatMap((action) =>
        this.productService.createProduct(action.product).pipe(
          map((product) => ProductApiActions.createProductSuccess({ product })),
          catchError((error) =>
            of(ProductApiActions.createProductFailure({ error }))
          )
        )
      )
    );
  });

  deleteProduct$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductPageActions.deleteProduct),
      concatMap((action) =>
        this.productService.deleteProduct(action.productId).pipe(
          map(() => ProductApiActions.deleteProductSuccess({ productId: action.productId })),
          catchError((error) =>
            of(ProductApiActions.deleteProductFailure({ error }))
          )
        )
      )
    );
  });
}
