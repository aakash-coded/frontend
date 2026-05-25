import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import authReducer from './redux/slices/authSlice';
import productReducer from './redux/slices/productSlice';
import cartReducer from './redux/slices/cartSlice';
import wishlistReducer from './redux/slices/wishlistSlice';
import ordersReducer from './redux/slices/ordersSlice';

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        orders: ordersReducer,
      },
      preloadedState,
    }),
    route = '/',
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
