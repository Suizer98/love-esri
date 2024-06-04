import { Button, Flex, HStack, Heading, Spacer } from '@chakra-ui/react'
import { Route, Link as RouterLink, Routes } from 'react-router-dom'

import About from './About'
import MapPort from './Map'
import { useAuth } from './contexts/AuthContexts'

export function Navigation() {
  const { user, signIn, signOut } = useAuth()

  return (
    <Flex as="nav" bg="teal.500" p={4} color="white">
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

export function LoveEsriRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      {user ? <Route path="/" element={<MapPort />} /> : <Route path="/" element={<></>} />}
      <Route path="/about" element={<About />} />
    </Routes>
  )
}
