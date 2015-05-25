exports.getExample = function (source) {
	console.log("works");

	// response needs to be sent as string
	// USE JSON.stringify to convert objects to string
	// parse response on client
	var response = {
		test: "works"
	};

	source.res.status(200).send(JSON.stringify(response));
}