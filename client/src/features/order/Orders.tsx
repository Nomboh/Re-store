import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import agent from "../../app/api/agent";
import { Order } from "../../app/models/order";
import { formatCurrency } from "../../app/util/util";
import OrderDetails from "./OrderDetails";

type Props = {};

const Orders = (props: Props) => {
  const [order, setOrder] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setselectedOrder] = useState(0);

  useEffect(() => {
    agent.order
      .list()
      .then(order => setOrder(order))
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  if (selectedOrder > 0)
    return (
      <OrderDetails
        order={order?.find(o => o.id === selectedOrder)!}
        setSelectedOrder={setselectedOrder}
      />
    );

  if (loading) return <LoadingComponent contain="Loading Orders" />;
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Order Number</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Order Date</TableCell>
            <TableCell align="right">Order Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {order &&
            order.map(row => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{formatCurrency(row.total)}</TableCell>
                <TableCell align="right">
                  {row.orderDate.split("T")[0]}
                </TableCell>
                <TableCell align="right">{row.orderStatus}</TableCell>
                <TableCell align="right">
                  <Button onClick={() => setselectedOrder(row.id)}>View</Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Orders;
