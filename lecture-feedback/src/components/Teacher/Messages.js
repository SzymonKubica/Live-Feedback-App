import React, { useEffect, useRef } from "react";
import { Avatar, Flex, Text } from "@chakra-ui/react";

// https://ordinarycoders.com/blog/article/react-chakra-ui

const Messages = ({ messages }) => {
  const AlwaysScrollToBottom = () => {
	const elementRef = useRef();
	useEffect(() => elementRef.current.scrollIntoView());
	return <div ref={elementRef} />;
  };

  return (	
	
	<Flex w="100%" h="100%" overflowY="scroll" flexDirection="column" p="3">
  	{messages.map((item, index) => {
      	return (
        	<Flex key={index} w="100%">
          	<Flex
            	bg="gray.100"
            	color="black"
            	minW="100px"
            	maxW="350px"
            	my="1"
            	p="3"
          	>
            	<Text>{item}</Text>
          	</Flex>
        	</Flex>
      	);
    	// }
  	})}
  	<AlwaysScrollToBottom />
	</Flex>
  );
};

export default Messages;
