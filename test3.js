const fs = require("fs");
const request = require("request");

const filePath = "./build.bat";
const accessToken = "ya29.A0AfH6SMCtSpCEkHiLrC-d6GUHpZozAwBTaVHRTZtCNeCKrsGLVYX_-77R1qXLbi8-tbgbaK2jxMVTwiSOeS01Of7hp5-UILsNvPoxgp4fvZ3Vrb5tMps1NDH6UxZ89WoB1NR8SYFS8XJft86wDyavQAK3vZVwpMrkC_U0YDjNL0M7";

fs.readFile(filePath, function (err, content) {
  if (err) {
    console.error(err);
  }
  const metadata = {
    name: "sample.txt",
  };
  const boundary = "xxxxxxxxxx";
  let data = "--" + boundary + "\r\n";
  data += 'Content-Disposition: form-data; name="metadata"\r\n';
  data += "Content-Type: application/json; charset=UTF-8\r\n\r\n";
  data += JSON.stringify(metadata) + "\r\n";
  data += "--" + boundary + "\r\n";
  data += 'Content-Disposition: form-data; name="file"\r\n\r\n';
    console.log("data:", data);
	console.log("content:"+ content);
  const payload = Buffer.concat([
    Buffer.from(data),
    Buffer.from(content),
    Buffer.from("\r\n--" + boundary + "--\r\n", "utf8"),
  ]);
  console.log("payload:"+ payload);
  request(
    {
      method: "POST",
      url:
        //"https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
	  "http://localhost:8092/upload/drive/v3/files?uploadType=multipart",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "multipart/form-data; boundary=" + boundary,
      },
      body: payload,
    },
    (err, res, body) => {
      if (err) {
        console.log(body);
        return;
      }
      console.log(body);
    }
  );
});