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
  
  
    // const comments = ["comment daslkjdsajdjsadjlksajddasdsadadassaj 1", "comment 2", "comment 3", "comment 4",]


    return (    
    <Flex w="100%" h="40%" justify="center" align="center">
      <Flex w={["100%", "100%", "40%"]} h="90%" flexDir="column">
        <Messages messages={comments} />
      </Flex>
    </Flex>
    )
}
