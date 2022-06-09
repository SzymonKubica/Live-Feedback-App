import { Button } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

const NavBtn = ({dst}) => {
    return (
        <Link to={dst}>
            <Button colorScheme='blue' size='lg'>
                {dst}
            </Button>
        </Link>
    )
}

export default NavBtn