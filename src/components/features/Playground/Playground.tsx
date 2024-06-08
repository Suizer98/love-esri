import { Box, Flex, Spacer, Text } from '@chakra-ui/react'

import { useViewStore } from '../../../store/useViewStore'

export function Playground() {
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
        <Text fontSize={isDesktopMode ? '5xl' : '4xl'} fontWeight="bold" mb="4">
          {' '}
          Playground
        </Text>

        <Text mb="6" fontSize={isDesktopMode ? 'lg' : 'base'} opacity={0.7}>
          Coming soon...
        </Text>
      </Box>
      <Spacer />
      <Flex w={isDesktopMode ? '40%' : 'full'} alignItems="center" justifyContent="center"></Flex>
    </Flex>
  )
}

export default Playground
