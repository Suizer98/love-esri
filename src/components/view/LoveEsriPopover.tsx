import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
  IconButton,
  Popover, // PopoverFooter,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger
} from '@chakra-ui/react'
import { useRef } from 'react'

export function LoveEsriPopover() {
  const initialFocusRef = useRef<HTMLButtonElement>(null)
  return (
    <Popover initialFocusRef={initialFocusRef} placement="bottom" closeOnBlur={false}>
      <PopoverTrigger>
        <IconButton aria-label="Info" size="xs" icon={<InfoOutlineIcon />} ml={2} />
      </PopoverTrigger>
      <PopoverContent color="white" bg="blue.800" borderColor="blue.800">
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          Steps
        </PopoverHeader>
        <PopoverArrow bg="blue.800" />
        <PopoverCloseButton />
        <PopoverBody>
          1. Left click on the map to start adding stops.
          <br />
          2. Create at least 2 points to form a route.
          <br />
          3. Double right click to clear any added stops.
        </PopoverBody>
        {/* <PopoverFooter
            border='0'
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            pb={4}
          >
            <Box fontSize='sm'>Step 2 of 4</Box>
            <ButtonGroup size='sm'>
              <Button colorScheme='green'>Setup Email</Button>
              <Button colorScheme='blue' ref={initialFocusRef}>
                Next
              </Button>
            </ButtonGroup>
          </PopoverFooter> */}
      </PopoverContent>
    </Popover>
  )
}
