import { Box, Button, Flex, Spacer, Text, useMediaQuery } from '@chakra-ui/react'

export function Warning() {
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
        {/* <Text fontSize={isLargerThanLG ? '5xl' : '4xl'} fontWeight="bold" mb="4">
          {' '}
          Created by Sui Zer
        </Text> */}

        <Text mb="6" fontSize={isLargerThanLG ? 'lg' : 'base'} opacity={0.7}>
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
          size={isLargerThanLG ? 'lg' : 'md'}
          mb={isLargerThanLG ? '0' : '10'}
        >
          Register here
        </Button>
      </Box>
      <Spacer />
      <Flex w={isLargerThanLG ? '40%' : 'full'} alignItems="center" justifyContent="center"></Flex>
    </Flex>
  )
}

export default Warning
