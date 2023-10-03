import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgetItem = ({user,handleFunction}) => {



  return (
    <Box
        px={2}
        py={1}
        borderRadius={"lg"}
        m={1}
        mb={2}
        fontSize={12}
        fontWeight="bold"
        bgColor="blue.800"
        onClick={handleFunction}    
    >
        {user.name}
        <CloseIcon pl={1}/>
    </Box>
  )
}

export default UserBadgetItem
