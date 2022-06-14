import { Box, Button, Textarea} from '@chakra-ui/react'
import React, {useState, useEffect} from 'react'
import { Center} from "@chakra-ui/react"
import { NilReaction } from '../Reactions'


export default function CommentSection({visible, setVisible, selectedReaction}) {
  
    const [comment, setComment] = useState("")
    
    
    // Only allow comment when there is a new reaction (not allowed to be empty)
    useEffect(() => {
      if (selectedReaction !== NilReaction) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }, [selectedReaction])
    
    
    let handleInputChange = (e) => {
        let inputValue = e.target.value
        setComment(inputValue)
    }

    function handleSend(){
        const requestOptions = {
            'method': 'PUT',
            'headers': {'Content-Type': 'application/json'},
            body: JSON.stringify({'comment': comment, 'reaction':selectedReaction})
          }
          
        fetch('/api/leave-comment', requestOptions)
        .then(res => res.json())
        .then(data => {
          // if not successful do something, response returns {"success": True}
        })

        setVisible(false)
    }
  
    return (
    <Center >
         {/* only show when visible */}
        {visible ? <Box>
            <Textarea placeholder='Add an optional comment' size = 'lg' onChange={handleInputChange}/>
            <Button onClick={handleSend} colorScheme='blue' size='sm'>Send</Button>
        </Box> : null}
    </Center>
  )
}
