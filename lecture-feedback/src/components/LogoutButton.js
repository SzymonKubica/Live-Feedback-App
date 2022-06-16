import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Button, Box} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";

export const LogoutButton = ({isAuth, setAuth}) => {
    let navigate = useNavigate();

  
    const handleLogout = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        }
        fetch("/api/logout", requestOptions)
        .then(res => res.json())
        .then(data => {
            if (data["success"]) {
                setAuth(false)
            }
            // what to do when fails
            navigate("/")
        })

  }

  return (
    <Box>
        {isAuth ?
        <Button
        onClick={handleLogout}
        colorScheme="blue"
        alignSelf="start"
        marginStart="5px"
        marginTop="15px"
        >
        Logout
        </Button>
        : null    
        }
    </Box>
  )
}
