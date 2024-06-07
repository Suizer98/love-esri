import { Box, Button, Flex, Spacer, Text } from '@chakra-ui/react'

import { useViewStore } from '../../store/useViewStore'

export function Warning() {
  const { isDesktopMode } = useViewStore()

  return (
    <Flex
      alignItems="center"
      w="full"
      px={isDesktopMode ? '16' : '6'}
      py="16"
      minHeight="90vh"
      justifyContent="space-between"
      flexDirection={isDesktopMode ? 'row' : 'column'}
    >
      <Box mr={isDesktopMode ? '6' : '0'} w={isDesktopMode ? '60%' : 'full'}>
        {/* <Text fontSize={isLargerThanLG ? '5xl' : '4xl'} fontWeight="bold" mb="4">
          {' '}
          Created by Sui Zer
        </Text> */}

        <Text mb="6" fontSize={isDesktopMode ? 'lg' : 'base'} opacity={0.7}>
          To display the map and use the relevant features, you will need to sign in to your own
          ArcGIS Developer account due to free usage limitations.
        </Text>

        <Button
          as="a"
          href="https://developers.arcgis.com/"
          target="_blank"
          rel="noopener noreferrer"
          w="200px"
          colorScheme="blue"
          variant="solid"
          h="50px"
          size={isDesktopMode ? 'lg' : 'md'}
          mb={isDesktopMode ? '0' : '10'}
        >
          Register here
        </Button>
      </Box>
      <Spacer />
      <Flex w={isDesktopMode ? '40%' : 'full'} alignItems="center" justifyContent="center"></Flex>
    </Flex>
  )
}

export default Warning
