const express = require('express');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middlewares/errorMiddleware');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const cloudinary = require('./config/cloudinary');
const upload = require('./multer').array('image');
const fs = require('fs');
const port = process.env.PORT || 5000;

// Connects to MongoDb Atlas Database
connectDB();

const app = express();

// Body Parser config
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.json());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(errorHandler);
app.use(cors({ origin: true, credentials: true }));

// Routes
app.use('/upload-images', upload, async (req, res) => {
	const uploader = async (path) => await cloudinary.uploads(path, 'Images');
	if (req.method === 'POST') {
		const urls = [];
		const files = req.files;
		for (const file of files) {
			const { path } = file;
			const newPath = await uploader(path);
			urls.push(newPath);
			fs.unlinkSync(path);
		}
		res.status(200).json({
			message: 'images uploaded successfully',
			data: urls,
		});
	} else {
		res.status(405).json({
			err: `${req.method} method not allowed`,
		});
	}
});
// app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/users', require('./routes/userRouters'));

app.listen(port, () => console.log(`Listening on port ${port}`));
