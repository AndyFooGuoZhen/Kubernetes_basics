import React from 'react'
import { useEffect, useCallback } from 'react'
import fileService from './fileService'
import {useDropzone} from 'react-dropzone'



function File() {
  const [ files , setFiles ] = React.useState(new Set())

  const onDrop = (acceptedFiles)=> {
    const formData = new FormData()
    formData.append('file', acceptedFiles[0])

    fileService.uploadFile(formData)
      .then(response => {
        //add new file to the state
        const next = new Set([...files])
        next.add(acceptedFiles[0].name)
        setFiles(next)

      })
      .catch(error => {
        console.log(error)
      })
  }

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})



  useEffect(() => {
      fetchAllFiles()
    }, [])

const fetchAllFiles = ()=>{
    fileService
    .getAllFiles()
    .then((response)=>{
        if(response.data.files.length>0){
          const tempSet = new Set()
          response.data.files.forEach(tempSet.add, tempSet);

          setFiles(tempSet);
        }

    }).catch((error)=>{
        console.log(error)
    })
    }

    const deleteFile = (fileName)=>{
      fileService
      .deleteFile(fileName)
      .then((response)=>{
        const deleteSet = new Set([...files])
        deleteSet.delete(fileName)
        setFiles(deleteSet)
      }).catch((error)=>{

      })
    }
    


  return (
    <div className='mx-auto w-full p-3 rounded-3xl mb-10'>
      <div {...getRootProps()} className='bg-slate-300 h-96 rounded-2xl text-center flex justify-center items-center'>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <h1 className='text-2xl'>Drop the file here ...</h1> :
          <h1 className='text-2xl'>Drag 'n' Drop some file here, or click to select file</h1>
      }
    </div>

    <div className='mt-8 '>
      <h1 className='text-2xl mb-4  text-white'> Files in AWS database listed below : </h1>
      {files && files.length}
      {files && files.size > 0 ?  Array.from(files).map((file)=>(
          <div className='w-full bg-slate-400 p-3 rounded-lg mb-3 flex flex-row justify-between' >
            <h1 className='font-semibold'>{file}</h1>
            <button className='p-2 rounded-lg bg-slate-500' onClick={()=>deleteFile(file)}>Delete</button>
          </div>
      )) : <></>}

    


    </div>

    </div>
  )
}

export default File
