// ==UserScript==
// @name           网易新闻和谐指数
// @namespace      http://github.com/livelazily/hexie163
// @version        0.1
// @description    based on http://userscripts.org/scripts/show/98749
// @include        http://*.163.com/*
// ==/UserScript==
(function() {
	var _host_name = window.location.hostname;

	var m_url, element;
	if (!_host_name.match(/^comment/)) { // news page
		var _comment_links = document.getElementsByClassName('js-tielink');
		if (!_comment_links) return;

		element = _comment_links[0];
		if (!element) return;

		var _scripts = document.getElementsByTagName('script');
		for (var i = 0; i < _scripts.length; i++) {
			var _script = _scripts[i];
			if (_script.src) continue;
			var _ids = _script.innerText.match(/threadId = "(.*?)"(?:.|[\r\n])*boardId = "(.*?)"/);
			if (_ids) {
				var _threadId = _ids[1];
				var _boardId = _ids[2];

				var _tieChannel = window.location.hostname.match(/(.*)\.163\.com/);
				if (_tieChannel) {
					var _channel = _tieChannel[1];
					element.href = "http://comment." + _channel + ".163.com/" + _boardId + "/" + _threadId + ".html";
				}
				m_url = "http://comment.3g.163.com/" + _boardId + "/" + _threadId + ".html";
				break;
			}
		}
	} else { // comment page
		var _url = document.URL;
		m_url = _url.replace(/comment.*?163/, 'comment.3g.163');
		var _comment_counts = document.getElementsByClassName('joinCount');
		if (!_comment_counts) return;

		element = _comment_counts[0];
		if (!element) return;
	}

	GM_xmlhttpRequest({
		method: "GET",
		url: m_url,
		onload: function(response) {
			var content = response.responseText;
			var _ = content.match(/评论共(\d+)条 显示(\d+)条/);
			if (_) {
				var total = _[1];
				var show = _[2];
				var p = (total == 0) ? 1: show / total;
				var percent_text = (100 - p * 100).toFixed(2);
				element.innerHTML += ' (' + percent_text + '%)';
			}
		}
	});
})();

