import { Flex, Spinner, Text } from '@chakra-ui/react'

export function LoadingOverlay() {
  return (
    <Flex
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center"
      bg="rgba(255, 255, 255, 0.8)"
      zIndex="10"
      flexDirection="column"
    >
      <Spinner size="xl" color="blue.500" mb="4" />
      <Text fontSize="lg" opacity={0.7}>
        Loading map data, please wait...
      </Text>
    </Flex>
  )
}

export default LoadingOverlay
