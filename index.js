const ytdl = require('ytdl-core');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

async function download(url) {
	const songinfo = await ytdl.getInfo(url);
	console.log('Starting Download on ' + songinfo.videoDetails.title);
	fs.writeFile('export/' + songinfo.videoDetails.title + '.txt', ` Video owners profile: ${songinfo.videoDetails.ownerProfileUrl} \n Views: ${songinfo.videoDetails.viewCount}\n Likes: ${songinfo.videoDetails.likes}\n Dislikes: ${songinfo.videoDetails.dislikes}\n Video URL: ${songinfo.videoDetails.video_url}\n Video Thumbnail: ${songinfo.videoDetails.thumbnails[4].url} \n Description: \n\n${songinfo.videoDetails.description}`, function(err) {
		if (err) return console.log(err);
	});

	const writeableStream = fs.createWriteStream(`export/${songinfo.videoDetails.title}.mp4`);
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
