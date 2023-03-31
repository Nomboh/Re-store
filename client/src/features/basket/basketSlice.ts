import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Basket } from "../../app/models/basket";

interface BasketState {
  basket: Basket | null;
  status: string;
}

const initialState: BasketState = {
  basket: null,
  status: "idle"
};

export const addBasketItemsAsync = createAsyncThunk<Basket, {productId: number, quantity?: number}>("basket/addBasketItemAsync",
 async ({productId, quantity = 1}) => {
  try {
    return await agent.basket.addBasket(productId, quantity);
  } catch (error) {
    console.log(error)
  }
})

export const basketSlice = createSlice({
  name: "baskeet",
  initialState,
  reducers: {
    setBasket: (state, action) => {
      state.basket = action.payload;
    },

    removeItem: (state, action) => {
      const { productId, quantity } = action.payload;
      const itemIndex = state.basket?.items.findIndex(
        i => i.productId === productId
      );

      if (itemIndex === -1 || itemIndex === undefined) return;
      state.basket!.items[itemIndex].quantity -= quantity;
      if (state.basket!.items[itemIndex].quantity === 0)
        state.basket?.items.splice(itemIndex, 1);
    },
  },
  extraReducers(builder) {
    builder.addCase(addBasketItemsAsync.pending, (state , action)=> {
      state.status = "pendingAddItem" + action.meta.arg.productId;
    })

    builder.addCase(addBasketItemsAsync.fulfilled, (state, {payload}) => {
      state.basket = payload;
      state.status = "idle";
    })

    builder.addCase(addBasketItemsAsync.rejected, (state) => {
      state.status = "idle";
    })
  },
});

export const { setBasket, removeItem } = basketSlice.actions;
