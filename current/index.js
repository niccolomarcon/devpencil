var request = new XMLHttpRequest();
request.open('GET', 'html.html', true);

request.onload = function() {
  if (this.status >= 200 && this.status < 400) {
    document.body.innerHTML = this.response;
    var script = document.createElement('script');
    script.src = 'javascript.js';
    document.body.appendChild(script);
  }
};

request.send();
