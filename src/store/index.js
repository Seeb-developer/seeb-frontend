import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// persist config per slice
const cartPersistConfig = {
  key: "cart",
  storage,
};

const userPersistConfig = {
  key: "user",
  storage,
};

const rootReducer = combineReducers({
  cart: persistReducer(cartPersistConfig, cartReducer),
  user: persistReducer(userPersistConfig, userReducer),
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }), // required for redux-persist
});

export const persistor = persistStore(store);
export { store };
