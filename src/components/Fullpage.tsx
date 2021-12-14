import { Flex } from "@chakra-ui/layout";

export function Fullpage({children}){

  return(
    <Flex  h='100vh' w='100vw' bg="#ccc">{children}</Flex>
  )


}