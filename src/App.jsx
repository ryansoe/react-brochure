import { useState, useEffect, useRef} from "react"
import { Heading, Text, Box, Input, Button, Flex, VStack, SlideFade, Link, Spacer, UnorderedList, ListItem ,Spinner, useToast, usePrefersReducedMotion, Image } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import worldbg from './assets/worldbg.mp4';
import nyc from './assets/nyc.jpeg';
import vietnam from './assets/vietnam.jpeg';
import switzerland from './assets/switzerland.webp';
import './styles.css';

const images = [
  './assets/nyc.jpeg',
  './assets/vietnam.jpeg',
  './assets/switzerland.webp',
];

export default function App(){
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const targetRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  const toast = useToast();
  const [currentImage, setCurrentImage] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsLoading(true);
    setShow(false);

    handleRest(event)
  }

  const handleRest = (event) => {
      event.preventDefault()

      const formData = new FormData(event.target)
      const userText = formData.get("inputName").trim()

      if (userText.trim().length === 0 || !/^[A-Za-z\s'-]+$/.test(userText) || userText.length > 100) {
        toast({
          title: "Invalid Place Entered",
          description: "The entered location is not recognized. Please enter a different place and try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setIsLoading(false)
        return; 
      } else {
        setShowAlert(false);
      }

      fetch('http://localhost:5000/search', {method: 'POST', headers: {'Content-Type': 'application/json',}, body: JSON.stringify({ userInput : userText })})
        .then((res) => {
          if (!res.ok) {
            console.log('Could not set data', res.status)
          }
          return res.json()
        })
        .then((data) => {
          console.log(2)
          console.log(data)
          setData(data)
          setShow(true)
          setIsLoading(false)
          targetRef.current.scrollIntoView({ behavior: 'smooth' });
        })
        .catch ((error)=>{
          console.log(error)
        })
  }

  return (
    <>
      <Flex direction="column">
        <Box as="header" p={4} position="relative" height="25em" maxHeight="25em" boxShadow="md" >
          <video autoPlay loop muted style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, objectFit: 'cover', zIndex: -1, opacity: 0.75 }}>
              <source src={worldbg} type="video/mp4" />
          </video>
          <VStack as="header" position="relative" height="100%" justifyContent="center" align="center">
              <Heading size="4xl" color="white">Brochure Generator</Heading>
          </VStack>
        </Box>
        <Box>
          <Box mt="16" display="flex" position="relative" justifyContent="center" alignItems="center">
            <form onSubmit = {handleSubmit}>
              <Heading size="md">Enter A Place:</Heading>
              <Box display="flex" boxShadow="xl">
                <Input type="text" name="inputName" borderColor="gray" placeholder="Where We Going?" bg="white" sx={{ '::placeholder': { color: 'RGBA(0, 0, 0, 0.64)'}, ':hover': { borderColor: 'blue'}}} />    
                <Button type="submit" onClick={() => setShow(!show)}><Search2Icon /></Button>      
              </Box>
              {/* <input type="text" name="inputTime" placeholder="In How Many Days Are You Going?"/> */}
            </form>
          </Box>
            {isLoading && (
                <Flex justifyContent="center" alignItems="center" height="30vh">
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                </Flex>
            )}
            {data && (
              <SlideFade in={show} offsetY='20px'>
                <Box mx="4" pt="25px"> {/* Outer margin */}
                  <Flex direction="row" h="100vh">
                    <Box w="33.33%" bg="gray.300" p={4} border="1px" boxShadow="2xl">
                      <Box>
                        <Heading size='xl' >{data["Place"]}</Heading>
                        <Heading size='sm'>Best Restaurants Near:</Heading>
                        <UnorderedList>{data["Rest"].map((place, index) => (<ListItem key={index}>{place}</ListItem>))}</UnorderedList> 
                        <Heading  size='sm'>Weather:</Heading>
                        <UnorderedList>{data["Weather"].map((place, index) => (<ListItem key={index}>{place}</ListItem>))}</UnorderedList> 
                      </Box>
                    </Box>
                    <Box w="33.33%" bg="gray.300" p={4} border="1px" boxShadow="2xl" >
                      <Text>Section 2</Text>
                    </Box>
                    <Box w="33.33%" bg="gray.300" p={4} border="1px" boxShadow="2xl">
                      <Text>Section 3</Text>
                    </Box>
                  </Flex>
                </Box>
              </SlideFade>
            )}
            <Box justifyContent="center" ref={targetRef}>
            <Box display="flex" position="relative" justifyContent="center" alignItems="center" minHeight="50vh">
              <Text>Hi</Text>
              <Box width="full" overflow="hidden" position="relative">
                {images.map((src, index) => (
                  <Image
                    key={src}
                    src={src}
                    alt={`Slide ${index}`}
                    position="absolute"
                    inset={0}
                    width="full"
                    height="full"
                    objectFit="cover"
                    opacity={currentImage === index ? 1 : 0}
                    transition={prefersReducedMotion ? undefined : 'opacity 1s ease-in-out'}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box as="footer" bg="gray.700" color="white" py={8} position="relative" bottom="0" left="0" right="0" boxShadow="lg" mt={12}>
            <Flex direction={{ base: "column", md: "row" }} align="center" justify="center" maxW="1200px" mx="auto" px={4}>
                <Text>© 2023 Brochure</Text>
                <Spacer />
                <Flex>
                    <Link href="#" mx={2}>
                        Github
                    </Link>
                </Flex>
            </Flex>
        </Box>
      </Flex>
    </>
  ) 
};