/*
  放大镜逻辑代码

  分析:
    0. 认识一些单词
      => show: 表示展示图片的盒子
      => mask: 表示图片上面移动的盒子
      => enalrge: 表示放大镜盒子
      => list: 表示列表盒子
    1. 移入移出
      => 移入的时候, mask 和 enlarge 盒子显示
      => 移出的时候, mask 和 enlarge 盒子消失
    2. 移动的时候
      => 移动的时候, mask 盒子正在 show 盒子范围内移动
      => 移动的时候, enlarge 盒子里面的背景图片位置跟着移动
    3. 点击列表项
      => 点击的时候, 可以一整套的切换图片
      => 切换 show 里面 img 标签的图片
      => 切换 enlarge 盒子的背景图片

  抽象对象
    + 属性(构造函数体内)
      0. 范围元素: 确定放大镜的整个范围
      1. show 盒子: 确定 mask 盒子的范围边界
      2. mask 盒子: 确定显示还是消失, 还要移动
      3. enlarge 盒子: 确定显示还是消失, 也要移动背景图片
      4. show 盒子的宽高: 确定比例使用
      5. enlarge 盒子的宽高: 确定比例使用
      6. 背景图片的尺寸: 确定比例使用
    + 方法(构造函数原型)
      0. 入口函数: 用来调用 1 2 3 4 这四个方法
      1. 调整比例: 这个方法一旦执行, 就可以调整好比例
      2. 移入移出: 这个方法一旦执行, 就可以绑定好移入移出事件
      3. 鼠标移动: 这个方法一旦执行, 光标在 show 盒子上移动的时候, 就可以元素联动了
      4. 图片切换: 这个方法一旦执行, 点击列表项的时候, 就能整体切换图片了
    + 书写一个构造函数
      => 拥有上面书写的属性和方法
*/

function Enlarge(ele) {
  // 0. 拿到范围元素
  this.ele = document.querySelector(ele)
  // 1. show 盒子
  this.show = this.ele.querySelector('.show')
  // 2. mask 盒子
  this.mask = this.ele.querySelector('.mask')
  // 3. enlarge 盒子
  this.enlarge = this.ele.querySelector('.enlarge')
  // 4. show 盒子的宽高
  // clientWidth 获取元素的尺寸(内容 + padding)
  this.show_width = this.show.clientWidth
  this.show_height = this.show.clientHeight
  // 5. enlarge 盒子的宽高
  // 因为 enlarge 盒子默认是隐藏的, clientWidth 不好使
  // 获取元素非行内样式
  this.enlarge_width = parseInt(window.getComputedStyle(this.enlarge).width)
  this.enlarge_height = parseInt(window.getComputedStyle(this.enlarge).height)
  // 6. 背景图片的尺寸
  // split() 按照你给出的符号切割字符串, 返回值是一个数组
  this.bg_width = parseInt(window.getComputedStyle(this.enlarge).backgroundSize.split(' ')[0])
  this.bg_height = parseInt(window.getComputedStyle(this.enlarge).backgroundSize.split(' ')[1])
  // 7. 获取列表盒子
  this.list = this.ele.querySelector('.list')

  // 直接启动入口函数
  this.init()
}


// 书写方法
Enlarge.prototype.init = function () {
  // init 方法是被实例调用的
  // 所以这个位置的 this 就是当前实例
  this.setScale()
  this.overOut()
  this.move()
  this.change()
}

/*
  调整比例

      show 盒子尺寸        背景图片尺寸
    ---------------- = -------------------
      mask 盒子尺寸      enlarge 盒子尺寸
    mask 盒子尺寸 * 背景图片尺寸 = show 盒子尺寸 * enlarge 盒子尺寸
    mask 盒子尺寸 = show 盒子尺寸 * enlarge 盒子尺寸 / 背景图片尺寸
    + 根据公式计算出 mask 盒子尺寸, 给 mask 盒子进行赋值
*/

Enlarge.prototype.setScale = function () {
  // 根据公式计算 mask 盒子的大小
  this.mask_width = this.show_width * this.enlarge_width / this.bg_width
  this.mask_height = this.show_height * this.enlarge_height / this.bg_height

  // 给 mask 盒子进行赋值
  this.mask.style.width = this.mask_width + 'px'
  this.mask.style.height = this.mask_height + 'px'
}

/*
  移入移出
    + 移入 show 盒子的时候, mask 和 enlarge 显示
    + 移出 show 盒子的时候, mask 和 enlarge 消失
*/
Enlarge.prototype.overOut = function () {
  // 绑定移入事件
  // 之所以写成箭头函数, 是因为写了标准函数以后, 函数内部的 this 变成 show 盒子了
  // 就没有当前实例了, 所以改变了 箭头函数
  this.show.addEventListener('mouseover', () => {
    this.mask.style.display = 'block'
    this.enlarge.style.display = 'block'
  })

  // 绑定移出事件
  this.show.addEventListener('mouseout', () => {
    this.mask.style.display = 'none'
    this.enlarge.style.display = 'none'
  })
}

