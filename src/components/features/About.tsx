import { Box, Button, Flex, Spacer, Text, useMediaQuery } from '@chakra-ui/react'

export function About() {
  const [isLargerThanLG] = useMediaQuery('(min-width: 62em)')
  return (
    <Flex
      alignItems="center"
      w="full"
      px={isLargerThanLG ? '16' : '6'}
      py="16"
      minHeight="90vh"
      justifyContent="space-between"
      flexDirection={isLargerThanLG ? 'row' : 'column'}
    >
      <Box mr={isLargerThanLG ? '6' : '0'} w={isLargerThanLG ? '60%' : 'full'}>
        <Text fontSize={isLargerThanLG ? '5xl' : '4xl'} fontWeight="bold" mb="4">
          {' '}
          Created by Sui Zer
        </Text>

        <Text mb="6" fontSize={isLargerThanLG ? 'lg' : 'base'} opacity={0.7}>
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
          size={isLargerThanLG ? 'lg' : 'md'}
          mb={isLargerThanLG ? '0' : '10'}
        >
          Read More
        </Button>
      </Box>
      <Spacer />
      <Flex w={isLargerThanLG ? '40%' : 'full'} alignItems="center" justifyContent="center"></Flex>
    </Flex>
  )
}

export default About
