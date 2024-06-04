import { Box, Button, Flex, HStack, Heading, Spacer, Text, VStack } from '@chakra-ui/react'
import { Route, Link as RouterLink, Routes } from 'react-router-dom'

import About from './About'
import MapPort from './Map'
import { useAuth } from './contexts/AuthContexts'

export function LoveEsriViewBar() {
  const { user, signIn, signOut } = useAuth()

  return (
    <Flex as="nav" bg="teal.500" p={4} color="white" width="100%">
      <HStack spacing={4}>
        <Heading as={RouterLink} to="/" variant="link" size="md">
          Love ESRI
        </Heading>
        <Button as={RouterLink} to="/" variant="link" color="white">
          Map
        </Button>
        <Button as={RouterLink} to="/about" variant="link" color="white">
          About
        </Button>
      </HStack>
      <Spacer />
      {user ? (
        <HStack spacing={4}>
          <Button variant="link" color="white">
            {user.username}
          </Button>
          <Button variant="link" onClick={signOut} color="white">
            Sign Out
          </Button>
        </HStack>
      ) : (
        <Button variant="link" onClick={signIn} color="white">
          Sign In
        </Button>
      )}
    </Flex>
  )
}

export function LoveEsriViewDiv() {
  const { user } = useAuth()

  return (
    <Box display="flex" width="100%" height="100%">
      <Box width="20%" bg="gray.100" p={4}>
        <VStack align="start" spacing={4}>
          <Text fontWeight="bold">station 1</Text>
          <Button variant="link" color="red.500">
            fake data
          </Button>
          <Text fontWeight="bold">station 2</Text>
          <Button variant="link" color="blue.500">
            fake data
          </Button>
        </VStack>
      </Box>
      <Box width="80%">
        <Routes>
          {user ? <Route path="/" element={<MapPort />} /> : <Route path="/" element={<></>} />}
          <Route path="/about" element={<About />} />
        </Routes>
      </Box>
    </Box>
  )
}
