import { Box, Button, Textarea} from '@chakra-ui/react'
import React, {useState, useEffect} from 'react'
import { Center, Select } from "@chakra-ui/react"
import { NilReaction } from '../Reactions'
import { SocketContext } from '../../context/socket'


export default function CommentSection({visible, setVisible, selectedReaction, room}) {
  
    const [comment, setComment] = useState("")
    const socket = React.useContext(SocketContext);
    const [selection, setSelection] = useState("") 
    
    
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

    let handleInputChangeDrop = (e) => {
      let inputValue = e.target.value
      console.log(inputValue)
      setSelection(inputValue)
  }

    function handleSend(){
        if (selection === "Other") {
          socket.emit("leave comment", comment, selectedReaction, room)
        } else {
          socket.emit("leave comment", selection, selectedReaction, room)
        }
        setSelection("")
        setVisible(false)
    }
  
    return (
    <Center >
         {/* only show when visible */}
        {visible ? <Box>
            {/* <CommentInput /> */}
            <Select placeholder = "Quick Comment" width = "100%" onChange={handleInputChangeDrop}>
              <option>Can you repeat this</option>
              <option>Another example</option>
              <option>Good example</option>
              <option>Makes sense now</option>
              <option>Other</option> 
            </Select>
            { selection === "Other" ?
            <Textarea placeholder='Add an optional comment' size = 'lg' onChange={handleInputChange}/>
            : null}
            <Button onClick={handleSend} colorScheme='blue' size='sm'>Send</Button>
        </Box> : null}
    </Center>
  )
}
