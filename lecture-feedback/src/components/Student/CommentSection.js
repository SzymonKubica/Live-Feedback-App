import { Box, Button, Textarea} from '@chakra-ui/react'
import React, {useState, useEffect} from 'react'
import { Center, Select } from "@chakra-ui/react"
import { NilReaction } from '../Reactions'
import { SocketContext } from '../../context/socket'


export default function CommentSection({visible, setVisible, selectedReaction, room}) {
  
    const [comment, setComment] = useState("")
    const socket = React.useContext(SocketContext);
    const [selection, setSelection] = useState("") 
    const [invalid, setInvalid] = useState(false)
    const [invalidCommend, setInvalidCommend] = useState(false)

    const [time, setTime] = useState(() => new Date())
    
    
    // Only allow comment when there is a new reaction (not allowed to be empty)
    useEffect(() => {
      if (selectedReaction !== NilReaction) {
        setVisible(true)
      } else {
        setVisible(false)
        setSelection("")
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
          setComment(comment.trim())
          if (comment.trim() === "") {
            setInvalidCommend(true)
            return
          }
          socket.emit("leave comment", comment.trim(), selectedReaction, room)
        } else if (selection === "") {
          setInvalid(true)
          return
        } else {
          socket.emit("leave comment", selection, selectedReaction, room)
        }
        setSelection("")
        setVisible(false)
    }

    // Measure metric time for sendig message
    useEffect(() => {
      let end = new Date()
      if (visible) {
        setTime(() => new Date())
      } else {
        if (selectedReaction !== NilReaction) {
          const t = Math.abs(time - end.getTime())/1000
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"data":{"type":"comment_new", "time":t}})
          }

          fetch("/api/set-metric", requestOptions)
        }
      }

    }, [visible])
    
  
    return (
    <Center >
         {/* only show when visible */}
        {visible ? <Box>
            {/* <CommentInput /> */}
            <Select width = "100%" onChange={handleInputChangeDrop} isInvalid={invalid} onClick={() => setInvalid(false)}>
              <option value="" disabled selected>Quick Select Comment (Optional)</option>
              <option>Can you repeat this</option>
              <option>Another example</option>
              <option>Good example</option>
              <option>Makes sense now</option>
              <option>Other</option> 
            </Select>
            { selection === "Other" ?
            <Textarea value={comment} onClick={() => setInvalidCommend(false)} isInvalid={invalidCommend} placeholder='Add an optional comment' size = 'lg' onChange={handleInputChange} maxLength={41}/>
            : null}
            <Button onClick={handleSend} colorScheme='blue' size='sm'>Send</Button>
        </Box> : null}
    </Center>
  )
}
