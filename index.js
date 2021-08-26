const ytdl = require('ytdl-core');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});


async function download(url) {
	const songname = await ytdl.getInfo(url);
	console.log('Starting Download on ' + songname.videoDetails.title);
	const writeableStream = fs.createWriteStream(`export/${songname.videoDetails.title}.mp4`);
	ytdl(url, {
		format: 'mp4',
	}).pipe(writeableStream);

	writeableStream.on('finish', () => {
		rl.close();
	});
}


rl.question('URL you want to download from youtube ' + '\n', function(URL) {
	const valid = ytdl.validateURL(URL);
	if (valid == true) {
		download(URL);
	}
	else {
		console.log('Not a valid url please try again');
		process.exit(0);
	}
});


rl.on('close', function() {
	console.log('\nDownload Finished');
	process.exit(0);
});
