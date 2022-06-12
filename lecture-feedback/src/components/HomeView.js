import React from "react"
import socket from "../context/socket"

import { ChakraProvider, theme, VStack, Heading, Stack } from "@chakra-ui/react"
import NavBtn from "./NavBtn"
import Header from "./Header"

export const HomeView = () => {
  return (
    <ChakraProvider theme={theme}>
      <Stack>
        <Header />
        <VStack spacing="20px" marginTop="10px">
          <Heading>Home</Heading>
          <NavBtn
            onClick={() => socket.emit("connect student")}
            name="Student"
            dst="student"
            size="lg"
          />
          <NavBtn
            onClick={() => socket.emit("connect teacher")}
            name="Teacher"
            dst="teacher"
            size="lg"
          />
        </VStack>
      </Stack>
    </ChakraProvider>
  )
}
