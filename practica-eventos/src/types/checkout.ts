export interface Address {
  fullName: string;
  nif: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  province: string;
  country: string;
}

export interface CheckoutState {
  billing: Address;
  shipping: Address;
  useSameAddress: boolean;
  paymentMethod: 'creditCard' | 'paypal' | 'transfer' | 'bizum' | '';
  discountCode: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}