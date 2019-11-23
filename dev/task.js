const fs = require("fs");
const exec = require("child_process");
const tsc = "node_modules/typescript/bin/tsc";
const uglify = require("uglify-js");


let args = " -p tsconfig.json";
let result = exec.spawnSync("node", [tsc + args], { shell: true, cwd: process.cwd(), env: process.env, stdio: "pipe", encoding: "utf-8" });
if (result.status > 0)
{
	console.log("Transpile Failed:");
	if (result.stdout) console.log(result.stdout);
	if (result.stderr) console.log(result.stderr);
	process.exit(1);
}
if (result.stdout !== "")
{
	if (result.stdout.charAt(result.stdout.length - 1) === "\n") result.stdout = result.stdout.substr(0, result.stdout.length - 1);	// Remove extra new line
	console.log("Transpile Output:");
	console.log(result.stdout);
}
let js = fs.readFileSync("bin/unmute.js", "utf8");


let opts = {
	toplevel: false,
	warnings: false, //"verbose",
	mangle: true,
	compress: {
		keep_infinity: true,
		collapse_vars: false
	}
	//, output: { beautify: true, width: 999999 }
};
result = uglify.minify(js, opts);
if (result.error)
{
	console.log(result.error);
	console.log("JS Compress Error:", result.error);
	process.exit(1);
}
else if (result.warnings)
{
	console.log("JS Compress Warnings:");
	for (let i = 0; i < result.warnings.length; ++i) console.log("   ", result.warnings[i]);
}
fs.writeFileSync("bin/unmute.min.js", result.code);

fs.copyFileSync("src/index.html", "bin/index.html");
fs.copyFileSync("src/test.mp3", "bin/test.mp3");
