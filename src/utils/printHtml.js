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
    table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0px 5px;
        margin-top: 2px;
        padding-left: 15px;
        padding-right: 15px;
        box-sizing: border-box;
    }
    tr {
        font-size: 12px;
        font-family: Consolas;
        word-break: break-all;
    }
    td div.one {
        max-height: 12px;
        line-height: 12px;
        overflow: hidden;
    }

    td div.two {
        line-height: 12px;
        max-height: 24px;
        overflow: hidden;
    }
    td div.three {
        line-height: 12px;
        max-height: 36px;
        overflow: hidden;
    }
    img {
        width: 40px;
        height: 40px;
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
  
  