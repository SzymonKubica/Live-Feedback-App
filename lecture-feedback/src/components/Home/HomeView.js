import React from "react"

import { ChakraProvider, theme, VStack, Heading, Stack } from "@chakra-ui/react"

import { socket } from "../../context/socket"
import NavButton from "../NavButton"
import Header from "../Header"

export const HomeView = () => {
  return (
    <ChakraProvider theme={theme}>
      <Stack>
        <Header />
        <VStack spacing="20px" marginTop="10px">
          <Heading>Home</Heading>
          <NavButton
            onClick={() => socket.emit("connect student")}
            name="Student"
            dst="student"
            size="lg"
          />
          <NavButton
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
