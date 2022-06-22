import React, { useEffect, useRef } from "react";
import { Avatar, Flex, Text, Box, Grid, GridItem } from "@chakra-ui/react";
import { getColour } from "../Reactions";

// https://ordinarycoders.com/blog/article/react-chakra-ui

const Messages = ({ messages, h }) => {
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
							<Grid templateColumns="repeat(3, 1fr)" templateRows="repeat(3, 1fr)">
								<GridItem rowSpan={2} colSpan={3}>
									<Text>{item.comment}</Text>
								</GridItem>
								<GridItem rowSpan={1} colSpan={2} />
								<GridItem rowSpan={1} colSpan={1}>
									<Text color='gray'>{item.time}</Text>
								</GridItem>
							</Grid>
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
