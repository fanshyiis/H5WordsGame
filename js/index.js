/*
* @Author: Super X
* @Date:   2018-04-13 16:48:42
* @Last Modified by:   Super X
* @Last Modified time: 2018-04-19 19:50:49
* email: fanshyiis@163.com
* copyright: koalareading all right
* 版权所有 引用代码请联系作者
*/

var dataBase = [] //基础词组库
var choose //选择的词组
var cn = 5 //基础词数

// 获取基础词库
function getDataBase() {
	// 根据csv文件处理获得数组对象
	$.ajax({
        url: './js/ck.csv',
        dataType: 'text'
    }).done(successFunction);
    
    // 回调函数
    function successFunction(data) {
        var allRows = data.split(/\r?\n|\r/);
        for (var singleRow = 1; singleRow < allRows.length; singleRow++) {
            var rowCells = allRows[singleRow].split(',');
            var m = {
                a: rowCells[1],
                b: rowCells[2]
            }
            dataBase.push(m)
        }
        choose = getArrayItems(dataBase, cn)
        vue.start()
    }
}

// 随机取词函数
// arr 数组
// num 需要取出的个数
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

// 清除动画渲染
// svg
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

// 特殊字体渲染
// 采用有字库api
function font() {
  $youziku.submit('font_text')
}

// vue函数
var vue = new Vue({
  el: '#vue',
  data: {
  	windowBg: false,
  	restart: false,
  	passNum: cn,
  	pass: 1,
    grid: 9,
    allText: null,
    gridList: [],
    text: '春天里柳树发芽百花',
    one: null,
    two: null,
    reData: null,
    timeDuring: 0
  },
  methods: {
  	// 重置函数
  	reStart () {
  		this.restart = true
  		setTimeout(function () {
  		  vue.restart = false
  		}, 800)
  		this.playAudio('restart')
  		this.passNum = cn
  		this.gridList = JSON.parse(JSON.stringify(this.reData))
  	},
  	playAudio (val) {
  		var x = document.getElementById(val)
  		x.load()
  		x.play()
  	},
  	setTime () {
  		this.timeDuring++
  		if (this.timeDuring === 10) {
  			this.tip()
  		}
  		console.log(this.timeDuring)
        setTimeout(function () {
        	vue.setTime()
        }, 1000)
  	},
  	tip () {
  		let a = ''
  		console.log(choose)
  		this.gridList.map(val => {
  			if (!val.r && val.f) {
  			  a = a + val.f
  			}
  		})
  		let b = null
  		choose.map(val => {
  			if (a.indexOf(val.a) !== -1 && a.indexOf(val.b) !== -1) {
  				b = val.a
  			}
  		})
  		if (!b) {
  			this.getNextPass()
  		}
  		if (this.one) {
  			this.choose(this.one, 't')
  		}
  		this.gridList.map(val => {
  			if (!val.r && val.f === b) {
  			  this.one = null
  			  this.choose(val, 't')
  			}
  		})
  		console.log(a)
  	},
  	// 选择函数
  	choose (item, type) {
  		if (type !== 't') {
          this.timeDuring = 0
  		}
  		if (!item.f) {
  			return false
  		}
  		if (this.one && item.x === this.one.x && item.y === this.one.y) {
  			this.playAudio('touchCard')
            item.choose = !item.choose
            this.one = null
  			return false
  		} else {
  			this.playAudio('touchCard')
  			item.choose = !item.choose
	  		if (this.one) {
	  			this.two = item
	  			// font()
	  			// 模拟消除
	  			// 加上timeout效果更好
	  			var _this = this
	  			setTimeout(function () {
	  				_this.clearText()
	  			}, 300)
	  		} else {
	  			this.one = item
	  			// font()
	  		}
  		}
  	},
  	// 消除逻辑
  	clearText () {
  		var r = false
  		dataBase.map(val =>{
  			if (val.a === this.one.f && val.b === this.two.f) {
  				r = true
  			}
  		})
  		if (!r) {
  			this.gridList.map(val => {
	  			if (val.x === this.two.x && val
	  				.y === this.two.y) {
	  				val.choose = false
	  			    this.playAudio('error')
	  			}
	  			if (val.x === this.one.x && val
	  				.y === this.one.y) {
	  				val.choose = false
	  			}
	  		})
	  		this.two = false
	  		this.one = false
  			return false
  		}
  		this.gridList.map(val => {
  			if (val.x === this.one.x && val
  				.y === this.one.y) {
  				clear(val.x + '' + val.y)
  			    setTimeout(function () {
  			    	val.f = ''
  			    }, 200)
  			    val.r = true
  			}
  			if (val.x === this.two.x && val
  				.y === this.two.y) {
  				clear(val.x + '' + val.y)
	  			setTimeout(function () {
	  			    	val.f = ''
	  			    }, 200)
  				val.r = true
  			    this.playAudio('success')
  			}
  		})
  		this.passNum--
  		console.log(this.passNum)
  		if (this.passNum === 0) {
  			this.playAudio('next')
  			this.windowBg = true
  		}
  		// this.sound_error = true
  		this.one = null
  		this.two = null
  	},
  	// 进入下一关
  	getNextPass () {
  		this.one = false
  		this.timeDuring = 0
  		this.windowBg = false
  		cn = cn + 2,
  		this.pass++
  		this.passNum = cn
  		getDataBase()
  		setTimeout(function () {
  			font()
  		}, 1000)
  	},
  	//初始化函数
    start () {
      this.gridList = []
      for (var i = 0; i < this.grid; i++) {
      	for (var j = 0; j < this.grid; j++) {
         this.gridList.push({
	      	x: i,
	      	y: j,
	      	f: '',
	      	choose: false,
	      	r: false,
	      	m: false
	     })
	    }
      }
      var l = []
      choose.map(val => {
      	l.push(val.a)
      	l.push(val.b)
      })
      $("#bggg").click()
      // this.playAudio('bgm')
      console.log(l)
      this.allText = l
      var c = getArrayItems(this.gridList, cn * 2)
      console.log(c)
      c.map((val, index) => {
      	val.f = l[index]
      })
      this.reData = JSON.parse(JSON.stringify(this.gridList))
    }
  },
  created () {
  	getDataBase()
  	this.setTime()
  }
})