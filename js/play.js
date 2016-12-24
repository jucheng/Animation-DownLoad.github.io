  $(function() {
      $('#ad-carousel').carousel();
      $('#menu-nav .navbar-collapse a').click(function(e) {
          var href = $(this).attr('href');
          var tabId = $(this).attr('data-tab');
          if ('#' !== href) {
              e.preventDefault();
              $(document).scrollTop($(href).offset().top - 70);
              if (tabId) {
                  $('#feature-tab a[href=#' + tabId + ']').tab('show');
              }
          }
      });
  });

  function $$(id) {
      return (!id) ? null : document.getElementById(id);
  }

  function getIndex(elem, arr) {
      arr = arr || [];
      for (var i = 0, len = arr.length; i < len; i++) {
          if (arr[i] == elem) {
              return i;
          }
      }
  }
  //脱离
  function dragleave(e) {
      e.preventDefault();
      e.stopPropagation();
  }
  //拖后放
  function drop(e) {
      e.preventDefault();
      e.stopPropagation();
  }
  //拖进
  function dragenter(e) {
      e.preventDefault();
      e.stopPropagation();
  }
  //拖来拖去
  function dragover(e) {
      e.preventDefault();
      e.stopPropagation();
  }
  document.addEventListener("dragover", dragover, false);
  document.addEventListener("dragenter", dragenter, false);
  document.addEventListener("dragleave", dragleave, false);
  document.addEventListener("drop", drop, false);


  var dragarea = $$('dragarea'),
      //装文件的容器
      fileFilter = [],
      //装图片的容器
      preview = $$('preview'),
      upload = $$('upload'),
      tip = $$('tip');

  //获取文档信息列表  
  function funGetFiles(e) {
      e.preventDefault();
      e.stopPropagation();
      var files = e.target.files || e.dataTransfer.files;
      fileFilter.concat(files);
      //return fileFilter;    
  }

  //删除对应的文件
  function funDeleteFile(fileDelete) {
      var arrFile = [];
      for (var i = 0, file; file = this.fileFilter[i]; i++) {
          if (file != fileDelete) {
              arrFile.push(file);
          } else {
              this.onDelete(fileDelete);
          }
      }
      fileFilter = arrFile;
      return fileFilter;
  }

  //将图片拖拽进容器
  dragarea.ondrop = function(e) {
      e.preventDefault();
      e.stopPropagation();

      //HTML5的文件API有一个FileList接口，可以通过e.dataTransfer.files拖拽事件传递的文件信息，获取本地文件列表信息。
      var filelist = e.dataTransfer.files;
      if (filelist[0].type.indexOf('image') === -1) {
          alert("您上传的不是图片，非法，请重新上传");
          return false;
      }

      fileFilter.push(filelist);
      //console.log(fileFilter[0]);
      //console.log(filelist);            
      var imgurl = window.URL.createObjectURL(filelist[0]);
      var filename = filelist[0].name; //图片名称
      var filesize = Math.floor((filelist[0].size / 1024));
      if (filesize > 1024 * 5) {
          alert("上传大小不能超过5M");
          return false;
      }
      var div = document.createElement('div');
      //div.innerHTML="图片名称："+filename+"   大小："+filesize+"KB   <a href='javascript:;' onclick='this.parentNode.parentNode.removeChild(this.parentNode)'>删除</a><img src="+imgurl+" width='100%'>";
      div.innerHTML = "图片名称：" + filename + "   大小：" + filesize + "KB   <a href='javascript:;'>删除</a><img src=" + imgurl + " width='100%'>";

      //image.innerHTML="<p>图片名称："+filename+"</p></p>大小："+filesize+"KB";
      preview.appendChild(div);
      console.log(fileFilter.length)
          //删除上传问题
      if (preview.children.length > 0) {
          var dela = preview.getElementsByTagName('a');
          for (var i = 0, len = dela.length; i < len; i++) {
              dela[i].onclick = function() {
                  //由于循环，会永远导致i为最大值，所以要获取索引值来删除
                  var index = getIndex(this, dela);
                  fileFilter.splice(index, 1); //注意splice实现删除，会导致数组索引值重新排列
                  this.parentNode.parentNode.removeChild(this.parentNode);
                  console.log(fileFilter.length)
                  console.log(fileFilter)
              }
          }
      }
  }

  function createXHR() {
      try {
          return new XMLHttpRequest(); } catch (e) {}
      try {
          return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e) {}
      try {
          return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e) {}
      try {
          return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {}
      try {
          return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {}
      return null;
  }

  //ajax上传图片
  upload.addEventListener('click', function() {
      tip.innerHTML = '正在上传，请耐心等待……';
      console.log(fileFilter.length);
      //console.log(fileFilter[0][0]);
      //console.log(fileFilter[1][0]);
      if (fileFilter.length == 0) {
          tip.innerHTML = "已没有图片上传";
      }
      for (var i = 0, len = fileFilter.length; i < len; i++) {
          var xmlhttp = createXHR();
          xmlhttp.onreadystatechange = function() {
              if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                  //alert(xmlhttp.responseText);
                  tip.innerHTML = "已上传完成！"
                      //上传完成清空预览容器
                  preview.innerHTML = '';
                  fileFilter = []; //上传完之后清空数组
                  //fileFilter.splice(i,1);本打算这样删除数组里面的元素，但不行
                  //console.log(fileFilter.length);
                  //console.log(fileFilter);
              }
          }
          var fileload = new FormData();
          fileload.append("mypic", fileFilter[i][0]);
          xmlhttp.open("post", "http://pingfan1990.sinaapp.com/html5/fileupload/upload.php", true);
          xmlhttp.send(fileload);
      }
  }, false)

  var fileImage = $$('fileImage');
  fileImage.addEventListener("change", function(e) {
      //funGetFiles(e);
      var files = e.target.files || e.dataTransfer.files;
      if (files[0].type.indexOf('image') === -1) {
          alert("您上传的不是图片，非法，请重新上传");
          return false;
      }
      fileFilter.push(files);
      var imgurl = window.URL.createObjectURL(files[0]);
      var filename = files[0].name; //图片名称
      var filesize = Math.floor((files[0].size / 1024));
      if (filesize > 1024 * 5) {
          alert("上传大小不能超过5M");
          return false;
      }
      var div = document.createElement('div');
      //div.innerHTML="图片名称："+filename+"   大小："+filesize+"KB   <a href='javascript:;' onclick='this.parentNode.parentNode.removeChild(this.parentNode)'>删除</a><img src="+imgurl+" width='100%'>";
      div.innerHTML = "图片名称：" + filename + "   大小：" + filesize + "KB   <a href='javascript:;'>删除</a><img src=" + imgurl + " width='100%'>";

      //image.innerHTML="<p>图片名称："+filename+"</p></p>大小："+filesize+"KB";
      preview.appendChild(div);
      console.log(fileFilter.length)
          //删除上传问题
      if (preview.children.length > 0) {
          var dela = preview.getElementsByTagName('a');
          for (var i = 0, len = dela.length; i < len; i++) {
              dela[i].onclick = function() {
                  //由于循环，会永远导致i为最大值，所以要获取索引值来删除
                  var index = getIndex(this, dela);
                  fileFilter.splice(index, 1); //注意splice实现删除，会导致数组索引值重新排列
                  this.parentNode.parentNode.removeChild(this.parentNode);
                  console.log(fileFilter.length)
                  console.log(fileFilter)
              }
          }
      }
  }, false);
