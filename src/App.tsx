import { Box, Button, ChakraProvider, Flex, HStack, Heading, Spacer } from '@chakra-ui/react'
import { Route, BrowserRouter as Router, Link as RouterLink, Routes } from 'react-router-dom'

import './App.css'
import About from './components/About'
import Home from './components/Home'
import MapPort from './components/Map'
import { AuthProvider, useAuth } from './components/contexts/AuthContexts'

const Navigation = () => {
  const { user, signIn, signOut } = useAuth()

  return (
    <Flex as="nav" bg="teal.500" p={4} color="white">
      <HStack spacing={4}>
        <Heading size="md">Love ESRI</Heading>
        <Button as={RouterLink} to="/" variant="link" color="white">
          Home
        </Button>
        <Button as={RouterLink} to="/about" variant="link" color="white">
          About
        </Button>
        <Button as={RouterLink} to="/map" variant="link" color="white">
          Map
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

const App = () => (
  <ChakraProvider>
    <AuthProvider>
      <Router>
        <Box>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/map" element={<MapPort />} />
          </Routes>
        </Box>
      </Router>
    </AuthProvider>
  </ChakraProvider>
)

export default App
