import React, { useEffect, useRef, useState } from "react";
import { Avatar, Flex, Text, Box, Grid, GridItem, Center, Button } from "@chakra-ui/react";
import { getColour } from "../Reactions";

// https://ordinarycoders.com/blog/article/react-chakra-ui

const Messages = ({ messages, h, startTime, setTime, commentsVisible, setCommentsVisible}) => {
	const AlwaysScrollToBottom = () => {
		const elementRef = useRef();
		useEffect(() => elementRef.current.scrollIntoView());
		return <div ref={elementRef} />;
	};

	function pad(s) {
		return s < 10 ? '0' + s : s
	}

	function msToTime(s) {
		var ms = s % 1000;
		s = (s - ms) / 1000;
		var secs = s % 60;
		s = (s - secs) / 60;
		var mins = s % 60;
		var hrs = (s - mins) / 60;

		return (hrs > 0 ? (pad(hrs) + ':') : '') + pad(mins) + ':' + pad(secs);
	}

	return (

		<Flex w="100%" h={h} overflowY="scroll" flexDirection="column" p="3">
			{messages.map((item, index) => {
				const mils = Date.parse(item.time) - Date.parse(startTime)
				const secs = mils / 1000

				return ( (startTime === undefined && commentsVisible[index]) || startTime !== undefined ?
					<Flex key={index} w="100%">
						<Flex
							bg={getColour(item.reaction)}
							minW="10px"
							maxW="10px"
							my="1"
							p="3"
						>
							{startTime === undefined &&
								<Center cursor='pointer' onClick={(e) => {setCommentsVisible(commentsVisible.map((elem, i) => i === index ? false : elem))}}>
									X
								</Center>}
						</Flex>
						<Box
							cursor={startTime === undefined ? 'auto' : 'pointer'}
							bg="gray.100"
							color="black"
							minW="100px"
							maxW="350px"
							my="1"
							p="3"
							onClick={() => startTime !== undefined && setTime(mils / 1000)}
						>
							<Grid templateColumns="repeat(3, 1fr)" templateRows="repeat(3, 1fr)" width='100%' height='100%'>
								<GridItem rowSpan={2} colSpan={3}>
									<Text>{item.comment}</Text>
								</GridItem>
								<GridItem rowSpan={1} colSpan={2} />
								<GridItem rowSpan={1} colSpan={1}>
									<Text color='gray'>{startTime === undefined ? item.time.split(" ")[4] : msToTime(mils)}</Text>
								</GridItem>
							</Grid>
						</Box>
					</Flex>
					: null
				);
				// }
			})}
			<AlwaysScrollToBottom />
		</Flex>
	);
};

export default Messages;
