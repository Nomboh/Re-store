import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import { User } from "../../app/models/user";
import { router } from "../../app/router/Routes";
import { setBasket } from "../basket/basketSlice";

interface AccountState {
  user: User | null;
}

export const singInUser = createAsyncThunk<User, FieldValues>(
  "account/singInUser",
  async (data, thunkApi) => {
    try {
      const userDto = await agent.account.login(data);
      const { basket, ...user } = userDto;
      if (basket) thunkApi.dispatch(setBasket(basket));
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (error: any) {
      return thunkApi.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<User>(
  "account/fetchCurrentUser",
  async (_, thunkApi) => {
    thunkApi.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));
    try {
      const userDto = await agent.account.currentUser();

      const { basket, ...user } = userDto;
      if (basket) thunkApi.dispatch(setBasket(basket));

      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error: any) {
      return thunkApi.rejectWithValue({ error: error.data });
    }
  },
  {
    condition: () => {
      if (!localStorage.getItem("user")) return false;
    },
  }
);

const initialState: AccountState = {
  user: null,
};

export const accounSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    logOutUser: state => {
      state.user = null;
      localStorage.removeItem("user");
      router.navigate("/");
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.user = null;
      localStorage.removeItem("user");
      toast.error("Your Session have expire. please login again");
    });

    builder.addMatcher(
      isAnyOf(singInUser.fulfilled, fetchCurrentUser.fulfilled),
      (state, action) => {
        state.user = action.payload;
      }
    );

    builder.addMatcher(isAnyOf(singInUser.rejected), (state, action) => {
      throw action.payload;
    });
  },
});

export const { logOutUser, setUser } = accounSlice.actions;
