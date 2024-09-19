import React, { Fragment,useState } from 'react'
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles'; 
import { Button, TextField } from '@mui/material';

import FileUpload from "react-mui-fileuploader";
import { addMediaUrl } from '../api/Api';
import {ReactSession} from 'react-client-session'
import axios from 'axios';
import MainLoader from '../Loader/MainLoader';
import UploadProgress from '../uploadProgress/UploadProgress';
const actions = [
    { icon: <FolderIcon />, name: 'Folder' },
    { icon: <InsertDriveFileIcon/>, name: 'File' },
  ];


const Uploader = ({totalSize,getAllMedia}) => {
  const [open, setOpen] = useState(false);
  const [displayInput,setDisplayInput] = useState('none')
  const [folderName,setFolderName] = useState('')
  const [loaderShow,setLoaderShow] = useState('none')
  const [progressValue,setProgressValue] = useState(0)
  const [progressTotalLenght,setProgressTotalLength] = useState(0)
  const [progressCurrentLenght,setProgressCurrentLength] = useState(0)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sx'));

  const uuid = ReactSession.get('uuid');
  const token = ReactSession.get('token')
  const mediaUrl = `${addMediaUrl}/${uuid}`

  const getUrl = window.location.href;
  var segName = getUrl.split("/").pop();

  const handleClickOpen = (type) => {
    setOpenModal(true);
    setDisplayInput(type)
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  
 

  const [filesToUpload, setFilesToUpload] = useState([]);

  const handleFilesChange = (files) => {
    // Update chosen files
    setFilesToUpload([...files]);
  };

  const uploadFiles = () => {
    setLoaderShow('block')
    var countRes = 0
     for (let i = 0; i <filesToUpload.length; i++) {
     
      let count = 0;
      var data = new FormData();
      if(folderName){
        data.append('folder_name', folderName);
      }
      data.append('file', filesToUpload[i]);
      var config = {
        method: 'post',
        url: mediaUrl,
        headers: { 
          'Authorization': `Bearer ${token}`, 
        },
        data : data,
        onUploadProgress: progressEvent => {
          let percentComplete = progressEvent.loaded / progressEvent.total
          percentComplete = parseInt(percentComplete * 100);
          setProgressValue(percentComplete)
          setProgressTotalLength(filesToUpload.length)
        }
      };
     
     
  
      axios(config)
      .then(function (response) {
        countRes = countRes+1
        setProgressCurrentLength(countRes)
        if(countRes === filesToUpload.length){
          setProgressValue(0);
          setProgressCurrentLength(0)
          getAllMedia();
          handleCloseModal();
          setLoaderShow('none')
        }
       
      })
      .catch(function (error) {
 
      });

    }
  };

  



  return (
    <Fragment>
     <div className="uploader">
      {(totalSize<5368709120) ?<>
        <Box disableElevation>
      <Backdrop open={open} className=" backdrop_contorller"/>
      <SpeedDial 
        className='uploader_dial'
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: 'fixed', bottom: 30, right: 30 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {segName !=='home' && segName !=='files-type' &&
          <SpeedDialAction
            key={actions[0].name}
            icon={actions[0].icon}
            tooltipTitle={actions[0].name}
            tooltipOpen
            onClick={() => {handleClickOpen('block')}}
          />
        }
          <SpeedDialAction
            key={actions[1].name}
            icon={actions[1].icon}
            tooltipTitle={actions[1].name}
            tooltipOpen
            onClick={() => {handleClickOpen('none')}}
          />
        
      </SpeedDial>
      <Box sx={{display:`${loaderShow}`}}>
        <MainLoader />
      </Box>
    
    </Box>
      </>:<>
    <Box disableElevation>
      <Backdrop open={open} className="backdrop_contorller"/>
      <SpeedDial 
        className='uploader_dial'
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: 'fixed', bottom: 30, right: 30 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open} >
           
             <SpeedDialAction
             key={actions[0].name}
             icon={actions[0].icon}
             tooltipTitle='Storage full'
             tooltipOpen/>
          
       
          <SpeedDialAction
            key={actions[1].name}
            icon={actions[1].icon}
            tooltipTitle='Storage full'
            tooltipOpen />
        
      </SpeedDial>
      <Box sx={{display:`${loaderShow}`}}>
        <MainLoader />
      </Box>
    
    </Box>
      </>}
  
     </div> 
     
     <div>
      <Dialog
        fullScreen={fullScreen}
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="responsive-dialog-title" >
        <DialogTitle id="responsive-dialog-title"> 
        </DialogTitle>
        <DialogContent>
         <div className="uploader_contianer">
          <TextField className='folder_name_input' sx={{mb:3,  display: `${displayInput}`}} label="Folder Name" variant="outlined" onChange={((e)=>setFolderName(e.target.value))} />
           <div className="file_selecter">
            <FileUpload
              multiFile={true}
              onFilesChange={handleFilesChange}
              onContextReady={(context) => {}} />
           </div>
              {(filesToUpload.length>0) ? <><Button className='Upload_btn' onClick={uploadFiles} variant="contained" id="uploadButton">  Upload</Button></>
              :
              <><Button onClick={uploadFiles} className='Upload_btn' variant="contained" id="uploadButton" disabled>  Upload</Button></>
              }
         </div>
         </DialogContent>
      </Dialog>
    </div>
    {(progressValue>0) && <UploadProgress value = {progressValue} progressCurrentLenght={progressCurrentLenght} progressTotalLenght={progressTotalLenght} />}
    
    </Fragment>
  )
}

export default Uploader