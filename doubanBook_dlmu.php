<?php
    error_reporting(E_ALL | E_STRICT);//错误报告为严格
    libxml_use_internal_errors(true);
    header("Content-Type: text/html;charset=utf-8");//防止出现乱码
    $search = "";
    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        $search = test_input($_GET["search"]);
    } 
    function test_input($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }
    function nodelist2string($nodelist) {//把xpath获得的nodelist全部输出为string，仅在只汗一个元素的时候有效
        foreach($nodelist as $node) {
            $a_node = $node->nodeValue;
        }
        return $a_node;
    }
    function dom_parser($html, $mypath) {//构建xpath并查找
        $doc = new DomDocument;
        $doc->loadHTML($html);
        $xpath = new DOMXpath($doc);
        $href = $xpath->query($mypath);
        return nodelist2string($href);
    }
    $url = "http://202.118.84.130:1701/primo_library/libweb/action/search.do?ct=facet&fctN=facet_tlevel&fctV=available&rfnGrp=show_only&dscnt=0&frbg=&scp.scps=scope%3A(DLMH)%2Cprimo_central_multiple_fe&tab=default_tab&dstmp=1456801597218&srt=rank&ct=search&mode=Basic&&dum=true&indx=1&vl(freeText0)=".$search;
    $url = $url."&fn=search&vid=dlmh";//海事大学图书馆书名查找入口
    $html_source = file_get_contents($url);
//    echo dom_parser($html_source, "//li[@id='exlidResult0-LocationsTab']/a/@href");//获取图书所在位置
    $url = "http://202.118.84.130:1701/primo_library/libweb/action/" . dom_parser($html_source, "//li[@id='exlidResult0-LocationsTab']/a/@href");//查找图书所在位置
    $html_source = file_get_contents($url);
    $book_name = dom_parser($html_source, "//h1[@class='EXLResultTitle']");//获取书籍名称
    $book_location = trim(dom_parser($html_source, "//span[@class='EXLLocationsTitleContainer']"));//获取书籍所在位置
    $book_states = dom_parser($html_source, "//td[@class='EXLLocationTableColumn3']");//获取在架状态
    $book_ztflh = dom_parser($html_source, "//cite");//获取书籍中图分类号
    $pa = '{[a-zA-Z]{1,2}.*[0-9]}';
    if (preg_match($pa, $book_ztflh, $a_book_ztflh)) {
        $book_ztflh = $a_book_ztflh[0];
    }
    $arr = Array("book_name"=>$book_name, "book_location"=>$book_location, "book_states"=>$book_states, "book_ztflh"=> $book_ztflh);
    echo json_encode($arr, JSON_UNESCAPED_UNICODE);

?>
