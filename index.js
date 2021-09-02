const ytdl = require('ytdl-core');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

async function download(url) {
	const songinfo = await ytdl.getInfo(url);
	const title = songinfo.videoDetails.title;
	const afterReg = title.replace(/[^a-z0-9]/gi, ' ');

	console.log('Starting Download on ' + afterReg);
	fs.writeFile('export/' + afterReg + '.txt', ` Video owners profile: ${songinfo.videoDetails.ownerProfileUrl} \n Views: ${songinfo.videoDetails.viewCount}\n Likes: ${songinfo.videoDetails.likes}\n Dislikes: ${songinfo.videoDetails.dislikes}\n Video URL: ${songinfo.videoDetails.video_url}\n Video \n Description: \n\n${songinfo.videoDetails.description}`, function(err) {
		if (err) return console.log(err);
	});

	const writeableStream = fs.createWriteStream(`export/${afterReg}.mp4`);
	
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
