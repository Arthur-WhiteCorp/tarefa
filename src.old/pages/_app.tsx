import '../../styles/globals.css'
import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { Fullpage } from '../components/Fullpage'


function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Fullpage>
        <Component {...pageProps} />
      </Fullpage>
    </ChakraProvider>
  )
}

export default MyApp
