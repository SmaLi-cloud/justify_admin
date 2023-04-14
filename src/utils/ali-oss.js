/**
 * plupload中文文档
 * https://www.phpin.net/tools/plupload/
 */
import plupload from 'plupload';
import { getOssParams } from '@/services/upload'; //这里替换成项目对应后端接口
let host = '';
let key = '';
export default ({
  that = '', //vue实例
  el = '', //点击触发上传的元素
  extraData = {}, //获取上传参数接口的额外参数
  accept = [], //限制文件类型
  multi_selection = false, //是否多文件上传
  limitNum = 0,
  prevent_duplicates = false, //是否允许选取重复文件
  max_file_size = '500mb', //文件大小限制，传数字默认单位b，可以数字和单位组合
  unique_names = false, //生成唯一的文件名
  file_added = new Function(),
  file_uploaded = new Function(),
  uploader_progress = new Function(),
  file_uploaded_complete = new Function(),
}) => {
  if (!el) {
    console.log('el 不能为空');
    return;
  }
  if (!that) {
    console.log('请传入this');
    return;
  }
  const uploader = new plupload.Uploader({
    runtimes: 'html5,flash,silverlight,html4',
    // 服务器上传地址，后续获取上传token后会通过setOption进行设置覆盖
    url: 'http://oss.aliyuncs.com',
    // 上传文件类型限制
    filters: {
      mime_types: accept ? accept : null,
      // 限制上传文件大小
      max_file_size: max_file_size,
      // 不允许选取重复文件
      prevent_duplicates: prevent_duplicates,
    },
    unique_names: unique_names,
  });

  // 设置上传配置
  uploader.setOption({
    browse_button: el,
    multi_selection: multi_selection,
  });

  // 文件上传进度
  uploader.bind('UploadProgress', (uploader, file) => {
    console.log(file);
    uploader_progress(file);
  });

  // 文件上传成功
  uploader.bind('FileUploaded', (up, file, info) => {
    console.log("信息发送");
    file_uploaded({ host, key }, file);
  });

  // 所有文件上传成功
  uploader.bind('UploadComplete', (up, files) => {
    file_uploaded_complete({ host, key }, files);
    // 清除记录
    up.files.forEach((file, i) => {
      uploader.splice();
    });
  });

  // 发生错误
  uploader.bind('Error', (up, info) => {
    console.log(info);
    switch (info.code) {
      case -600:
        if (/[a-zA-Z]+/g.test(max_file_size)) {
          that.$message.error('文件不能大于' + max_file_size);
        } else {
          that.$message.error('文件不能大于' + max_file_size + 'b');
        }
        break;
      default:
        that.$message.error(info.message);
        break;
    }
    that.loading = false;
  });

  // 文件添加成功并且上传
  uploader.bind('FilesAdded', (up, files) => {
    if (multi_selection && limitNum > 0 && up.files.length > limitNum) {
      that.$message.error(`只能选择${limitNum}个文件上传`);
      up.files.forEach((file, i) => {
        uploader.splice();
      });
      return false;
    }
    file_added(uploader, files, el);

    // 请求签名、临时host、callback
    //这里替换成项目对应后端接口
    getOssParams(extraData)
      .then((res) => {
        const data = res;
        host = data['host'];
        let policyBase64 = data['policy'];
        let accessid = data['accessId'];
        let signature = data['signature'];
        let callbackbody = data['callback'];
        key = data['dir'];

        let new_multipart_params = {
          key: key + '${filename}',
          policy: policyBase64,
          OSSAccessKeyId: accessid,
          success_action_status: '200', //让服务端返回200,不然，默认会返回204
          callback: callbackbody,
          signature: signature,
        };

        uploader.setOption({
          url: host,
          multipart_params: new_multipart_params,
        });
        uploader.start();
      })
      .catch((error) => {
        console.log(error);
        that.loading = false;
      });
  });

  return uploader;
};
