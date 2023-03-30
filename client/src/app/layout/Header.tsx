import { ShoppingCart } from "@mui/icons-material";
import {
  AppBar,
  IconButton,
  List,
  ListItem,
  Switch,
  Toolbar,
  Typography,
  Badge,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useStoreContext } from "../context/StoreContext";
import { BasketItems } from "../models/basket";

interface Props {
  darkMode: boolean;
  handleThemeChange: () => void;
}
const midLink = [
  { title: "catalog", path: "/catalog" },
  { title: "contact", path: "/contact" },
  { title: "about", path: "/about" },
];

const endLink = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
];

const navStyles = {
  color: "inherit",
  typography: "h6",
  "&:hover": { color: "grey.500" },
  "&.active": { color: "text.secondary" },
};
function Header({ darkMode, handleThemeChange }: Props) {
  const { basket } = useStoreContext();
  const getSum = (total: number, item: BasketItems) => total + item.quantity;

  const items = basket!.items.reduce(getSum, 0);
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display={"flex"} alignItems="center" justifyContent={"center"}>
          <Typography
            variant="h6"
            sx={{ color: "inherit", textDecoration: "none" }}
            component={NavLink}
            to="/"
          >
            RE-STORE
          </Typography>

          <Switch checked={darkMode} onChange={handleThemeChange} />
        </Box>
        <List sx={{ display: "flex" }}>
          {midLink.map(({ title, path }) => (
            <ListItem component={NavLink} sx={navStyles} to={path} key={title}>
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>
        <Box display={"flex"} alignItems="center" justifyContent={"center"}>
          <IconButton
            component={Link}
            to="/basket"
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={items} color="secondary">
              {" "}
              <ShoppingCart />
            </Badge>
          </IconButton>

          <List sx={{ display: "flex" }}>
            {endLink.map(({ title, path }) => (
              <ListItem
                component={NavLink}
                sx={navStyles}
                to={path}
                key={title}
              >
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
