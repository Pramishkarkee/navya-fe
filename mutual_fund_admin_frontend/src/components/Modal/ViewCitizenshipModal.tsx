import { Box, Modal } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "500px",
  bgcolor: "background.paper",
  borderRadius: "4px",
  p: 0.5,
};

const ViewCitizenshipModal = ({ open, setOpen, path }) => {
  // const [citizenshipModalOpen, setCitizenshipModalOpen] = useState(false)

  const handleClose = () => {
    setOpen(false);
  };

  // const { data: citizenshipViewData, isSuccess: citizenshipViewSuccess } = useGetCitizenship(path)

  // console.log("citizenshipViewData", citizenshipViewData)

  // useEffect(() => {
  //     if (citizenshipViewSuccess) {
  //         setFileType(citizenshipViewData?.responseData?.file_type)
  //         setFileData(citizenshipViewData?.responseData?.image_data)
  //     }

  // }, [citizenshipViewData, citizenshipViewSuccess])

  // console.log("fileType", fileType)
  // console.log("fileData", fileData)

  // useEffect(() => {

  //     if (fileData && fileType) {
  //         try {
  //             var url = `data: ${fileType};base64, ${fileData}`
  //             fetch(url)
  //                 .then(res => res.blob())
  //                 .then((blob) => {
  //                     const blobURL = URL.createObjectURL(blob);

  //                     if (fileType === 'application/pdf') {
  //                         window.open(blobURL)
  //                     }
  //                     else (
  //                         setBlobUrl(blobURL)
  //                     )
  //                 })
  //             // .then(res => setBlobUrl(res))
  //         }
  //         catch (error) {
  //             console.error(error)
  //         }

  //     }

  // }, [fileType, fileData])

  // useEffect(() => {

  //     if(fileType !== 'application/pdf' && blobUrl !== ''){
  //         setCitizenshipModalOpen(true)
  //     }

  // }, [fileType, blobUrl])

  // console.log('blob url', blobUrl)

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <img src={path} style={{ width: "100%" }} />
        </Box>
      </Modal>
    </>
  );
};

export default ViewCitizenshipModal;
