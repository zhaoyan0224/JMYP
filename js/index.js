     // 轮播图 start
  class Banner{
        constructor(ele){
            this.ele = document.querySelector(ele)
            this.imgBox = this.ele.querySelector('.imgBox')
            this.pointBox = this.ele.querySelector('.pointBox')
            this.leftRightBox = this.ele.querySelector('.leftRightBox')
            this.index = 0
            this.timer = 0

            this.init()
        }
         // 入口函数设置
    init() {
        this.setPoint()
        this.autoPlay()
        this.overOut()
        this.leftRight()
        this.pointEvent()
        this.changePage()
    }
      //1.设置焦点
    setPoint() {
        const pointNum = this.imgBox.children.length
        const frg = document.createDocumentFragment()
        for (let i = 0; i < pointNum; i++) {
            const li = document.createElement('li')
            if (i === 0) li.className = 'active'

            li.setAttribute('i', i)

            frg.appendChild(li)
        }

        this.pointBox.appendChild(frg)
    } 
    // 2.切换一张
    changeOne(type) {
        // 让当前这一张消失
        this.imgBox.children[this.index].classList.remove('active')
        // 焦点上的active 同时也消失  联动
        this.pointBox.children[this.index].classList.remove('active')
        // 修改index值
        if (type === true) {
            this.index++
        } else if (type === false){
            this.index--
        } else {
            this.index = type
        }
        if (this.index >= this.imgBox.children.length) this.index = 0
        if (this.index < 0) this.index = this.imgBox.children.length - 1

        // 让当前这一张显示
        this.imgBox.children[this.index].classList.add('active')
        this.pointBox.children[this.index].classList.add('active')
    
    }
     // 3.自动轮播
     autoPlay(){
        this.timer = setInterval(() =>{
            this.changeOne(true)

        },2000)
    }
    // 4.移入移出
    overOut(){
        this.ele.addEventListener('mouseover',() => clearInterval(this.timer))
        this.ele.addEventListener('mouseout',() => this.autoPlay())
    }
    // 5.左右切换
    leftRight(){
        this.leftRightBox.addEventListener('click', e => {
            e =  e || window.event
            const target = e.target || e.srcElement
            if(target.className === 'left'){
                this.changeOne(false)
            }
            if(target.className === 'right'){
                this.changeOne(true)
            }

        })
    }
    // 6.焦点切换
    pointEvent(){
        this.pointBox.addEventListener('click',e => {
            e =  e || window.event
            const target = e.target || e.srcElement
            if(target.nodeName === 'LI'){
                const i = target.getAttribute('i') - 0
                this.changeOne(i)
            }
        })
    }
    // 7.切换页面
    changePage(){
        document.addEventListener('visibilitychange',() =>{
            const state = document.visibilityState
            if(state === 'hidden') clearInterval(this.timer)
            if(state === 'visible')  this.autoPlay()
        })
    }
    }
    // 轮播图 end

   // 搜索引擎  start
const ul = document.querySelector('.search > ul')
// 1. 给 文本框 绑定给一个 input 事件
const inp = document.querySelector('.search > input')
inp.addEventListener('input', function () {

  // 2. 拿到文本框输入的内容
  const value = this.value.trim()
  if (!value) return
    
  // 3. 准备发送请求
  const script = document.createElement('script')
  const url = `https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=1446,32857,33124,33061,32973,33099,33101,32962,22159&wd=${value}&req=2&csor=1&cb=bindHtml&_=1605768936993`
  script.src = url
  document.body.appendChild(script)
  script.remove()
})
 // 全局准备一个 jsonp 的处理函数
 function bindHtml(res) {
    if (!res.g) {
        ul.classList.remove('active')
        return
      }
    
       let str = ''

       for (let i = 0; i < res.g.length; i++) {
         str += `
           <li>${ res.g[i].q }</li>
         `
       }
       ul.innerHTML = str
       // 让 ul 显示出来
       ul.classList.add('active')
    //    显示隐藏
       const val = $('.search>input').val().length
    //    console.log(val)
      if(val===1){
        $('.search>ul').removeClass('active')
    }

 }
  // 搜索引擎  end

//   登录页面 js start
$(function () {

    // 1. 根据 cookie 中的信息
    // 判断用户信息面板中显示哪一个内容
    const nickname = getCookie('nickname')
    // 2. 根据 nickname 信息进行判断
    if (nickname) {
      // 表示存在, 不是 undefined
      $('.off').addClass('hide')
      $('.on').removeClass('hide').text(`欢迎您: ${nickname} `)
      $('.fl>p').css({display:'block'})
    }else if(!nickname){
        $('.fl>p').css({display:'none'})
    }
    $('.fl').on('click','p',function(){
        removeCookie('nickname')
        window.location.reload()
    })
})
//   登录页面 js end




