import React, { useState, useEffect } from "react"
import { SocketContext } from '../../context/socket'


import {
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList,
    Flex
  } from '@chakra-ui/react'

import Messages from "./Messages"

export default function CommentLog() {
    
    const [comments, setComments] = useState([])
    const socket = React.useContext(SocketContext);    
  
    useEffect(() => {
        socket.on("update comments", () => {
          
          fetch('/api/get-comments')
          .then(res => res.json())
          .then(data => {
            setComments(data.comments)
          })
        })

        fetch('/api/get-comments')
        .then(res => res.json())
        .then(data => {
          setComments(data.comments)
        })
        
        // Disconnect when unmounts
        return () => socket.off("update comments")
      }, [])
  

    return (    
    <Flex w="100%" h="100%" justify="center" align="center">
      <Flex w={["100%", "100%", "40%"]} h="90%" flexDir="column">
        <Messages h="calc(40vh)" messages={comments} />
      </Flex>
    </Flex>
    )
}
