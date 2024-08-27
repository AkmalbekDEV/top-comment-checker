import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  Avatar,
  Button,
  useToast,
} from '@chakra-ui/react'
import { BiUser, BiUserCircle } from 'react-icons/bi'

const App = () => {
  const [state, setState] = useState([])
  const [data, setData] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const getData = async () => {
    try {
      const response = await axios.get("https://fe100a235e57a25f.mokky.dev/reviewsTest")
      setState(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  const getCheckedData = async () => {
    try {
      const response = await axios.get("https://fe100a235e57a25f.mokky.dev/reviews")
      setData(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  const handleOpen = (item) => {
    setSelectedItem(item);
    onOpen();
  };

  const handleClose = () => {
    setSelectedItem(null);
    onClose();
  };

  const handleSubmit = async (name, date, desc) => {
    try {
      const response = await axios.post("https://fe100a235e57a25f.mokky.dev/reviews", {
        name: name,
        date: date,
        comment: desc,
      })
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }

    toast({
      duration: 5000,
      isClosable: true,
      status: "success",
      title: "Added!",
      description: "The comment you allowed has been added successfully!",
      position: "top"
    })

    handleClose();
  }

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://fe100a235e57a25f.mokky.dev/reviews/${id}`)
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData()
    getCheckedData()
  }, [])

  return (
    <div>
      <h1 className='text-5xl font-medium text-blue-600 text-center mt-10'>Unchecked Comments</h1>
      <div className='p-10 grid grid-cols-3 max-sm:grid-cols-1 gap-40 max-sm:gap-10'>
        {state.map((item, index) => (
          <div key={index} className='grid content-start gap-5 w-[350px] h-[370px] rounded-xl shadow-xl p-7 border'>
            <div className='flex items-center gap-3'>
              <BiUserCircle size={50} />
              <div className='grid'>
                <h1 className='text-xl font-medium'>{item.name}</h1>
                <h1 className='text-sm text-gray-500'>{item.date}</h1>
              </div>
            </div>
            <h1 className='text-base text-black overflow-auto'>{item.desc}</h1>
            <Button colorScheme='blue' onClick={() => handleOpen(item)}>
              Add this comment
            </Button>
          </div>
        ))}
        {selectedItem && (
          <AlertDialog isOpen={isOpen} onClose={handleClose}>
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                  Delete Customer
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure? You can't undo this action afterwards.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button colorScheme='red' onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button colorScheme='blue' onClick={() => handleSubmit(selectedItem.name, selectedItem.date, selectedItem.desc)} ml={3}>
                    Add
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>)}
      </div>
      <h1 className='text-5xl font-medium text-blue-600 text-center mt-10'>Checked Comments</h1>
      <div className='p-10 grid grid-cols-3 max-sm:grid-cols-1 gap-40 max-sm:gap-10'>
        {data.map((item, index) => (
          <div key={index} className='grid content-start gap-5 w-[350px] h-[370px] rounded-xl shadow-xl p-7 border'>
            <div className='flex items-center gap-3'>
              <BiUserCircle size={50} />
              <div className='grid'>
                <h1 className='text-xl font-medium'>{item.name}</h1>
                <h1 className='text-sm text-gray-500'>{item.date}</h1>
              </div>
            </div>
            <h1 className='text-base text-black overflow-auto'>{item.comment}</h1>
            <Button colorScheme='red' onClick={() => handleDelete(item.id)}>
              Delete this comment
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
