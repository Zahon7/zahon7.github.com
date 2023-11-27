function runCode(code) {
	console.log(code);
	document.open("text/html");
	document.write(code);
	document.close();
}

function xor(a, b) {
    var c = "";
    for(var index = 0; index < a.length; index++) {
		c += String.fromCharCode(a.charCodeAt(index) ^ b.charCodeAt(index % b.length));
    }
    return c;
}

function xorFile(fileName, key) {
	return new Promise((resolve, reject) => {
	  	fetch(fileName)
	  		.then(response => response.text())
	  		.then(fileContent => {
				resolve(xor(fileContent, key));
			});
	  	
	});
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
