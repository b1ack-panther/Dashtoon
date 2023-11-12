import html2canvas from "html2canvas";
import React, { useState, useRef } from "react";
import "./App.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { AddBox, Share } from "@mui/icons-material";

function App() {
	const [images, setImages] = useState([]);
	const [mainImg, setMainImg] = useState();
	const [panel, setPanel] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [promt, setPromt] = useState("");
	const [horizontal, setHorizontal] = useState(50);
	const [vertical, setVertical] = useState(50);

	async function query(data) {
		try {
			setIsLoading(true);
			const response = await fetch(
				"https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
				{
					headers: {
						Accept: "image/png",
						Authorization:
							"Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
						"Content-Type": "application/json",
					},
					method: "POST",
					body: JSON.stringify(data),
				}
			);
			const result = await response.blob();
			setIsLoading(false);
			return result;
		} catch (e) {
			setIsLoading(false);
			console.log("error");
		}
	}

	const generate_img = () => {
		for (let i = 0; i < 10; i++) {
			if (i == 0) {
				setImages([]);
			}
			query({ inputs: promt }).then((response) => {
				const imageUrl = URL.createObjectURL(response);
				setImages((prev) => [...prev, imageUrl]);
				console.log(imageUrl);
			});
		}
	};

	const handleEnterKeyPress = (e) => {
		if (e.key === "Enter") {
			generate_img();
		}
	};

	const handleImgClick = (index) => {
		setMainImg(images[index]);
	};

	const handleAdd = () => {
		setPanel((prev) => [...prev, mainImg]);
	};

	const parentDivRef = useRef();

	const handleDownloadClick = async () => {
		const parentDiv = parentDivRef.current;

		try {
			const canvas = await html2canvas(parentDiv);
			const dataUrl = canvas.toDataURL("image/png");
			const downloadLink = document.createElement("a");
			downloadLink.href = dataUrl;
			downloadLink.download = "downloaded_image.png";
			downloadLink.click();
		} catch (error) {
			console.error("Error capturing content:", error);
		}
	};

	return (
		<div className="app">
			<div className="header">
				<img src="./logo.png" alt="" />
				<div className="nav">
					<p>Home</p>
					<p>About</p>
				</div>
			</div>
			<div className="container">
				<div className="left">
					<textarea
						onKeyDown={handleEnterKeyPress}
						className="promt_input"
						onChange={(e) => setPromt(e.target.value)}
						type="text"
						placeholder="Enter Prompt"
					/>
					<div className="buttons">
						<button className="generate_btn" onClick={generate_img}>
							Generate <CheckCircleIcon />
						</button>
					</div>
					{/* <div className="horizontal">
						<label htmlFor="horizontal">Horizontal: {horizontal}</label>
						<input
							type="range"
							value={horizontal}
							min={0}
							max={100}
							onChange={(e) => setHorizontal(e.target.value)}
						/>
					</div>
					<div className="vertical">
						<label htmlFor="vertical">Vertical: {vertical}</label>
						<input
							type="range"
							value={vertical}
							min={0}
							max={100}
							onChange={(e) => setVertical(e.target.value)}
						/>
					</div> */}

					<p className="styletext">Options</p>
					<div className="option">
						{isLoading ? (
							<div className="isLoading">
								<p>Loading...</p>
								<p>Please wait till images are ready</p>
							</div>
						) : (
							images.map((image, index) => (
								<img
									key={index}
									onClick={() => handleImgClick(index)}
									src={image}
									alt="no image found"
								/>
							))
						)}
					</div>
				</div>
				<div className="right">
					<div className="rheader">
						<h2>Panel</h2>
						<button className="add" onClick={handleAdd}>
							Add
							<AddBox />
						</button>
					</div>
					<img src={mainImg} alt="" />
				</div>
			</div>
			<div className="panel">
				<div className="panel_header">
					<h2>Your comic</h2>
					<button className="download" onClick={handleDownloadClick}>
						Share <Share/>
					</button>
				</div>
				<div className="parentDiv" ref={parentDivRef}>
					{panel.map((image, index) => (
						<img src={image} key={index} alt="" />
					))}
				</div>
			</div>
		</div>
	);
}

export default App;
