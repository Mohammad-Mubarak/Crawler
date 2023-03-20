require("dotenv").config()  // using dotenv for providing security

const finaldata = require("./model/finaldata")

// connecting database 
require("./database/connect")

const request = require("request");
const { default: puppeteer } = require("puppeteer");
const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const joinurl = path.join(__dirname, "./public");
app.use(express.static(joinurl));

app.get("/", (req, res) => {
	res.sendFile(joinurl, "index.html");
});

app.post("/", async (req, res) => {
	// i just created empty object 
	var Convertedata = {};

	// destructuring url 
	const { name } = req.body;

	// setting object property 
	Convertedata.seed_url = name;
	Convertedata.current_url = name;

	var data = Date.now();
	function TakeScreenshotAndExtractHtml() {
		request(name, (error, response, html) => {
			// html content
			const htmlContent = html;

			// creating  file 
			const value = fs.writeFile(
				`./html/mypage${data}.html`,
				htmlContent,
				(err) => {
					if (err) throw err;
					console.log("The file has been saved!");
					Convertedata.html = htmlContent;
				}
			);
		});
	}
	// calling function and passing name as argument
	TakeScreenshotAndExtractHtml(name);

	// taking screentshot of provided url
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport({ width: 1920, height: 1080 });
	await page.goto(name);

	await page.screenshot({ path: `google${data}.png` ,fullPage:true });
	await browser.close();

	//  converting image into base64
	let file = fs.readFileSync(`./google${data}.png`, { encoding: "base64" });
	Convertedata.base64_image = file;

	// storing in database
	const SiteResponse =await finaldata.create(Convertedata)
	res.json(SiteResponse);
});

// listing on port 
app.listen(3000, () => {
	console.log("port runnning");
});
