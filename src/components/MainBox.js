import React, { useState, useEffect } from "react";
import "./../Styles/MainBox.css"
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import exampleIMG from "./../exampleIMG.json"
import {NFTStorage, File} from "nft.storage";
import {ethers} from "ethers"
import AICabalNFT from "./../ABIs/AICabalNFT.json"
import Carousel, {next} from 'react-material-ui-carousel'
import { Paper, Button } from '@mui/material'



export default function MainBox() {
  const { address, isConnected } = useAccount()
  const [_image,setImage] = useState([{
    id: -1,
    src: `${exampleIMG.example}`
  }])
  const [counter, setCounter] = useState(0)
  const [current, setCurrent] = useState(0)


    

    function dataURLtoFile(dataurl, filename) {
 
      var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), 
          n = bstr.length, 
          u8arr = new Uint8Array(n);
          
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      
      return new File([u8arr], filename, {type: "image/jpeg"});
    }

  

    async function storeImage() {

      const client = new NFTStorage({
        token: process.env.REACT_APP_NFT_STORAGE_API_KEY,
      });

      try {
        const d = await dataURLtoFile(`data:image/jpeg;base64,${_image[current].src}`, "cabalLabs.jpeg");

        await client.store({
          image: d,
          name:`${address}: Cabal Labs AI Generated NFT`,
          description:
          "This NFT is created just for you, it uses your wallet addres to come up with art. Welcome to the Cabal...",
        }).then( async (metadata) => {
          let metadataArray = metadata.url.split("/")
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner()

          let contract= new ethers.Contract(process.env.REACT_APP_CONTRACT_ADD,AICabalNFT, signer)

          const price = await contract.salePrice();
          const mint = await contract.mintNFT(`https://${metadataArray[2]}.ipfs.w3s.link/${metadataArray[3]}`,{value: price})
          

          console.log("metadata saved: ", mint)
        })
      } catch(error) {
        console.log(" could not safe NFT ", error)
      }

    }




    async function AIimage() {
      fetch( process.env.REACT_APP_API_ADD + address).then(
        res => res.json()
      ).then(
        data => {
          console.log(data)
          const img = data.image
          if (counter < 1) {
            setImage(first =>
              first.filter(first => {
                return first.id !== -1;
              }),
            );
          }
          setImage((_image) => [..._image,{id: counter, src: img[0] }])
          setCounter(counter + 1)
          
        }
      )
    }

    const onClick = () => {
      console.log(_image[current])
      storeImage();
    }
    return (
    <div className="mainBox flex-row-vcenter"> 
      <div className=" flex-col-hstart-vstart clip-contents">
            <div className="imageBox flex-col-hcenter">
                <div className="innerBox">

                <Carousel  
                autoPlay={false}
                next={ (next) => {setCurrent(next);} }
                prev={ (prev) => {setCurrent(prev);} }
                navButtonsAlwaysVisible={true}
                >
                {
                _image.map( image => <img
                src={`data:image/jpeg;base64,${image.src}`}
                alt="Not Found"
                className="img_style"
                /> )
                }
              </Carousel>
                </div>
              
                <div className="flex-row">
                  { counter < 3
                    ?<div  onClick={() => {AIimage()}} className="Button-Box">
                    <p className="txt-614">Generate</p>
                    </div>
                    :
                    <div className="Button-Box-disabled">
                    <p className="txt-614">Generate</p>
                    </div>
                  }
                    
                    <div onClick={() => {onClick();}} className="Button-Box">
                        <p className="txt-614">Mint NFT</p>
                    </div>
                </div>
            </div>
           
          </div>
           <div className="terminal">
              <h2 style={{position:"relative", left: "35%"}}>Cabal Labs</h2>
              <p>{">"} Welcome to the Cabal Labs NFT Minter</p>
              <p>{">"} We use AI to create art just for you</p>
              <p>{">"} We use your public addres to generate something unique to this account</p>
              <p>{">"} You can generate up to 3 images, select the one you like and click "Mint NFT"</p>

            </div>

      </div>
    )
}