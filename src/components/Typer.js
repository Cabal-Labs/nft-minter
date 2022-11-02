import React, {useState, useEffect, useRef} from "react";
import "./../Styles/MainBox.css"


export default function Typer({text, terminalCounter, setTerminalCounter, increase}) {
    const index = useRef(0);

    const [currentText, setCurrentText] =  useState(" ");

    useEffect(() => {
        index.current = 0;
        setCurrentText(""); 
        
    }, [text])

    useEffect(() => {
        let timeId;
        if (index.current < (text.length - 1)){
            timeId = setTimeout(() => {
                setCurrentText((value) => value + text.charAt(index.current))
                index.current+=1;
            }, 50)
        }       
        return () => {
            clearTimeout(timeId)

        };
    },[currentText, text])

    useEffect(() => {

        if((index.current >= (text.length-1) ) && increase){
            let d = (1 + terminalCounter)
            setTerminalCounter(d)
            
        }
        
    }, [index.current])

    return <div className="text">{"> "}nft-minter % {currentText}</div>
}