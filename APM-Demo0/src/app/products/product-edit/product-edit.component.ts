import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { Product } from '../product';
import { GenericValidator } from '../../shared/generic-validator';
import { NumberValidators } from '../../shared/number.validator';


@Component({
  selector: 'pm-product-edit',
  templateUrl: './product-edit.component.html',
})
export class ProductEditComponent implements OnInit {
  pageTitle = 'Product Edit';
  productForm: FormGroup;

  @Input() errorMessage: string;
  @Input() selectedProduct: Product;

  @Output() create = new EventEmitter<Product>();
  @Output() update = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<number>();
  @Output() clearCurrent = new EventEmitter<void>();

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  
  constructor(
    private fb: FormBuilder,
  ) {
    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      productName: {
        required: 'Product name is required.',
        minlength: 'Product name must be at least three characters.',
        maxlength: 'Product name cannot exceed 50 characters.',
      },
      productCode: {
        required: 'Product code is required.',
      },
      starRating: {
        range: 'Rate the product between 1 (lowest) and 5 (highest).',
      },
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    // Define the form group
    this.productForm = this.fb.group({
      productName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      productCode: ['', Validators.required],
      starRating: ['', NumberValidators.range(1, 5)],
      description: '',
    });

    // Watch for changes to the currently selected product
    // this.product$ = this.store
    //   .select(getCurrentProduct)
    //   .pipe(tap((currentProduct) => this.displayProduct(currentProduct)));
    //this.displayProduct(this.selectedProduct)

    // Watch for value changes for validation
    this.productForm.valueChanges.subscribe(
      () =>
        (this.displayMessage = this.genericValidator.processMessages(
          this.productForm
        ))
    );
  }

  ngOnChanges(): void {
    // patch form with value from the store
    // if (changes.selectedProduct) {
    //   const product = changes.selectedProduct.currentValue as Product;
    //   this.displayProduct(product);
    // }
    this.displayProduct(this.selectedProduct)
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(
      this.productForm
    );
  }

  displayProduct(product: Product | null): void {
    // Set the local product property

    if (product) {
      // Reset the form back to pristine
      this.productForm.reset();

      // Display the appropriate page title
      if (product.id === 0) {
        this.pageTitle = 'Add Product';
      } else {
        this.pageTitle = `Edit Product: ${product.productName}`;
      }

      // Update the data on the form
      this.productForm.patchValue({
        productName: product.productName,
        productCode: product.productCode,
        starRating: product.starRating,
        description: product.description,
      });
    }
  }

  cancelEdit(): void {
    // Redisplay the currently selected product
    // replacing any edits made
    this.displayProduct(this.selectedProduct);
  }

  deleteProduct(): void {
    if (this.selectedProduct && this.selectedProduct.id) {
      if (confirm(`Really delete the product: ${this.selectedProduct.productName}?`)) {
        // this.productService.deleteProduct(product.id).subscribe({
        //   next: () => this.store.dispatch(ProductActions.clearCurrentProduct()),
        //   error: (err) => (this.errorMessage = err),
        // });
        // this.store.dispatch(
        //   ProductPageActions.deleteProduct({ productId: product.id })
        // );
        this.delete.emit(this.selectedProduct.id);
        //this.store.dispatch(ProductActions.clearCurrentProduct());
      }
    } else {
      // No need to delete, it was never saved
      //this.store.dispatch(ProductPageActions.clearCurrentProduct());
      this.clearCurrent.emit();
    }
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      if (this.productForm.dirty) {
        // Copy over all of the original product properties
        // Then copy over the values from the form
        // This ensures values not on the form, such as the Id, are retained
        const product = { ...this.selectedProduct, ...this.productForm.value };

        if (product.id === 0) {
          // this.productService.createProduct(product).subscribe({
          //   next: (p) =>
          //     this.store.dispatch(
          //       ProductActions.setCurrentProduct({ currentProductId: p.id })
          //     ),
          //   error: (err) => (this.errorMessage = err),
          // });
          this.create.emit(product);
        } else {
          // this.productService.updateProduct(product).subscribe({
          //   next: (p) => this.store.dispatch(ProductActions.setCurrentProduct({currentProductId : p.id})),
          //   error: (err) => (this.errorMessage = err),
          // });

          this.update.emit(product);
        }
      }
    }
  }
}
