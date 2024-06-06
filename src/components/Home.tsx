import { HamburgerIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, HStack, Heading, Spacer, Text, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { Route, Link as RouterLink, Routes } from 'react-router-dom'

import About from './About'
import MapPort from './Map'
import Warning from './Warning'
import { useAuth } from './contexts/AuthContexts'

interface LoveEsriViewBarProps {
  onToggleSidebar: () => void
}

export function LoveEsriViewBar({ onToggleSidebar }: LoveEsriViewBarProps) {
  const { user, signIn, signOut } = useAuth()

  return (
    <Flex as="nav" bg="#370B6D" p={4} color="white" width="100%">
      <HStack spacing={4}>
        <Button variant="link" color="white" onClick={onToggleSidebar}>
          <HamburgerIcon />
        </Button>
        <Heading as={RouterLink} to="/" variant="link" size="md" color="white">
          {`</>`} Love ESRI
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

interface LoveEsriViewSideBarProps {
  isVisible: boolean
}

export function LoveEsriViewSideBar({ isVisible }: LoveEsriViewSideBarProps) {
  const { user } = useAuth()

  return (
    <Box display="flex" width="100%" height="100%">
      <Box
        width={isVisible ? '15%' : '0'}
        bg="gray.50"
        p={isVisible ? 4 : 0}
        transition="width 0.3s ease, padding 0.3s ease"
        overflow="hidden"
      >
        <VStack align="start" spacing={4}>
          {isVisible && (
            <>
              <Text fontWeight="bold" color="blue.800">
                station 1
              </Text>
              <Text fontWeight="bold" color="blue.800">
                station 2
              </Text>
            </>
          )}
        </VStack>
      </Box>
      <Box flex="1" transition="width 0.3s ease" width={isVisible ? '80%' : '100%'}>
        <Routes>
          {user ? (
            <Route path="/" element={<MapPort />} />
          ) : (
            <Route path="/" element={<Warning />} />
          )}
          <Route path="/about" element={<About />} />
        </Routes>
      </Box>
    </Box>
  )
}

const LoveEsriApp = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true)

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible)
  }

  return (
    <>
      <LoveEsriViewBar onToggleSidebar={toggleSidebar} />
      <LoveEsriViewSideBar isVisible={isSidebarVisible} />
    </>
  )
}

export default LoveEsriApp
