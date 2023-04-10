import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { useAppSelector } from "../../app/store/configureStore";
import { formatCurrency } from "../../app/util/util";
import { BasketItems } from "../../app/models/basket";

interface Props {
  subTotal?: number;
}

export default function BasketSummary({ subTotal }: Props) {
  const { basket } = useAppSelector(state => state.basket);
  if (subTotal === undefined)
    subTotal =
      basket?.items.reduce(
        (sum: number, item: BasketItems) => sum + item.quantity * item.price,
        0
      ) ?? 0;

  const deliveryFee = subTotal > 10000 ? 0 : 500;
  return (
    <>
      <TableContainer component={Paper} variant={"outlined"}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}>Subtotal</TableCell>
              <TableCell align="right">{formatCurrency(subTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Delivery fee*</TableCell>
              <TableCell align="right">{formatCurrency(deliveryFee)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell align="right">
                {formatCurrency(subTotal + deliveryFee)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span style={{ fontStyle: "italic" }}>
                  *Orders over $100 qualify for free delivery
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
