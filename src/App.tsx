import { Box, ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom'

import './App.css'
import { LoveEsriViewBar, LoveEsriViewDiv } from './components/Home'
import { AuthProvider } from './components/contexts/AuthContexts'

const App = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Box display="flex" flexDirection="column" height="100vh">
            <LoveEsriViewBar />
            <LoveEsriViewDiv />
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
