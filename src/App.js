import html2canvas from "html2canvas";
import React, { useState, useRef } from "react";
import "./App.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
	AddBox,
	ArrowBack,
	ArrowDownward,
	ArrowForward,
	ArrowLeft,
	ArrowRight,
	ArrowUpward,
	ForkLeftRounded,
	Share,
} from "@mui/icons-material";

function App() {
	const [images, setImages] = useState(["./demo.jpg"]);
	const [mainImg, setMainImg] = useState();
	const [panel, setPanel] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [promt, setPromt] = useState("");
	const [bubblePosition, setBubblePosition] = useState({
		top: "0%",
		left: "0%",
	});
	const [isBubbleVisible, setIsBubbleVisible] = useState(false);

	const moveBubble = (direction) => {
		const increment = 10;
		let { top, left } = bubblePosition;

		switch (direction) {
			case "up":
				top = `${parseFloat(top) - increment}px`;
				break;
			case "down":
				top = `${parseFloat(top) + increment}px`;
				break;
			case "left":
				left = `${parseFloat(left) - increment}px`;
				break;
			case "right":
				left = `${parseFloat(left) + increment}px`;
				break;
			default:
				break;
		}
		setBubblePosition({ top, left });
	};

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

	const parentDivRef = useRef();
	const mainParentRef = useRef();

	const handleAdd = async () => {
		const parentDiv = mainParentRef.current;
		// console.log(parentDiv);

		const canvas = await html2canvas(parentDiv);
		const dataUrl = canvas.toDataURL("image/png");
		setPanel((prev) => [...prev, dataUrl]);
	};

	const handleDownloadClick = async () => {
		const parentDiv = parentDivRef.current;
		// console.log(parentDiv);
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
	const toggleBubbleVisibility = () => {
		setIsBubbleVisible(!isBubbleVisible);
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
					<div className="editBubble">
						<label>
							<input
								type="checkbox"
								checked={isBubbleVisible}
								onChange={toggleBubbleVisibility}
							/>
							Show/Hide Bubble
						</label>
						<div className="horizontal">
							<button onClick={() => moveBubble("left")}>
								{" "}
								<ArrowBack />{" "}
							</button>
							<button onClick={() => moveBubble("right")}>
								<ArrowForward />
							</button>
						</div>
						<div className="vertical">
							{" "}
							<button onClick={() => moveBubble("up")}>
								<ArrowUpward />
							</button>
							<button onClick={() => moveBubble("down")}>
								<ArrowDownward />
							</button>
						</div>
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
					<div
						className="mainParent"
						ref={mainParentRef}
						style={{ position: "relative" }}
					>
						<img src={mainImg} alt="" />
						{isBubbleVisible && (
							<img
								src="./bubble.png"
								alt="Speech Bubble"
								className="speechBubble"
								style={{
									position: "absolute",
									top: bubblePosition.top,
									left: bubblePosition.left,
									transform: " scale(0.3)",
									transition: "0.3s ease",
								}}
							/>
						)}
					</div>
				</div>
			</div>
			<div className="comic">
				<div className="comic_header">
					<h2>Your comic</h2>
					<button className="download" onClick={handleDownloadClick}>
						Share <Share />
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
