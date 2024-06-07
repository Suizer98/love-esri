import { Box, Button, HStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

import useViewStore from '../../store/useViewStore'

export function LoveEsriSideBarRoute() {
  const { isDesktopMode } = useViewStore()

  return (
    <>
      {!isDesktopMode ? (
        <Box bg="#5F3AAF" p={4} borderRadius="md" boxShadow="md">
          <HStack spacing={4}>
            <Button as={RouterLink} to="/" variant="link" color="white">
              Map
            </Button>
            <Button as={RouterLink} to="/about" variant="link" color="white">
              About
            </Button>
          </HStack>
        </Box>
      ) : null}
    </>
  )
}

export function LoveEsriMainBarRoute() {
  const { isDesktopMode } = useViewStore()

  return (
    <>
      {isDesktopMode ? (
        <>
          <Button as={RouterLink} to="/" variant="link" color="white">
            Map
          </Button>
          <Button as={RouterLink} to="/about" variant="link" color="white">
            About
          </Button>
        </>
      ) : null}
    </>
  )
}
