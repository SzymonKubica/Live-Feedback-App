import { Box, Button, Textarea} from '@chakra-ui/react'
import React, {useState} from 'react'
import { Center} from "@chakra-ui/react"


export default function CommentSection() {
  
    const [comment, setComment] = useState("")
    
    let handleInputChange = (e) => {
        let inputValue = e.target.value
        setComment(inputValue)
    }

    function handleSend(){
        const requestOptions = {
            'method': 'PUT',
            'headers': {'Content-Type': 'application/json'},
            body: JSON.stringify({'comment': comment})
          }
          
          fetch('/api/leave-comment', requestOptions)
          .then(res => res.json())
          .then(data => {
            // if not successful do something, response returns {"success": True}
          })
    }
  
    return (
    <Center >
        <Box>
            <Textarea placeholder='Add comment or question' size = 'lg' onChange={handleInputChange}/>
            <Button onClick={handleSend} colorScheme='blue' size='sm'>Send</Button>
        </Box>
    </Center>
  )
}
