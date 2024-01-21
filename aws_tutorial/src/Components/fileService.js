import httpClient from  '../http-common'

const getAllFiles =()=>{
    return httpClient.get("/getFiles");
}

const uploadFile = (file)=>{
    return httpClient.post("/uploadFile",file);
}

const deleteFile = (fileName) =>{
    return httpClient.delete(`/deleteFile/${fileName}`);
}

export default {getAllFiles, uploadFile, deleteFile};