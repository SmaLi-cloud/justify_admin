import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default {
  install (Vue, options) {
    Vue.prototype.getPdf = function (ele, pdfFileName, hide) {
      this.$message.loading('正在下载请稍后...', 5)
      ele = document.getElementById('pdfDom')
      pdfFileName = pdfFileName || 'pdf'
      window.pageYoffset = 0 // 滚动置顶
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      // ele.style.fontSize = '18px'
      // ele.style.padding='30px';
      // ele.style.color = 'black';
      // let scale = window.devicePixelRatio * 2
      html2Canvas(ele, {
        // dpi: 300,
        dpi: window.devicePixelRatio * 4, // 将分辨率提高到特定的DPI 提高四倍
        scale: 4, // 按比例增加分辨率
        // logging: false,
        // scale:scale,
        useCORS: true, // 允许canvas画布内可以跨域请求外部链接图片, 允许跨域请求。
        // allowTaint: false,
        height: ele.offsetHeight,
        // width: ele.offsetWidth,
        windowWidth: document.body.scrollWidth,
        windowHeight: document.body.scrollHeight
        // backgroundColor: '#fff'
      }).then(canvas => {
        // const _this = this
        // 未生成pdf的html页面高度
        var leftHeight = canvas.height
        var a4Width = 555.28 // 原A4宽 592 因为要设置边距 20 ,这里要减掉 40
        var a4Height = 801.89 // 原A4高   841 因为要设置边距 20 ,这里要减掉 40
        // 一页pdf显示html页面生成的canvas高度;
        var a4HeightRef = Math.floor(canvas.width / a4Width * a4Height)

        // pdf页面偏移
        var position = 0

        var pageData = canvas.toDataURL('image/jpeg', 1.0)

        var pdf = new JsPDF('x', 'pt', 'a4')
        // let printIndex = 1
        const canvas1 = document.createElement('canvas')
        let height
        pdf.setDisplayMode('fullwidth', 'continuous', 'FullScreen')

        function createImpl (canvas) {
          if (leftHeight > 0) {
            // printIndex++
            var checkCount = 0
            if (leftHeight > a4HeightRef) {
              var i = position + a4HeightRef
              for (i = position + a4HeightRef; i >= position; i--) {
                var isWrite = true
                for (var j = 0; j < canvas.width; j++) {
                  var c = canvas.getContext('2d').getImageData(j, i, 1, 1).data

                  if (c[0] !== 0xff || c[1] !== 0xff || c[2] !== 0xff) {
                    isWrite = false
                    break
                  }
                }
                if (isWrite) {
                  checkCount++
                  if (checkCount >= 10) {
                    break
                  }
                } else {
                  checkCount = 0
                }
              }
              height = Math.round(i - position) || Math.min(leftHeight, a4HeightRef)
              if (height <= 0) {
                height = a4HeightRef
              }
            } else {
              height = leftHeight
            }

            canvas1.width = canvas.width
            canvas1.height = height

            // console.log(index, 'height:', height, 'pos', position);

            var ctx = canvas1.getContext('2d')
            ctx.drawImage(canvas, 0, position, canvas.width, height, 0, 0, canvas.width, height) // 边距这里设置0，不然又黑边

            // var pageHeight = Math.round(a4Width / canvas.width * height)
            // pdf.setPageSize(null, pageHeight)
            if (position !== 0) {
              pdf.addPage()
            }
            // 设置 20px 边距
            pdf.addImage(canvas1.toDataURL('image/jpeg', 1.0), 'JPEG', 20, 20, a4Width, a4Width / canvas1.width * height)
            leftHeight -= height
            position += height
            if (leftHeight > 0) {
              // 添加全屏水印
              /* const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAArCAYAAADIWo5HAAACLUlEQVR42u2Zy2sCMRDGV9tbtVJKrQ/0JBWLvbgsaOttQQqreO5R6GHP/v+HZiEDQ9i8k33YDHyXbcxufpN8maRRFCJEiBAhQoTgRIfoh+hKNBe0G9I2GVG3om9bEl2I9rcIoE/77Cq8Myd6sn2ZSBgAr80YARhI+gOwCdGW6EB/d6R9XDUGFrsAf2Fe7Fswk1JBmzMd1DNKgI2EywQyUKYjkxFeOwwxkwgAvBJNqEa0DzaTHcn3qWrXdA/ocQD8m11ABUDfQF0fpujjI2QAeoZetdYdfOzB9HgGNEF6owM8Ec3Q8wEDgP07T6ktgNyB8YgAqGZ0b+gRsS2AtQP/iAUAHlAdsEW7TY6eFVrVNQN8A2AjlZho5R5wYjJhoqMiADy4DFWLPJMcKBhv3AYThFi4yJyrAAAfDrY/1SVQVhLDOWDowIwzSQ1TqwfA1P5CU3yJlsPY8fmjcTMgptmeIwB3aFbsLCvM2BRAFR4AZXYxuEdmn38hmjoosY0B5IonxLNhIYTNby0odMoAJJL1/k10bwpgQztZKaxb2YXFRnAUhexDHzoAUsGxu3j+awNA5+RmcxW1UCx1eQB4SyI1AaBrbiMEYGrwexgYBlgrgGtU/ZUY3AlGhgByTvV5MQGgW1SomqBOUWLiATy1wgNsABQz51PzWHxTALzWAW0F0EM+MKPmnLj6x0lbAPDuC5zfNPsCcChZ25DZd4VBJCW7wrRp1+whQoQIESJEg+IPRa38G55TPkQAAAAASUVORK5CYII='
              for (let i=0;i<6;i++) {
                for (let j=0;j<5;j++) {
                  const  left = (j * 120) + 20
                  pdf.addImage(base64,'JPEG', left, i*150, 20, 30); // 关掉水印
                }
              } */
              setTimeout(createImpl, 500, canvas)
            } else {
              pdf.save(pdfFileName + '.pdf')
              setTimeout(hide, 500)
              this.$message.success('下载完成', 2.5)
            }
          }
        }

        // 当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < a4HeightRef) {
          pdf.addImage(pageData, 'JPEG', 20, 20, a4Width, a4Width / canvas.width * leftHeight)
          pdf.save(pdfFileName + '.pdf')
        } else {
          try {
            pdf.deletePage(0)
            setTimeout(createImpl, 500, canvas)
          } catch (err) {
            console.log(err)
          }
        }
      })
    }
  }
}


