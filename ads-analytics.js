/* =====================================================================
 * QR StarCode 全站「统计 + 广告」统一代码文件
 * ---------------------------------------------------------------------
 * 全站 61 个页面（5 个语言首页 + 1 个博客中心页 + 5 个语言博客列表页
 * + 50 篇博客文章）都已引入本文件。
 * 你只需要在下面两个「粘贴区」里，把平台给你的原始代码
 * （连同 <script>...</script> 标签一起，原样、完整地）粘贴进去，
 * 保存后全部语言、全部页面立即生效。
 *
 * 粘贴进去的代码会被自动注入到每个页面的 <body> 中，
 * 效果和你手动把代码粘贴到 body 里完全一样（Umami 实测可用）。
 *
 * 粘贴区留空时什么都不会加载，不会报错、不会产生虚假数据。
 * ===================================================================== */
(function () {
  'use strict';

  /* =====================================================================
   * 粘贴区 ① 网站统计（自建 Umami / Umami Cloud / 其他统计）
   * ---------------------------------------------------------------------
   * 把 Umami 后台「设置 → 网站 → 跟踪代码」给你的整段代码粘到
   * START 和 END 两行之间，例如长这样：
   *
   *   <script defer src="https://你的umami域名/script.js"
   *           data-website-id="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"></script>
   *
   * 注意：START / END 这两行注释标记不要删，代码粘在它们之间。
   * ===================================================================== */
  var ANALYTICS_SNIPPETS = String.raw`
/* >>> 统计代码 START —— 把代码粘在这一行下面 */
<script id="counterscale-script" defer src="https://data.herebuy.us/tracker.js" data-site-id="qr-studio"></script>


/* <<< 统计代码 END —— 粘在这一行上面 */
`;

  /* =====================================================================
   * 粘贴区 ② 广告代码（Google AdSense / 任意广告联盟）
   * ---------------------------------------------------------------------
   * 同样把广告平台给你的整段代码原样粘到 START / END 之间，可粘多段。
   * 广告会出现在页面底部；如果平台给的是「自动广告」(auto ads) 代码，
   * 则广告位置由平台自动安排，无需手动摆放。
   *
   * 注意：START / END 这两行注释标记不要删，代码粘在它们之间。
   * ===================================================================== */
  var AD_SNIPPETS = String.raw`
/* >>> 广告代码 START —— 把代码粘在这一行下面 */


/* <<< 广告代码 END —— 粘在这一行上面 */
`;

  /* =====================================================================
   * 以下为注入逻辑，无需修改
   * ===================================================================== */

  function extractZone(text, startMark, endMark) {
    var i = text.indexOf(startMark);
    var j = text.indexOf(endMark);
    if (i < 0 || j < 0 || j <= i) return '';
    return text.slice(i + startMark.length, j).trim();
  }

  // 把任意原始 HTML/script 片段注入 <body>。
  // 经 innerHTML 解析出的 <script> 不会执行，必须重建 script 元素。
  function injectIntoBody(html) {
    if (!html) return;
    var tpl = document.createElement('template');
    tpl.innerHTML = html;
    var nodes = tpl.content.childNodes;
    for (var k = 0; k < nodes.length; k++) {
      var node = nodes[k].cloneNode(true);
      if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
        var s = document.createElement('script');
        for (var a = 0; a < node.attributes.length; a++) {
          var at = node.attributes[a];
          s.setAttribute(at.name, at.value);
        }
        s.textContent = node.textContent; // 内联脚本代码
        node = s;
      }
      document.body.appendChild(node);
    }
  }

  function boot() {
    injectIntoBody(extractZone(
      ANALYTICS_SNIPPETS,
      '/* >>> 统计代码 START —— 把代码粘在这一行下面 */',
      '/* <<< 统计代码 END —— 粘在这一行上面 */'
    ));
    injectIntoBody(extractZone(
      AD_SNIPPETS,
      '/* >>> 广告代码 START —— 把代码粘在这一行下面 */',
      '/* <<< 广告代码 END —— 粘在这一行上面 */'
    ));
  }

  // 本文件以 defer 方式加载，执行时 <body> 已解析完成
  if (document.body) boot();
  else document.addEventListener('DOMContentLoaded', boot);

})();
