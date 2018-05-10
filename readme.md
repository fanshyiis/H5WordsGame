# H5小游戏 篇一 组词游戏
项目功能简介

 1. 词库功能，项目文件里配有csv格式的中文常用词组词库，每次随机抽取词语进行游戏
 2. 匹配消除功能，自动在词库中匹配选中词语并进行消除
 3. 选中动画以及消除动画，均由svg生成爆炸动画
 4. 智能提醒系统，10秒之后未作操作可提示单词
 5. 过关判定
 
 ## 核心代码展示

>  获取词库，根据csv文件

 

    $.ajax({
        url: './js/ck2.csv',
        dataType: 'text'
    }).done(successFunction);
    
    // 回调函数
    function successFunction(data) {
        var allRows = data.split(/\r?\n|\r/);
        for (var singleRow = 1; singleRow < allRows.length; singleRow++) {
            if (allRows[singleRow].length === 2) {
              var m = {
                  a: allRows[singleRow][0],
                  b: allRows[singleRow][1]
              }
              dataBase.push(m)
            }
        }
    }

>随机抽取函数
>会根据数组的长度获取随机数据

   

    function getArrayItems(arr, num) {
    //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
    var temp_array = new Array();
    for (var index in arr) {
        temp_array.push(arr[index]);
    }
    //取出的数值项,保存在此数组
    var return_array = new Array();
    for (var i = 0; i<num; i++) {
        //判断如果数组还有可以取出的元素,以防下标越界
        if (temp_array.length>0) {
            //在数组中产生一个随机索引
            var arrIndex = Math.floor(Math.random()*temp_array.length);
            //将此随机索引的对应的数组元素值复制出来
            return_array[i] = temp_array[arrIndex];
            //然后删掉此索引的数组元素,这时候temp_array变为新的数组
            temp_array.splice(arrIndex, 1);
        } else {
            //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
            break;
        }
    }
    return return_array;
}

> svg动画渲染插件

      function clear(id) {
      document.getElementById(id).innerHTML = ''
        console.log(id,'-----------------')
          bodymovin.loadAnimation({
	container: document.getElementById(id), // 渲染动画的 dom 元素
	renderer: 'svg',
	loop: false,
	autoplay: true,
	path: './js/data.json'
	  })
	  }


    其他函数就不一一介绍了
    上个图最后
    
    
![enter image description here](http://koalareading-teacher-web.oss-cn-beijing.aliyuncs.com/test/WechatIMG92.jpeg)



 
