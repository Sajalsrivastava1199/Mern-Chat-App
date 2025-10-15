import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

export default function UserBadgeItem({ user, handleFunction }) {
  return (
    <Box
      px="2"
      py="1"
      borderRadius="lg"
      m={1}
      mb={2}
      bg="purple.500"
      color="white"
      cursor="pointer"
      onClick={handleFunction}
      display="flex"
      alignItems="center"
    >
      {user.name}
      <CloseIcon pl={1} boxSize={3} />
    </Box>
  )
}
