import { Button } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

const HomeButton = () => {
    return (
        <Link to='/'>
            <Button colorScheme='blue' alignSelf='start' marginStart='5px' marginTop='15px'>
                Home
            </Button>
        </Link>
    )
}

export default HomeButton