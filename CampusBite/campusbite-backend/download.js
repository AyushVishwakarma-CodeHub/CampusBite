const fs = require('fs');

async function downloadImage() {
    const url = "https://loremflickr.com/800/600/indian,food";
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Status: ${res.status}`);

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        fs.writeFileSync("public/images/punjabi_tadka.jpg", buffer);
        console.log("Image downloaded successfully as JPG. Size:", buffer.length);
    } catch (err) {
        console.error(err);
    }
}
downloadImage();
