const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = 3456;
const MIME = {
  ".html":"text/html",".css":"text/css",".js":"application/javascript",
  ".jpg":"image/jpeg",".jpeg":"image/jpeg",".png":"image/png",
  ".webp":"image/webp",".svg":"image/svg+xml",".ico":"image/x-icon"
};
const ROOT = __dirname;
http.createServer((req,res)=>{
  let urlPath = req.url.split("?")[0];
  if(urlPath==="/") urlPath="/index.html";
  const file = path.join(ROOT, urlPath);
  const ext = path.extname(file).toLowerCase();
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404);res.end("Not found");return;}
    res.writeHead(200,{"Content-Type":MIME[ext]||"application/octet-stream"});
    res.end(data);
  });
}).listen(PORT,()=>console.log(`Server running on http://localhost:${PORT}`));
