import React from "react";
import './../Styles/navbar.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';


export default function Navbar() {

    return (

        <nav className="nav">
            <img className="img" src="./Assets/logo.png" alt="logo"/>
			<div >
				<i ></i>
			</div>
			<ul >

			</ul>
			<div ></div>
            <div className="connector">
                <ConnectButton />
            </div>
		</nav>

    )
}