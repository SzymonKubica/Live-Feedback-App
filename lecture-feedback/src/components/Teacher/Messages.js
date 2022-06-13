import React, { useEffect, useRef } from "react";
import { Avatar, Flex, Text, Box} from "@chakra-ui/react";
import { getColour } from "../Reactions";

// https://ordinarycoders.com/blog/article/react-chakra-ui

const Messages = ({ messages, h}) => {
  const AlwaysScrollToBottom = () => {
	const elementRef = useRef();
	useEffect(() => elementRef.current.scrollIntoView());
	return <div ref={elementRef} />;
  };

  return (	
	
	<Flex w="100%" h={h} overflowY="scroll" flexDirection="column" p="3">
	{messages.map((item, index) => {
      	return (
        	<Flex key={index} w="100%">
          	<Flex
				bg={getColour(item.reaction)}
				color="black"
				minW="10px"
				maxW="10px"
				my="1"
				p="3"	
			>
					
			</Flex>
			<Flex
            	bg="gray.100"
            	color="black"
            	minW="100px"
            	maxW="350px"
            	my="1"
            	p="3"
          	>
            	<Text>{item.comment}</Text>
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
