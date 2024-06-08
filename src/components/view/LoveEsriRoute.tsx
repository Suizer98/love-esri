import { Box, Button, HStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

import { useViewStore } from '../../store/useViewStore'

export function LoveEsriSideBarRoute() {
  const { isDesktopMode, toggleSidebar } = useViewStore()

  return (
    <>
      {!isDesktopMode ? (
        <Box bg="#5F3AAF" p={4} borderRadius="md" boxShadow="md">
          <HStack spacing={1}>
            <Button
              className="esri-widget"
              bg="#5F3AAF"
              as={RouterLink}
              to="/"
              variant="link"
              color="white"
              onClick={() => {
                toggleSidebar()
              }}
            >
              Map
            </Button>
            <Button
              className="esri-widget"
              bg="#5F3AAF"
              as={RouterLink}
              to="/playground"
              variant="link"
              color="white"
              onClick={() => {
                toggleSidebar()
              }}
            >
              Playground
            </Button>
            <Button
              className="esri-widget"
              bg="#5F3AAF"
              as={RouterLink}
              to="/about"
              variant="link"
              color="white"
              onClick={() => {
                toggleSidebar()
              }}
            >
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
          <Button
            className="esri-widget"
            bg="#370B6D"
            as={RouterLink}
            to="/"
            variant="link"
            color="white"
          >
            Map
          </Button>
          <Button
            className="esri-widget"
            bg="#370B6D"
            as={RouterLink}
            to="/playground"
            variant="link"
            color="white"
          >
            Playground
          </Button>
          <Button
            className="esri-widget"
            bg="#370B6D"
            as={RouterLink}
            to="/about"
            variant="link"
            color="white"
          >
            About
          </Button>
        </>
      ) : null}
    </>
  )
}
