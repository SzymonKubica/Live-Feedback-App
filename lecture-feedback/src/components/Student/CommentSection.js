import { Box, Button, Textarea} from '@chakra-ui/react'
import React, {useState, useEffect} from 'react'
import { Center} from "@chakra-ui/react"
import { NilReaction } from '../Reactions'
import { SocketContext } from '../../context/socket'


export default function CommentSection({visible, setVisible, selectedReaction, room}) {
  
    const [comment, setComment] = useState("")
    const socket = React.useContext(SocketContext);  
    
    
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
        socket.emit("leave comment", comment, selectedReaction, room)

        setVisible(false)
    }
  
    return (
    <Center >
         {/* only show when visible */}
        {visible ? <Box>
            <Textarea placeholder='Add an optional comment' size = 'lg' onChange={handleInputChange} maxLength={41}/>
            <Button onClick={handleSend} colorScheme='blue' size='sm'>Send</Button>
        </Box> : null}
    </Center>
  )
}
