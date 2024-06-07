import { Box, Button, Flex, Spacer, Text } from '@chakra-ui/react'

import { useViewStore } from '../../store/useViewStore'

export function About() {
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
          Created by Sui Zer
        </Text>

        <Text mb="6" fontSize={isDesktopMode ? 'lg' : 'base'} opacity={0.7}>
          This is to showcase that I am able to utilise the APIs provided by ESRI company so that I
          can be more prepared for possible future requirements.
        </Text>

        <Button
          as="a"
          href="https://github.com/Suizer98/love-esri"
          target="_blank"
          rel="noopener noreferrer"
          w="200px"
          colorScheme="gray"
          variant="solid"
          h="50px"
          size={isDesktopMode ? 'lg' : 'md'}
          mb={isDesktopMode ? '0' : '10'}
        >
          Read More
        </Button>
      </Box>
      <Spacer />
      <Flex w={isDesktopMode ? '40%' : 'full'} alignItems="center" justifyContent="center"></Flex>
    </Flex>
  )
}

export default About
