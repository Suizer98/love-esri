import { Box } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
`

export function LayerLoadingBar() {
  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      right="0"
      height="3px"
      bg="gray.100"
      overflow="hidden"
      zIndex={5}
    >
      <Box
        height="100%"
        width="40%"
        bg="blue.500"
        animation={`${shimmer} 1.2s ease-in-out infinite`}
      />
    </Box>
  )
}

export default LayerLoadingBar
