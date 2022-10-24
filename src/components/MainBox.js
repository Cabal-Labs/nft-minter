import React, { useState, useEffect } from "react";
import "./../Styles/MainBox.css"
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import exampleIMG from "./../exampleIMG.json"
import {NFTStorage, File} from "nft.storage";
import {ethers} from "ethers"
import AICabalNFT from "./../ABIs/AICabalNFT.json"



export default function MainBox() {

    const { address, isConnected } = useAccount()
    const [_image,setImage] = useState(`${exampleIMG.example}`)

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
        const d = await dataURLtoFile(`data:image/jpeg;base64,${_image}`, "cabalLabs.jpeg");

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
        console.log(" couls not safe NFT ", error)
      }

    }


    async function AIimage() {
      fetch( process.env.REACT_APP_API_ADD + address).then(
        res => res.json()
      ).then(
        data => {
          console.log(data)
          const img = data.image
          setImage(img[0])
        }
      )
    }

    const onClick = () => {
      storeImage();
    }
    return (
    <div className="mainBox flex-row-vcenter"> 
      <div className=" flex-col-hstart-vstart clip-contents">
            <div className="imageBox flex-col-hcenter">
                <div className="innerBox">
                <img
                    src={`data:image/jpeg;base64,${_image}`}
                    alt="Not Found"
                    className="img_style"
                />
                </div>
              
                <div className="flex-row">
                    <div  onClick={() => {AIimage()}} className="Button-Box">
                        <p className="txt-614">Generate</p>
                    </div>
                    <div onClick={() => {onClick();}} className="Button-Box">
                        <p className="txt-614">Mint NFT</p>
                    </div>
                </div>
            </div>
            <div className="chat-side">
                
            </div>

    </div>
      </div>
    )
}