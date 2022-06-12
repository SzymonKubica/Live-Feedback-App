import React from "react"

import { ChakraProvider, theme, VStack, Heading, Stack } from "@chakra-ui/react"
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
            name="Student"
            dst="student"
            size="lg"
          />
          <NavButton
            name="Teacher"
            dst="teacher"
            size="lg"
          />
        </VStack>
      </Stack>
    </ChakraProvider>
  )
}
