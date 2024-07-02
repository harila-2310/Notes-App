import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Notecard from '../../components/Cards/Notecard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import moment from 'moment';
import Toast from '../../components/ToastMessage/Toast'
import EmptyCard from '../../components/EmptyCArd/EmptyCard'
import noNote from '../../assets/images/Note-Icon-PNG-Picture.png'
import noData from '../../assets/images/7466073.png'
const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  })
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: '',
  })

  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch,setIsSearch]=useState(false);

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    })
  }

  const showToastMessage = ({ message, type }) => {
    setShowToastMsg({
      isShown: true,
      message: message,
      type: type,
    })
  }

  // Edit Notes
  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" })
  }

  // Get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  }

  // Get all notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('/get-all-notes');
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occured");
    }
  }

  //delete Note
  const deleteNote=async(data)=>{
    const noteId =data._id;
    try {
      const response = await axiosInstance.delete('/delete-note/' + noteId);

      if (response.data && !response.data.error) {
        showToastMessage({message:"Note deleted successfully", type:"delete"});
        getAllNotes()
        onClose()
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.log("An unexpected error occured");
      }
    }
  }

  //search for a note
  const onSearchNote=async(query)=>{
    try{
      const response=await axiosInstance.get('/search-notes',{
         params:{query}
      });
      if(response.data && response.data.notes){
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    }catch(error){
      console.log(error);
    }
  }

  const updateIsPinned=async(noteData)=>{
    const noteId=noteData._id;
    try {
      const response = await axiosInstance.put('/update-note-pinned/' + noteId, {
        "isPinned": !noteId.isPinned,
      })

      if (response.data && response.data.note) {
        showToastMessage({ message: "Note Pinned successfully", type: "edit" });
        getAllNotes()
        onClose()
      }
    } catch (error) {
       console.log(error);
    }
  }

  const handleClearSearch=()=>{
    setIsSearch(false);
    getAllNotes();
  }
  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, [])

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>
      <div className='container mx-auto'>
       {allNotes.length>0 ? (
         <div className='grid grid-cols-3 gap-4 mt-8'>
         {allNotes.map((item, index) => (
           <Notecard
             key={item._id}
             title={item.title}
             date={moment(item.createdOn).format('DD/MM/YYYY')}
             content={item.content}
             tags={item.tags}
             isPinned={item.isPinned}
             onEdit={() => handleEdit(item)}
             onDelete={() => {deleteNote(item)}}
             onPinNote={() => {updateIsPinned(item)}}
           />
         ))}

       </div>
       ): <EmptyCard imgSrc={isSearch? noData :noNote} message={isSearch?`oops! No 'Notes' found matching your search,Try with relevant title keyword`:`Start creating your first note! click the 'Add' button to add your thoughts,ideas and remainders . Lets get started`}/>}

        <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10' onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }}>
          <MdAdd className='text-[32px] text-white' />
        </button>

        <Modal
          isOpen={openAddEditModal.isShown}
          onRequestClose={() => { }}
          style={{
            overlay: {
              backgroundColor: "rgba(0,0,0,0.2)",
            },
          }}
          contentLabel=""
          className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
        >
          <AddEditNotes
            type={openAddEditModal.type}
            noteData={openAddEditModal.data}
            onClose={() => {
              setOpenAddEditModal({ isShown: false, data: null, type: "add" })
            }}
            getAllNotes={getAllNotes}
            showToastMessage={showToastMessage}
          />

        </Modal>

        <Toast
          isShown={showToastMsg.isShown}
          message={showToastMsg.message}
          type={showToastMsg.type}
          onClose={handleCloseToast}
        />
      </div>
    </>
  )
}

export default Home
