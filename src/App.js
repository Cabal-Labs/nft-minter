import React, { useState, useEffect }  from 'react';
import Navbar from "./components/Navbar";
import './Styles/App.css';
import { generateAsync } from 'stability-client'





function App() {

  const [image,setImage] = useState([""])


  useEffect(() => {
    document.body.style.overflow = "hidden";
  },[])

  async function AIimage() {
    fetch("http://127.0.0.1:5000/image?account=0xf4F164f8cb9b8A3f9A6E4d550cbf2eE5051Ebe17").then(
      res => res.json()
    ).then(
      data => {
        console.log(data)
        const img = data.image
        setImage(img[0])
      }
    )
    
  }

  return (
    <div className="App" >
      <Navbar/>
      {/*<img src={"data:image/jpeg;base64," + image} width={"250px"} height={"auto"}/>*/}

      
      
      
        
      
    </div>
  );
}

export default App;
