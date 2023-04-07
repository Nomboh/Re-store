import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, isValid, errors },
  } = useForm({ mode: "onTouched" });

  function handleApiErrors(errors: any) {
    if (errors) {
      errors.forEach((error: string) => {
        if (error.includes("Password")) {
          setError("password", { message: error });
        } else if (error.includes("Username")) {
          setError("username", { message: error });
        } else if (error.includes("Email")) {
          setError("email", { message: error });
        }
      });
    }
  }

  return (
    <Container
      component={Paper}
      maxWidth="sm"
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(data =>
            agent.account
              .register(data)
              .then(() => {
                toast.success("Registration Successfull - you can now login");
                navigate("/login");
              })
              .catch(error => handleApiErrors(error))
          )}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            {...register("username", {
              required: "Username is required",
              pattern: {
                value: /^[a-z]+$/,
                message: `username should be all lowercase`,
              },
            })}
            error={!!errors.username}
            helperText={errors?.username?.message as string}
            autoFocus
          />

          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Email address not valid",
              },
            })}
            error={!!errors.email}
            helperText={errors?.email?.message as string}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            id="password"
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/,
                message: `Password most include atleast one special character, upper case letter and a numeric digit`,
              },
            })}
            error={!!errors.password}
            helperText={errors?.password?.message as string}
          />

          <LoadingButton
            loading={isSubmitting}
            type="submit"
            fullWidth
            variant="contained"
            disabled={!isValid}
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </LoadingButton>
          <Box mb={4}>
            <Link to={"/login"}>{"Already have an account? Sign In"}</Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
