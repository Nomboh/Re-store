import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Basket } from "../models/basket";

export interface StoreContextValue {
  basket: Basket | null;
  setBasket: (basket: Basket) => void;
  removeBasket: (productId: number, quantity: number) => void;
}

export const StoreContext = createContext<StoreContextValue | null>(null);

export function useStoreContext() {
  const context = useContext(StoreContext);

  if (!context) {
    throw Error("Oops - we do not seem to be inside the provider");
  }

  return context;
}

export function StoreProvider({ children }: PropsWithChildren<any>) {
  const [basket, setBasket] = useState<Basket | null>(null);

  function removeBasket(productId: number, quantity: number) {
    if (!basket) return;

    const items = [...basket.items];

    const indexOf = items.findIndex(x => x.productId === productId);

    if (indexOf >= 0) {
      items[indexOf].quantity -= quantity;
      if (items[indexOf].quantity === 0) items.splice(indexOf, 1);

      setBasket(prev => {
        return { ...prev!, items };
      });
    }
  }

  return (
    <StoreContext.Provider value={{ basket, setBasket, removeBasket }}>
      {children}
    </StoreContext.Provider>
  );
}
