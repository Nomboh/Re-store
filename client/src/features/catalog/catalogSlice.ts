import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

import agent from "../../app/api/agent";
import { Metadata } from "../../app/models/pagination";
import { Product, ProductParams } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";

interface CatalogState {
  productLoaded: boolean;
  filterLoaded: boolean;
  status: string;
  brands: string[];
  types: string[];
  productParams: ProductParams;
  metaData: Metadata | null;
}

const catalogAdapter = createEntityAdapter<Product>();

function initParams() {
  return {
    orderBy: "name",
    pageNumber: 1,
    pageSize: 6,
    types: [],
    brands: [],
  };
}

function getAxiosParams(productParams: ProductParams) {
  const params = new URLSearchParams();

  params.append("pageNumber", productParams.pageNumber.toString());
  params.append("pageSize", productParams.pageSize.toString());
  params.append("orderBy", productParams.orderBy);

  if (productParams.searchTerm)
    params.append("searchTerm", productParams.searchTerm);
  if (productParams.brands.length > 0)
    params.append("brands", productParams.brands?.toString());
  if (productParams.types.length > 0)
    params.append("types", productParams.types.toString());

  return params;
}

export const setCatalogAsync = createAsyncThunk<
  Product[],
  void,
  { state: RootState }
>("catalog/setCatalogAsync", async (_, thunkApi) => {
  const params = getAxiosParams(thunkApi.getState().catalog.productParams);

  try {
    const response = await agent.catalog.list(params);
    thunkApi.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return thunkApi.rejectWithValue({ error: error.data });
  }
});

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

export const getFiltersAsync = createAsyncThunk(
  "catalog/filterAsync",
  async (_, thunkApi) => {
    try {
      return await agent.catalog.fetchFilters();
    } catch (error: any) {
      return thunkApi.rejectWithValue({ error: error.data });
    }
  }
);

export const catalogSlice = createSlice({
  name: "catalog",
  initialState: catalogAdapter.getInitialState<CatalogState>({
    productLoaded: false,
    status: "idle",
    filterLoaded: false,
    types: [],
    brands: [],
    productParams: initParams(),
    metaData: null,
  }),

  reducers: {
    setProductParams: (state, action) => {
      state.productLoaded = false;

      state.productParams = { ...state.productParams, ...action.payload };
    },

    setPaginationProductParams: (state, action) => {
      state.productLoaded = false;

      state.productParams = {
        ...state.productParams,
        ...action.payload,
        pageNumber: 1,
      };
    },

    resetProductParams: state => {
      state.productParams = initParams();
    },

    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
  },

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

    builder.addCase(getFiltersAsync.pending, state => {
      state.status = "pendingFetching";
    });

    builder.addCase(getFiltersAsync.fulfilled, (state, { payload }) => {
      state.brands = payload.brands;
      state.types = payload.types;
      state.filterLoaded = true;

      state.status = "idle";
    });

    builder.addCase(getFiltersAsync.rejected, state => {
      state.status = "idle";
    });
  },
});

export const productSelector = catalogAdapter.getSelectors(
  (state: RootState) => state.catalog
);

export const {
  setProductParams,
  resetProductParams,
  setMetaData,
  setPaginationProductParams,
} = catalogSlice.actions;
