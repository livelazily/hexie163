// ==UserScript==
// @name           网易新闻和谐指数
// @namespace      mybeky
// @include        http://*.163.com/*
// ==/UserScript==

(function() {
	var comment_links = document.getElementsByClassName('js-tielink');
	if (!comment_links) return;

	var comment_link = comment_links[0];
    if(!comment_link) return;

	var _scripts = document.getElementsByTagName('script');
	for (var i = 0; i < _scripts.length; i++) {
		var _script = _scripts[i];
		if (_script.src) continue;
        var _ids = _script.innerText.match(/threadId = "(.*?)"(?:.|[\r\n])*boardId = "(.*?)"/);
		if (_ids) {
			var threadId = _ids[1];
			var boardId = _ids[2];

			var m_url = "http://comment.3g.163.com/" + boardId + "/" + threadId + ".html";
			GM_xmlhttpRequest({
				method: "GET",
				url: m_url,
				onload: function(response) {
					debugger;
					var content = response.responseText;
					var _ = content.match(/评论共(\d+)条 显示(\d+)条/);
					if (_) {
						var total = _[1];
						var show = _[2];
						var p = (total == 0) ? 1: show / total;
						var percent_text = (100 - p * 100).toFixed(2);
						comment_link.innerHTML += ' (' + percent_text + '%)';
					}
				}
			});
			return;
		}
	}
})();

