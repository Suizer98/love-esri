import { Box, Button, Text, VStack } from '@chakra-ui/react'

import { usePlaygroundStore } from '../../store/usePlaygroundStore'

const LoveEsriPlaygroundPoints = () => {
  const { addedPoints, setAddedPoints } = usePlaygroundStore()

  const handleClearPoints = () => {
    setAddedPoints([])
  }

  return (
    <Box bg="white" p={4} borderRadius="md" boxShadow="md">
      <VStack align="start" spacing={2}>
        {addedPoints.length > 0 ? (
          <>
            {addedPoints.map((point, index) => (
              <Box key={index} p={2} bg="gray.100" borderRadius="md" w="100%">
                <Text fontWeight="bold" color="blue.800">
                  Point {index + 1}
                </Text>
                <Text>Latitude: {point.latitude.toFixed(4)}</Text>
                <Text>Longitude: {point.longitude.toFixed(4)}</Text>
              </Box>
            ))}
            <Button colorScheme="red" onClick={handleClearPoints}>
              Clear all points
            </Button>
          </>
        ) : (
          <Text>No points added.</Text>
        )}
      </VStack>
    </Box>
  )
}

export default LoveEsriPlaygroundPoints
