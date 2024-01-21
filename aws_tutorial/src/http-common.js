import axios from "axios";

export default axios.create({
  baseURL:
  "http://localhost:8000/", // for local development
  // "http://3.149.234.124:8000", //when deployed in seperate containers

  headers: {
    'Content-Type': 'multipart/form-data' ,   
    "Access-Control-Allow-Origin": "*",
  },
});