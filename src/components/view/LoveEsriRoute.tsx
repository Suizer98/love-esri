import { Box, Button, HStack, useMediaQuery } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export function LoveEsriSideBarRoute() {
  const [isLargerThanWidth] = useMediaQuery('(min-width: 768px)')

  return (
    <>
      {!isLargerThanWidth ? (
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
  const [isLargerThanWidth] = useMediaQuery('(min-width: 768px)')

  return (
    <>
      {isLargerThanWidth ? (
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
