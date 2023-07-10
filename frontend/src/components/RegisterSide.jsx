import React from "react"
import { useState } from "react"
import {
    ThemeProvider,
    Typography,
    Button,
    Box,
    TextField,
    Stack,
} from "@mui/material"
import AppTheme from "../util/Theme"
import facebook from "../assets/socials/facebook.svg"
import google from "../assets/socials/google.svg"
import linkedin from "../assets/socials/linkedin.svg"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

function RegisterSide() {
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [error, setError] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        console.log(
            formValues,
            formValues.password === formValues.confirmPassword,
            typeof formValues.password,
            typeof formValues.confirmPassword
        )

        if (formValues.password === formValues.confirmPassword) {
            e.preventDefault()
            console.log("formValues:", formValues)
            const res = await axios.post("http://localhost:8000/api/users", {
                name: formValues.name,
                email: formValues.email,
                password: formValues.confirmPassword,
            })

            if (res.status === 201) {
                console.log(
                    "Created new user, navigate to the posts page (TODO)"
                )
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("id", res.data.id)

                // TODO:
                // setTimeout(() => {
                //   setMessage('User created successfully');
                //   navigate('/feed');
                // }, 2000);
            } else {
                setError(res.data.error)
            }
        } else {
            e.preventDefault()
            setError("Passwords do not match")
        }
    }

    const handleResetError = () => {
        setError("")
    }

    return (
        <div>
            <ThemeProvider theme={AppTheme}>
                <Box
                    sx={{
                        backgroundColor: "page.main",
                        position: "relative",
                    }}
                >
                    <Box
                        sx={{
                            width: "50vw",
                            height: "100vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "text.main",
                        }}
                    >
                        <Box
                            sx={{
                                textAlign: "center",
                                paddingLeft: "5vw",
                                paddingRight: "5vw",
                            }}
                        >
                            <Typography
                                variant="h1"
                                color={"accent.main"}
                                sx={{ paddingBottom: "2vh" }}
                            >
                                Create Account
                            </Typography>
                            <Stack
                                spacing={5}
                                direction="row"
                                alignItems="flex-end"
                                justifyContent="center"
                            >
                                {/* Future TODO: social media authentication... */}
                                <img src={facebook} width={75} />
                                <img src={google} width={75} />
                                <img src={linkedin} width={75} />
                            </Stack>
                            <Typography
                                variant="h5"
                                sx={{ paddingBottom: "2vh", paddingTop: "2vh" }}
                            >
                                Or use your email for registration
                            </Typography>

                            <form onSubmit={handleSubmit}>
                                <Stack spacing={3} sx={{ paddingBottom: 3 }}>
                                    <TextField
                                        variant="outlined"
                                        name="name"
                                        label="Name"
                                        value={formValues.name}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        variant="outlined"
                                        name="email"
                                        label="Email"
                                        type="email"
                                        value={formValues.email}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        variant="outlined"
                                        name="password"
                                        label="Password"
                                        type="password"
                                        value={formValues.password}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        variant="outlined"
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type="password"
                                        value={formValues.confirmPassword}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        error={Boolean(error)}
                                        helperText={error}
                                        onFocus={handleResetError}
                                    />
                                </Stack>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        backgroundColor: "accent.main",
                                        textTransform: "none",
                                        borderRadius: 4,
                                        width: "15vw",
                                        height: "80px",
                                        "&:hover": {
                                            backgroundColor: "accent.secondary",
                                        },
                                    }}
                                >
                                    <Typography variant="h4">
                                        Sign Up
                                    </Typography>
                                </Button>
                            </form>
                        </Box>
                    </Box>
                </Box>
            </ThemeProvider>
        </div>
    )
}

export default RegisterSide