/*
  鼠标移动
    + 给 show 盒子绑定一个鼠标移动事件
    + 拿到光标的坐标 ? 哪一组 ?
      => client 一组: 可视窗口左上角
        -> 光标坐标点相对于浏览器可视窗口左上角的坐标位置
      => page 一组: 文档流左上角
        -> 光标坐标点相对于文档流左上角的坐标位置
      => offset 一组: 目标元素左上角
        -> 光标坐标点相对于目标元素左上角的坐标位置
    + 解决光标问题
      => 方法1:
        -> 不管我光标移动到哪里, 不管页面是不是滚动
        -> 有一个坐标原点不变的属性, page 一组
        -> 拿到 page 一组坐标 - box 距离页面左边和顶部的距离
      => 方法2:
        -> 只要 mask 不作为目标元素, 我拿到的就是相对于 show 盒子的坐标位置
        -> 需要一个 css 样式来帮忙
        -> pointer-events: none;
    + 给 mask 盒子进行赋值
      => 注意边界问题
    + 让背景图片跟随联动
        mask 盒子移动距离     enlarge 盒子的移动距离
      -------------------- = ---------------------
        mask 盒子的尺寸        enlarge 盒子的尺寸
      enlarge 盒子的移动距离 * mask 盒子的尺寸 = enlarge 盒子的尺寸 * mask 盒子移动距离
      enlarge 盒子的移动距离 = enlarge 盒子的尺寸 * mask 盒子移动距离 / mask 盒子的尺寸
    + 但是我们赋值的时候应该变成 负数, 赋值给 enlarge 盒子的背景图片位置

*/
Enlarge.prototype.move = function () {
  // 给 show 盒子绑定 move 事件
  this.show.addEventListener('mousemove', e => {
    // 处理事件对象兼容
    e = e || window.event
    // 获取坐标点位
    // offsetTop 元素的偏移量, 根据元素参考父级来计算的偏移量
    // this.ele 元素的参考父级, body
    // const x = e.pageX - this.ele.offsetLeft
    // const y = e.pageY - this.ele.offsetTop
    // console.log(x, y)

    // 获取坐标点位
    let x = e.offsetX - this.mask_width / 2
    let y = e.offsetY - this.mask_height / 2

    // 边界值判断
    if (x <= 0) x = 0
    if (y <= 0) y = 0
    if (x >= this.show_width - this.mask_width) x = this.show_width - this.mask_width
    if (y >= this.show_height - this.mask_height) y = this.show_height - this.mask_height

    // 给 msak 盒子进行 left 和 top 的赋值
    this.mask.style.left = x + 'px'
    this.mask.style.top = y + 'px'

    // 根据公式计算出背景图片移动的距离
    const bg_x = this.enlarge_width * x / this.mask_width
    const bg_y = this.enlarge_height * y / this.mask_height

    // 赋值给 enlarge 盒子的 background-position 属性
    this.enlarge.style.backgroundPosition = `-${ bg_x }px -${ bg_y }px`
  })

}


/*
  给每一个列表项绑定点击事件
    + 事件绑定给谁 ?
      => 事件委托的形式把事件绑定给 this.list
    + 点击 img 标签的时候如何进行替换
      => 把每一组图片提前一自定义属性的形式书写在 img 标签上
      => 当你点击 img 标签的时候, 拿到你点击的这个 img 标签身上的自定义属性
      => 分别给 show 盒子里面的 img 标签赋值
      => 给 enlarge 盒子的 背景图片 赋值
    + 更换 p 标签的边框颜色
      => 更换 p 标签的 active 类名
      => 应该给所有 p 标签没有 active
      => 只给点击的这个元素的 父元素 添加 active
*/
Enlarge.prototype.change = function () {
  // 绑定事件
  this.list.addEventListener('click', e => {
    // 处理事件对象兼容
    e = e || window.event
    // 处理事件目标兼容
    const target = e.target || e.srcElement


    // 判断点击的是哪一个 img 元素
    if (target.nodeName === 'IMG') {
      // 拿到点击元素的身上的自定义属性
      const show_url = target.getAttribute('show')
      const enlarge_url = target.getAttribute('enlarge')

      // 给元素进行赋值
      this.show.firstElementChild.src = show_url
      this.enlarge.style.backgroundImage = `url(${ enlarge_url })`

      // 给所有 p 标签取消 active
      for (let i = 0; i < this.list.children.length; i++) {
        this.list.children[i].classList.remove('active')
      }

      target.parentElement.classList.add('active')
    }
  })
}
