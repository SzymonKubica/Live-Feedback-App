import React, {useState, useEffect} from "react"

import { Button, Input , theme, ChakraProvider, Stack, VStack, Center, Box, Text} from "@chakra-ui/react";
import Header from "../Header"
import { useNavigate, Link} from "react-router-dom";
import { PasswordInput } from "../PasswordInput";

export const TeacherLogin = ({isAuth, setAuth}) => {
    const [visible, setVisible] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
  
    let navigate = useNavigate();

    useEffect(() => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        fetch("/api/authenticated", requestOptions)
        .then(res => res.json())
        .then(data => {
            if (data["authenticated"]) {
                setAuth(true)
                navigate("/teacher/menu")
            } else {
                setVisible(true) // not authenticated already so show login screen
            }
        })
        }, [])

    const handleLogin = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"email": email, "password":password}) 
          }
        fetch("/api/login", requestOptions)
        .then(res => res.json())
        .then(data => {
            if (data["success"]) {
                setAuth(true)
                navigate("/teacher/menu")
            } else {
                // do something
                setMessage(data["error"])
            }
        })
    }
    
    return (
        <Box>
        {visible ? <Box>
            <ChakraProvider theme={theme}>
            <Stack>
            <Header />
            <Center>
                <VStack spacing="20px" marginTop="10px">
                    <Input placeholder="email" onChange={(e) => setEmail(e.target.value)}/>
                    <PasswordInput onChange={(e) => setPassword(e.target.value)}/>
                    <Button onClick={handleLogin} colorScheme='blue' size='lg'>Login</Button>
                    <Text fontSize='sm' color = "red" >{message}</Text>
                    <Box>
                        <Link to="/teacher/signup">
                            Sign Up
                        </Link>
                    </Box>
                </VStack>
            </Center>
            </Stack>
        </ChakraProvider>
        </Box>
        : null
        }
        </Box>
  )
}
