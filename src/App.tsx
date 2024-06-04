import { Box, ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom'

import './App.css'
import { LoveEsriRoutes, Navigation } from './components/Home'
import { AuthProvider } from './components/contexts/AuthContexts'

const App = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Box>
            <Navigation />
            <LoveEsriRoutes />
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
