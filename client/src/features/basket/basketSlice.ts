import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Basket } from "../../app/models/basket";
import { getCookie } from "../../app/util/util";

interface BasketState {
  basket: Basket | null;
  status: string;
}

const initialState: BasketState = {
  basket: null,
  status: "idle",
};

export const fetchBasketAsync = createAsyncThunk<Basket>(
  "basket/fetchBasketAsync",
  async (_, thunkApi) => {
    try {
      return await agent.basket.getBasket();
    } catch (error: any) {
      return thunkApi.rejectWithValue({ error: error.data });
    }
  },
  {
    condition: () => {
      if (!getCookie("buyerId")) return false;
    },
  }
);

export const addBasketItemsAsync = createAsyncThunk<
  Basket,
  { productId: number; quantity?: number }
>(
  "basket/addBasketItemAsync",
  async ({ productId, quantity = 1 }, thunkApi) => {
    try {
      return await agent.basket.addBasket(productId, quantity);
    } catch (error: any) {
      return thunkApi.rejectWithValue({ error: error.data });
    }
  }
);

export const removeBasketItemsAsync = createAsyncThunk<
  void,
  { productId: number; quantity: number; name?: string }
>(
  "basket/removeBasketItemAsync",
  async ({ productId, quantity, name }, thunkApi) => {
    try {
      await agent.basket.removeBasket(productId, quantity);
    } catch (error: any) {
      return thunkApi.rejectWithValue({ error: error.data });
    }
  }
);

export const basketSlice = createSlice({
  name: "baskeet",
  initialState,
  reducers: {
    setBasket: (state, action) => {
      state.basket = action.payload;
    },
    clearBasket: state => {
      state.basket = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(addBasketItemsAsync.pending, (state, action) => {
      state.status = "pendingAddItem" + action.meta.arg.productId;
    });

    builder.addCase(removeBasketItemsAsync.pending, (state, action) => {
      console.log(action);
      state.status =
        "pendingRemoveItem" + action.meta.arg.productId + action.meta.arg.name;
    });

    builder.addCase(removeBasketItemsAsync.fulfilled, (state, action) => {
      const { productId, quantity } = action.meta.arg;

      const itemIndex = state.basket?.items.findIndex(
        i => i.productId === productId
      );

      if (itemIndex === -1 || itemIndex === undefined) return;
      state.basket!.items[itemIndex].quantity -= quantity!;
      if (state.basket!.items[itemIndex].quantity === 0)
        state.basket?.items.splice(itemIndex, 1);

      state.status = "idle";
    });

    builder.addCase(removeBasketItemsAsync.rejected, state => {
      state.status = "idle";
    });

    builder.addMatcher(
      isAnyOf(addBasketItemsAsync.fulfilled, fetchBasketAsync.fulfilled),
      (state, { payload }) => {
        state.basket = payload;
        state.status = "idle";
      }
    );

    builder.addMatcher(
      isAnyOf(addBasketItemsAsync.rejected, fetchBasketAsync.rejected),
      state => {
        state.status = "idle";
      }
    );
  },
});

export const { setBasket, clearBasket } = basketSlice.actions;
