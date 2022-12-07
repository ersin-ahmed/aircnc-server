const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		location: {
			type: String,
			required: [true, 'Please add a location value'],
		},
		availability: {
			type: String,
		},
		price: {
			type: String,
		},
		category: {
			type: String,
		},
		postedBy: {
			type: String,
		},
		images: {
			type: Array,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Post', postSchema);
