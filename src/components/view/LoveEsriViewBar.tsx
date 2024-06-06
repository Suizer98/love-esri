import { HamburgerIcon } from '@chakra-ui/icons'
import { Button, Flex, HStack, Heading, Spacer } from '@chakra-ui/react'
import { useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { useAuthStore } from '../../store/useAuthStore'

interface LoveEsriViewBarProps {
  onToggleSidebar: () => void
}

export function LoveEsriViewBar({ onToggleSidebar }: LoveEsriViewBarProps) {
  const { user, signIn, signOut, checkExistingSession } = useAuthStore(
    (state) => ({
      user: state.user,
      signIn: state.signIn,
      signOut: state.signOut,
      checkExistingSession: state.checkExistingSession
    }),
    shallow
  )

  useEffect(() => {
    checkExistingSession()
  }, [checkExistingSession])

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
