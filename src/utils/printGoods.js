export default function printHtml (html) {
    let style = getStyle()
    let container = getContainer(html)
    document.body.appendChild(style)
    document.body.appendChild(container)
    getLoadPromise(container).then(() => {
      window.print()
      document.body.removeChild(style)
      document.body.removeChild(container)
    })
  }
  
  // 设置打印样式
  function getStyle () {
    let styleContent = `
    #print-container {
      display: none;
    }
    .f24 {
      font-size: 18px;
      max-height: 40px;
      line-height: 20px;
      overflow: hidden;
      font-weight: bold;
    }
    .border_bottom {
      border-bottom: 1px solid #eeeeee;
      padding-bottom: 15px;
    }
    table.print_table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0px 5px;
        padding: 20px 40px 20px 40px;
        box-sizing: border-box;
        text-align: left;
    }
    table.print_table tr {
        font-size: 15px;
        font-family: Consolas;
        word-break: break-all;
    }
    table.print_table td {
        text-align: left;
        height: 25px;
        max-width: 100px;
        padding: 10px 5px 10px 0;
    }
    .logo_td {
      text-align: right !important;
      padding-right: 0 !important;
    }
    table.print_table td div.one {
        max-height: 18px;
        line-height: 18px;
        overflow: hidden;
    }

    table.print_table td div.two {
        line-height: 20px;
        max-height: 40px;
        overflow: hidden;
    }
    table.print_table td div.three {
        line-height: 12px;
        max-height: 36px;
        overflow: hidden;
    }
    img {
        width: 80px;
        height: 80px;
        margin-left: 10px;
        margin-right: 10px;
    }
    img.logo {
        width: 45px !important;
        height: 45px !important;
        margin: 0 !important;
    }
    img.dou_logo {
        width: 80px;
        height: 80px;
        margin-left: 40px !important;
    }
    .img_flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .label {
      width: 100px;
      text-align: center;
      font-size: 10px;
    }
    .margin_top_10 {
      padding-top: 25px;
    }
    .margin_top_5 {
      padding-top: 20px;
    }
    @media print {
        body > :not(.print-container) {
            display: none;
        }
        html,
        body {
            height: auto !important;
        }
        #print-container {
            display: block;
        }
        @page {
            size: auto;
            margin: 0;
        }
    }`
    let style = document.createElement('style')
    style.innerHTML = styleContent
    return style
  }
  
  // 清空打印内容
  function cleanPrint () {
    let div = document.getElementById('print-container')
    if (div) {
      document.querySelector('body').removeChild(div)
    }
  }
  
  // 新建DOM，将需要打印的内容填充到DOM
  function getContainer (html) {
    cleanPrint()
    let container = document.createElement('div')
    container.setAttribute('id', 'print-container')
    container.innerHTML = html
    return container
  }
  
  // 图片完全加载后再调用打印方法
  function getLoadPromise (dom) {
    let imgs = dom.querySelectorAll('img')
    imgs = [].slice.call(imgs)
  
    if (imgs.length === 0) {
      return Promise.resolve()
    }
  
    let finishedCount = 0
    return new Promise(resolve => {
      function check () {
        finishedCount++
        if (finishedCount === imgs.length) {
          resolve()
        }
      }
      imgs.forEach(img => {
        img.addEventListener('load', check)
        img.addEventListener('error', check)
      })
    })
  }
  
  