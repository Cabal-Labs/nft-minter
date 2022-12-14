import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import "./Styles/App.css";

import MainBox from "./components/MainBox";

function App() {
	useEffect(() => {
		document.body.style.overflow = "hidden";
	}, []);

	return (
		<div className="App">
			<Navbar />
			<h1>Cabal Minter</h1>
			<MainBox />
		</div>
	);
}

export default App;
