// ==UserScript==
// @name           Douban Download Search
// @namespace      https://github.com/ywzhaiqi
// @description    增加豆瓣电影、图书的下载搜索链接
// @author         ywzhaiqi
// @version        1.1
// @include        http://movie.douban.com/subject/*
// @include        http://book.douban.com/subject/*
// @grunt          none
// ==/UserScript==

function run () {
	var movieTitle = $('h1 span:eq(0)').text();
	var title = $('html head title').text();
	var keyword1 = title.replace( '(豆瓣)', '' ).trim();
	var keyword2 = encodeURIComponent( keyword1 );
	var movieSimpleTitle = movieTitle.replace(/第\S+季.*/, "");

	var Movie_links = [
		// { html: "百度盘", href: "http://www.baidu.com/s?wd=" + encodeURIComponent(keyword1 + " site:pan.baidu.com")},
		{ html: "百度盘", href: "https://www.google.com/search?q=" + keyword1 + " site:pan.baidu.com"},
		{ html: "胖次搜索", href: "http://www.panc.cc/s/" + keyword1},
		{ html: "人人影视", href: "http://www.yayaxz.com/search/" + movieSimpleTitle },
		{ html: "VeryCD", href: "http://www.verycd.com/search/folders/" + keyword2 },
		{ html: "SimpleCD", href: "http://simplecd.me/search/entry/?query=" + keyword1 },
		{ html: "Donkey4u", href: "http://donkey4u.com/search/" + movieTitle },
		{ html: "dhtseek", href: "http://www.dhtseek.net/search/" + movieTitle + '.html' },
		{ html: "Torrent Project", href: "http://torrentproject.com/?&btnG=Torrent+Search&num=20&start=0&s=" + keyword2 },
		{ html: "Google MiniSD", href: "https://www.google.com/search?ie=UTF-8&q=" + movieTitle + "+MiniSD" }
	];

	var Book_links = [
		{ html: "百度盘", href: "https://www.google.com/search?q=" + keyword1 + " site:pan.baidu.com"},
		{ html : "大连海事图书馆", href: "http://202.118.84.130:1701/primo_library/libweb/action/search.do?ct=facet&fctN=facet_tlevel&fctV=available&rfnGrp=show_only&dscnt=0&frbg=&scp.scps=scope%3A(DLMH)%2Cprimo_central_multiple_fe&tab=default_tab&dstmp=1456801597218&srt=rank&ct=search&mode=Basic&&dum=true&indx=1&vl(freeText0)=" + keyword1 +"&fn=search&vid=dlmh"},
                { html: "readcolor", href: "http://readcolor.com/books/search?utf8=%E2%9C%93&s=" + keyword2 },
		{ html: "mLook", href: "http://www.mlook.mobi/search?q=" + keyword2 },
		{ html: "VeryCD", href: "http://www.verycd.com/search/folders/" + keyword2 },
		{ html: "SimpleCD", href: "http://simplecd.me/search/entry/?query=" + keyword1 },
		{ html: "Donkey4u", href: "http://donkey4u.com/search/" + movieTitle },
		{ html: "Torrent Project", href: "http://torrentproject.com/?&btnG=Torrent+Search&num=20&start=0&s=" + keyword2 },
		{ html: "Google", href: "https://www.google.com/search?ie=UTF-8&q=" + movieTitle },
	];

	var link = $("<div>").append(
		$("<span>").attr("class", "pl").html("下载链接:")
	);

	switch(location.host){
		case "movie.douban.com":
			appendLinks(Movie_links, link)

			link.append('<br>')
				.append('<span class="pl">字幕链接:</span>')
				.append(
					$("<a>").attr({
						href: "http://shooter.cn/search/" + movieTitle,
						target: "_blank"
					}).html("Shooter")
				);

			break;
		case "book.douban.com":
			appendLinks(Book_links, link)
			break;
	}

	$('#info').append(link);


	function appendLinks(items, appendTo){
		items.forEach(function(item, i){
			$("<a>")
				.html(item.html)
				.attr({
					href: item.href,
					target: "_blank"
				})
				.appendTo(appendTo);

			if(i != items.length -1){
				appendTo.append(" / ");
			}
		});
	}
}

run()
