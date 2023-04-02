import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";

const catalogAdapter = createEntityAdapter<Product>();

export const setCatalogAsync = createAsyncThunk<Product[]>(
  "catalog/setCatalogAsync",
  async (_, thunkApi) => {
    try {
      return await agent.catalog.list();
    } catch (error: any) {
      return thunkApi.rejectWithValue({ error: error.data });
    }
  }
);

export const getCatalogAsync = createAsyncThunk<Product, number>(
  "catalog/getCatalogAsync",
  async (productId, thunkApi) => {
    try {
      return await agent.catalog.details(productId);
    } catch (error: any) {
      return thunkApi.rejectWithValue({ error: error.data });
    }
  }
);

export const catalogSlice = createSlice({
  name: "catalog",
  initialState: catalogAdapter.getInitialState({
    productLoaded: false,
    status: "idle",
  }),

  reducers: {},

  extraReducers: builder => {
    builder.addCase(setCatalogAsync.pending, state => {
      state.status = "pendingFetchProducts";
    });

    builder.addCase(setCatalogAsync.fulfilled, (state, action) => {
      catalogAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.productLoaded = true;
    });

    builder.addCase(setCatalogAsync.rejected, state => {
      state.status = "idle";
    });

    builder.addCase(getCatalogAsync.pending, state => {
      state.status = "pendingGetProduct";
    });

    builder.addCase(getCatalogAsync.fulfilled, (state, action) => {
      catalogAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });

    builder.addCase(getCatalogAsync.rejected, state => {
      state.status = "idle";
    });
  },
});

export const productSelector = catalogAdapter.getSelectors(
  (state: RootState) => state.catalog
);
