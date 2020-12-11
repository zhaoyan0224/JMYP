

//  商品详情 jQuery 的入口函数
$(function () {

    // 准备一个变量拿出来商品信息
    let info = null
  
    // 1. 拿到 cookie 中的 goods_id 属性
    const id = getCookie('goods_id')
  console.log(id)

    // 2. 根据 id 信息去请求商品数据
    getGoodsInfo()
    async function getGoodsInfo() {
      const goodsInfo = await $.get('./server/getGoodsInfo.php', { goods_id: id }, null, 'json')
  
      // 3. 进行页面的渲染
      bindHtml(goodsInfo.info)
  
      // 给提前准备好的变量进行赋值
      info = goodsInfo.info
    }
  
    function bindHtml(info) {
      console.log(info)
  
      // 1. 渲染左边放大镜位置
      $('.enlargeBox').html(`
        <div class="show">
          <img src="${ info.goods_big_logo }" alt="">
          <div class="mask"></div>
        </div>
        <div class="list">
          <p class="active">
            <img src="${ info.goods_small_logo }" alt="">
          </p>
        </div>
        
        <div class="enlarge"style="background-image:url(${info.goods_big_logo})"></div>
      `)
      new Enlarge('.enlargeBox')
//   补充：放大镜盒子是后加的！看上面 enlarge
      // 2. 商品详细信息渲染
      $('.goodsInfo').html(`
        <p class="desc">${ info.goods_name }</p>
        <div class="btn-group size">
          <button type="button" class="btn btn-default">S</button>
          <button type="button" class="btn btn-default">M</button>
          <button type="button" class="btn btn-default">L</button>
          <button type="button" class="btn btn-default">XL</button>
        </div>
        <p class="price">
          ￥ <span class="text-danger">${ info.goods_price }</span>
        </p>
        <div class="num">
          <button class="subNum">-</button>
          <input type="text" value="1" class="cartNum">
          <button class="addNum">+</button>
        </div>
        <div>
          <button class="btn btn-success addCart">加入购物车</button>
          <button class="btn btn-warning continue"><a href="./list.html">继续去购物</a></button>
        </div>
      `)
  
      // 3. 商品参数渲染
      $('.goodsDesc').html(info.goods_introduce)
    }
  
    // 4. 加入购物车的操作
    $('.goodsInfo').on('click', '.addCart', function () {
      // 4-2. 拿到 localStorage 里面有没有数组
      const cart = JSON.parse(window.localStorage.getItem('cart')) || []
  
      
      const flag = cart.some(item => item.goods_id === id)
      if (flag) {
        // 4-4. 如果有这个数据拿到这个信息
        // filter 方法返回的是一个数组
        const cart_goods = cart.filter(item => item.goods_id === id)[0]
        cart_goods.cart_number = cart_goods.cart_number - 0 + ($('.cartNum').val() - 0)
      } else {
        info.cart_number = 1
        cart.push(info)
      }
  
      // 4-5. 添加完毕还要存储到 localStorage 里面
      window.localStorage.setItem('cart', JSON.stringify(cart))
    })
  
    // 5. ++ -- 的事件
    $('.goodsInfo')
      .on('click', '.subNum', function () {
        let num = $('.cartNum').val() - 0
        if (num === 1) return
        $('.cartNum').val(num - 1)
      })
      .on('click', '.addNum', function () {
        let num = $('.cartNum').val() - 0
        $('.cartNum').val(num + 1)
      })
  })


  function Enlarge(ele) {
    // 0. 拿到范围元素
    this.ele = document.querySelector(ele)
    console.log(this.ele)
    // 1. show 盒子
    this.show = this.ele.querySelector('.show')
    console.log(this.show)
    // 2. mask 盒子
    this.mask = this.ele.querySelector('.mask')
    // 3. enlarge 盒子
    this.enlarge = this.ele.querySelector('.enlarge')
    // 4. show 盒子的宽高
    this.show_width = this.show.clientWidth
    this.show_height = this.show.clientHeight
    // 5. enlarge 盒子的宽高
    this.enlarge_width = parseInt(window.getComputedStyle(this.enlarge).width)
    this.enlarge_height = parseInt(window.getComputedStyle(this.enlarge).height)
    // 6. 背景图片的尺寸
    this.bg_width = parseInt(window.getComputedStyle(this.enlarge).backgroundSize.split(' ')[0])
    this.bg_height = parseInt(window.getComputedStyle(this.enlarge).backgroundSize.split(' ')[1])
    // 7. 获取列表盒子
    this.list = this.ele.querySelector('.list')
  
    // 直接启动入口函数
    this.init()
  }
  
  
  // 书写方法
  Enlarge.prototype.init = function () {
    // 这个位置的 this 就是当前实例
    this.setScale()
    this.overOut()
    this.move()
    this.change()
  }
  
  Enlarge.prototype.setScale = function () {
    // 根据公式计算 mask 盒子的大小
    this.mask_width = this.show_width * this.enlarge_width / this.bg_width
    this.mask_height = this.show_height * this.enlarge_height / this.bg_height
  
    // 给 mask 盒子进行赋值
    this.mask.style.width = this.mask_width + 'px'
    this.mask.style.height = this.mask_height + 'px'
  }
  
 
  Enlarge.prototype.overOut = function () {
    
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
  
  Enlarge.prototype.move = function () {
    // 给 show 盒子绑定 move 事件
    this.show.addEventListener('mousemove', e => {
      // 处理事件对象兼容
      e = e || window.event
     
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
  
  Enlarge.prototype.change = function () {
    // 绑定事件
    this.list.addEventListener('click', e => {
      // 处理事件对象兼容
      e = e || window.event
      // 处理事件目标兼容
      const target = e.target || e.srcElement
  
      // 判断点击的是哪一个 img 元素
      if (target.nodeName === 'IMG') {
      
        const show_url = target.getAttribute('show')
        const enlarge_url = target.getAttribute('enlarge')
  
        
        this.show.firstElementChild.src = show_url
        this.enlarge.style.backgroundImage = `url(${ enlarge_url })`
  
       
        for (let i = 0; i < this.list.children.length; i++) {
          this.list.children[i].classList.remove('active')
        }
  
        target.parentElement.classList.add('active')
      }
    })
  }
  
