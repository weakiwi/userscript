// ==UserScript==
// @name         豆瓣读书海事大学图书馆插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://book.douban.com/subject/*
// @grant        none
// @grant        GM_xmlhttpRequest
// ==/UserScript==
/* jshint -W097 */
function run () {
	var movieTitle = $('h1 span:eq(0)').text();
	var title = $('html head title').text();
	var keyword1 = title.replace( '(豆瓣)', '' ).trim();
	var keyword2 = encodeURIComponent( keyword1 );
	var movieSimpleTitle = movieTitle.replace(/第\S+季.*/, "");

	var Movie_links = [
		// { html: "百度盘", href: "http://www.google.com/s?wd=" + encodeURIComponent(keyword1 + " site:pan.baidu.com")},
		{ html: "百度盘", href: "http://www.panc.cc/s/" + keyword1},
		{ html: "SimpleCD", href: "http://simplecd.me/search/entry/?query=" + keyword1 },
		{ html: "dhtseek", href: "http://www.dhtseek.net/search/" + movieTitle + '.html' },
		{ html: "Torrent Project", href: "http://torrentproject.com/?&btnG=Torrent+Search&num=20&start=0&s=" + keyword2 },
		{ html: "Google MiniSD", href: "https://www.baidu.com/search?ie=UTF-8&q=" + movieTitle + "+MiniSD" }
	];

	var Book_links = [
		{ html: "百度盘", href: "http://www.panc.cc/s/" + keyword1},
        { html : "大连海事图书馆", href: "http://202.118.84.130:1701/primo_library/libweb/action/search.do?ct=facet&fctN=facet_tlevel&fctV=available&rfnGrp=show_only&dscnt=0&frbg=&scp.scps=scope%3A(DLMH)%2Cprimo_central_multiple_fe&tab=default_tab&dstmp=1456801597218&srt=rank&ct=search&mode=Basic&&dum=true&indx=1&vl(freeText0)=" + keyword1 +"&fn=search&vid=dlmh"},
		{ html: "readcolor", href: "http://readcolor.com/books/search?utf8=%E2%9C%93&s=" + keyword2 },
		{ html: "Google", href: "https://www.google.com/search?ie=UTF-8&q=" + movieTitle },
	];

	var link = $("<div>").append(
		$("<span>").attr("class", "pl").html("下载链接:")
	);
    isbn = getISBN();
    function newztflh(book_name, book_location, book_ztflh, book_states) {
        this.book_name = book_name;
        this.book_location = book_location;
        this.book_states = book_states;
        this.book_ztflh = book_ztflh;
    }
    var ztflh = new newztflh('','','','');
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://115.28.1.228/xx1.php?search="+keyword1,
        synchronous : false,
        onload: function(response) {
            var obj = JSON.parse(response.responseText);
            if (obj.book_name == null) {
                ztflh.book_name = "找不到该书籍";
            }
            else{
                ztflh.book_name = obj.book_name;
                ztflh.book_location = obj.book_location;
                if (obj.book_states == null) {
                    ztflh.booke_states = '';
                }
                else {
                    ztflh.book_states = obj.book_states;
                }
                ztflh.book_ztflh = obj.book_ztflh;
            }                
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
                    link.append('<br>')
                        .append('<span class="pl">图书馆信息 :</span>'+'<br />'+ztflh.book_name+' '+'<br />'+ztflh.book_location+' '+'<br />'+ztflh.book_ztflh+' '+'<br />'+'<b>'+ztflh.book_states+'</b>'+'<br />')
                    break;
            }

            $('#info').append(link);
        }
    });    


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
    function getISBN(){
        var rawBookInfo=document.getElementById("info").innerHTML;
        var isbn = /ISBN:<\/span>(.*)<br>/.exec(rawBookInfo);
        if (isbn !== null){
            isbn = isbn[1].trim();
        }
        return isbn;
    }
}

run()

// Your code here...
