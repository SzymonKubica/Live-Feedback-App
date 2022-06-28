import React from "react"
import {
  Alert,
  AlertTitle,
  AlertIcon,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react"

const CustomAlert = ({ title, description, onClose }) => {
  return (
    <Alert status="info">
      <AlertIcon />
      <AlertTitle> {title} </AlertTitle>
      <AlertDescription> {description}</AlertDescription>
      <CloseButton onClick={onClose} />
    </Alert>
  )
}

export default CustomAlert
