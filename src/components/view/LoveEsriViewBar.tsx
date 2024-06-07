import { HamburgerIcon } from '@chakra-ui/icons'
import { Button, Flex, HStack, Heading, Spacer, Text, useToast } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { useAuthStore } from '../../store/useAuthStore'
import { useMapStore } from '../../store/useMapStore'
import { useViewStore } from '../../store/useViewStore'
import { LoveEsriMainBarRoute } from './LoveEsriRoute'

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

  const { setIsMapAvailable } = useMapStore(
    (state) => ({
      setIsMapAvailable: state.setIsMapAvailable
    }),
    shallow
  )

  const { isDesktopMode } = useViewStore()
  const toastShownRef = useRef(false)
  const toast = useToast()

  const handleSignIn = () => {
    signIn()
  }

  const handleSignOut = () => {
    setIsMapAvailable(false)
    signOut()
    toast({
      title: 'Success',
      description: 'You have signed out.',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top'
    })
  }

  useEffect(() => {
    checkExistingSession().then((signInStatus: any) => {
      if (signInStatus === 'success' && !toastShownRef.current) {
        toast({
          title: 'Success',
          description: 'You have signed in.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top'
        })
        toastShownRef.current = true
      }
    })
  }, [checkExistingSession, toast])

  return (
    <Flex as="nav" bg="#370B6D" p={4} color="white" width="100%">
      <HStack spacing={4}>
        <Button variant="link" color="white" onClick={onToggleSidebar}>
          <HamburgerIcon />
        </Button>
        <Heading as={RouterLink} to="/" variant="link" size="md" color="white">
          {`</>`} Love ESRI
        </Heading>
        <LoveEsriMainBarRoute />
      </HStack>
      <Spacer />
      {user ? (
        <HStack spacing={4}>
          <Text
            maxW={isDesktopMode ? '200px' : '50px'}
            isTruncated
            title={user.username}
            color="#CCBEEA"
          >
            {user.username}
          </Text>
          <Button variant="link" onClick={handleSignOut} color="white">
            Sign Out
          </Button>
        </HStack>
      ) : (
        <Button variant="link" onClick={handleSignIn} color="white">
          Sign In
        </Button>
      )}
    </Flex>
  )
}
