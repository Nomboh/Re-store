import React from "react";
import { Order } from "../../app/models/order";
import { Box, Button, Grid, Typography } from "@mui/material";
import BasketSummary from "../basket/BasketSummary";
import TableBasket from "../basket/TableBasket";
import { BasketItems } from "../../app/models/basket";

interface Props {
  order: Order;
  setSelectedOrder: (id: number) => void;
}

function OrderDetails({ order, setSelectedOrder }: Props) {
  const subtotal =
    order.orderItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ) ?? 0;
  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography sx={{ p: 2 }} gutterBottom variant="h4">
          Order# {order.id}-{order.orderStatus}
        </Typography>
        <Button
          variant="contained"
          onClick={() => setSelectedOrder(0)}
          sx={{ m: 2 }}
          size="large"
        >
          Back to Orders
        </Button>
      </Box>
      <TableBasket items={order.orderItems as BasketItems[]} isBasket={false} />
      <Grid container mt={2}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <BasketSummary subTotal={subtotal} />
        </Grid>
      </Grid>
    </>
  );
}

export default OrderDetails;
