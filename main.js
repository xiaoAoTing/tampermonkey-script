// ==UserScript==
// @name         my script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @connect      www.csdn.net
// @include      *://*.csdn.net/*
// @include      https://shimo.im/*
// @match        https://www.jianshu.com/p/*
// @match        https://www.zhihu.com/question/*
// @match        https://cloud.tencent.com/developer/article/*
// @match        https://zz123.com/*
// @match        https://link.csdn.net/*
// @match        https://link.juejin.cn/*
// @match        http://link.zhihu.com/*
// @match        https://panjiachen.github.io/*
// @match        https://c.runoob.com/*
// @require      https://cdn.staticfile.org/jquery/3.6.4/jquery.js
// @contributionURL https://doc.stackoverflow.wiki/web/#/21?page_id=138
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @antifeature ads CSDNGreener 脚本中存在可永久关闭的小广告，请放心安装！
// ==/UserScript==


(function () {
    'use strict';

    ///////////// 工具函数 START //////////////////

    function StyleSheet(styles) {
        this.styles = styles;
        this.id = this.uuid();
    }

    StyleSheet.prototype.insert = function () {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.id = this.id;
        style.appendChild(document.createTextNode(this.styles));
        return document.head.appendChild(style);
    };

    StyleSheet.prototype.remove = function () {
        var styleEl = document.querySelector('#' + this.id);
        styleEl.parentNode.removeChild(styleEl);
    };

    StyleSheet.prototype.uuid = function () {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };

    // serializeQuery(location.search);
    function serializeQuery(queryStr) {
        let data = {};
        if (queryStr[0] == "?") {
            queryStr = queryStr.slice(1);
        }
        decodeURI(queryStr)
            .split("&")
            .forEach((item) => {
                item = item.split("=");
                data[item[0]] = item[1];
            });
        return data;
    }

    ///////////// 工具函数 END //////////////////

    ////////// 匹配页面 START ////////////

    let href = location.href;


    // 菜鸟在线工具 JSON
    if (href.includes('c.runoob.com/front-end/53/')) {
        let stylesheet = new StyleSheet(`
            .card-body { padding: 0 !important; }
            .card-body .row .col-sm-1, .card-body .row .col-sm-6 { display: none !important; }
            .card-body .row .col-sm-5 { 
                width: 100% !important; max-width: 100% !important; flex: 1 !important; 
                padding: 0 !important; margin: 0 !important;
            }
            .card-header { display: none !important; }
            .navbar { display: none !important; }
            body { padding: 0 !important;  }
            .page-footer { display: none !important; }

            #jsoneditor1 { height: 565px !important; }
        `)
        stylesheet.insert();

        $('.runoob-page-content').next().hide()
    }

    // Vue Element Admin 演示项目
    if (href.includes('panjiachen.github.io')) {
        let stylesheet = new StyleSheet(`
            #carbonads { display: none !important; }
        `)
        stylesheet.insert();
    }

    // 免费听音乐的网站
    if (href.includes('zz123.com')) {
        let stylesheet = new StyleSheet(`
            .xianzhiad { display: none !important; }
            .radscontent { display: none !important; }
            .mys-wrapper { display: none !important; }
            .right-ad { display: none !important; }
        `);
        stylesheet.insert();
    }
    // 简书文章页面
    if (href.includes('www.jianshu.com')) {
        setTimeout(() => {
            $('script:last').nextAll('div').find('img[src$=".gif"]').hide(); // 隐藏网页最后一个 script 元素后的所有 div 元素中的 gif 图片
            $('#note').hide();
            $('img[src="https://cdn-file-ssl-wan.ludashi.com/wan/newswf/dlgglm/*.gif "]').hide(); // 如果图片的 src 的前缀包含 https://cdn-file-ssl-wan.ludashi.com/wan/newswf/dlgglm 给他消失
            $('img[src^="https://cdn-file-ssl-wan.ludashi.com/wan/newswf/dlgglm"]').hide(); // 如果图片的 src 的前缀包含 https://cdn-file-ssl-wan.ludashi.com/wan/newswf/dlgglm 给他消失
            $('body script').last().nextAll('div').remove(); // 来删除 body 标签下最后一个 script 元素后的所有 div 元素。
            $('header').first().hide(); // 隐藏页面中的第一个 header 元素。
            $('footer').first().hide(); // 隐藏页面中的第一个 footer 元素。
            $('footer').first().next('div').hide(); // 隐藏页面中的第一个 footer 元素后的第一个 div
            $('aside').hide(); // 侧边栏
            // TODO $('article') 根据文章容器中的标题生成文章大纲
        }, 500)
    }
    // CSDN 文章页面
    if (href.includes('https://blog.csdn.net/') && href.includes('article') && href.includes('details')) {
        $('#csdn-toolbar').hide() // 顶部条
        $('#blogColumnPayAdvert').hide() // 专栏
        $('#ad_iframe').hide() // 广告 Iframe
        $('#treeSkill').hide() // 相关推荐
        $('#recommendNps').hide() // 相关推荐
        $('.csdn-side-toolbar .option-box[data-type="gotop"]').siblings().hide() // 除了返回顶部其他都隐藏
        $('.article-info-box .blog-tags-box').hide(); // 文章标签
        $('.article-info-box .operating').hide(); // 版权信息
        $('.blog-footer-bottom').hide(); // 页面 Footer

        let style = new StyleSheet(`
            main {
                position: absolute;
                left: 50%;
                width: 68vw;
                transform: translateX(-50%);
            }
            /* 侧边栏 */
            .blog_container_aside,.csdn-side-toolbar { display: none !important;  }
            /* 底部分享按钮 */
            #tool-share { display: none !important;  }
            /* AD */
            #ad_unit { display: none; }
            #recommend-right { display: none; } /* 分类专栏 */
            /* 底部推荐1,2 */
            .first-recommend-box,.second-recommend-box{ display: none !important;  }
            .toolbox-middle { display: none !important;  }
            .toolbox-right {display: none !important; }
        `);
        style.insert()
    };
    // CSDN 跳转外部页面拦截页
    // if (href.includes('link.csdn.net')) {
    //     let targetURL = serializeQuery(location.search);
    //     setTimeout(() => { location.href = targetURL; }, 1500);
    // }
    // 掘金链接跳转中转页（别弹一个你确定吗？you sure ?）
    if (href.includes('https://link.juejin.cn/')) {
        let query = serializeQuery(location.search);
        console.log(query)
        location.href = decodeURIComponent(query.target);
    }
    if (href.includes('link.zhihu.com')) {
        let query = serializeQuery(location.search);
        console.log(query)
        location.href = decodeURIComponent(query.target);
    }
    // 石墨文档页面: https://shimo.im/
    if (href.includes('shimo.im')) {
        $('.sm-ad-wrapper').hide(); // 推广的容器一般都有这个类名
        let style = new StyleSheet(`
            /* 推荐石墨高级版 */
            .pos-pc-header-blue-bar { display: none !important; }
            .sm-ad-wrapper { display: none !important; }
            /* 用户反馈 */
            #desktop2-feedback { display: none !important; }
        `);
        style.insert();
    }
    // 知乎问题页面
    if (href.includes('zhihu')) {
        let style = new StyleSheet(`
            .Sticky.is-fixed{position:relative !important;}
            .Question-sideColumn{display: none !important;}
            .Question-main{justify-content: center !important;}
            .CollapsedAnswers-bar{display: none !important;} /*1 个回答被折叠（为什么？）*/
        `);
        style.insert();
    }
    // 腾讯云文章
    if (href.includes('https://cloud.tencent.com/developer/article')) {
        let style = `
            .mod-sticky-footer{ display: none !important; } /*相关推荐*/
            .mod-relevant{ display: none !important; } /*相关推荐*/
            .mod-activity{ display: none !important; } /*社区活动*/
            .mod-commercial{ display: none !important; } /*广告*/

        `
        new StyleSheet(style).insert();
    }

    ////////// 匹配页面 END ////////////

})();