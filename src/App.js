import { useState } from "react";
import "./App.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Add, Share } from "@mui/icons-material";

function App() {
	const [images, setImages] = useState([]);
	const [mainImg, setMainImg] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [promt, setPromt] = useState("");

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
		query({ inputs: promt }).then((response) => {
			const imageUrl = URL.createObjectURL(response);
			setMainImg(imageUrl);
			console.log(imageUrl);
		});
	};
	const handleMainImg = () => {
		setImages((prev) => [...prev, mainImg]);
	};

	
	const handleEnterKeyPress = (e) => {
		if (e.key === 'Enter') {
			generate_img();
		}
	}

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
						placeholder="Enter Promt"
					/>
					<div className="buttons">
						<button className="generate_btn" onClick={generate_img}>
							Generate <CheckCircleIcon />
						</button>
						<button onClick={handleMainImg} className="reset_btn">
							Add <Add />
						</button>
						<button className="share">Share<Share/> </button>
					</div>
					{isLoading ? (
						<div className="isLoading">
							<p>Loading...</p>
							<p>Please wait till your Image is ready</p>
						</div>
					) : (
						<img className="main" src={mainImg} alt="" />
					)}
				</div>
				<div className="right">
					<h2>Your Comic</h2>
					{images.map((image, index) => (
						<img key={index} src={image} alt="no image found" />
					))}
				</div>
			</div>
		</div>
	);
}

export default App;
