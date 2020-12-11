/* 商品列表页 js */
$(function () {

    // 0. 准备一个变量, 接受所有的商品信息
    let list = null
 
     list_info = {
         cat_one: 'all',
         cat_two: 'all',
         cat_three: 'all',
         sort_method: '综合',
         sort_type: 'ASC',
         current: 1,
         pagesize: 12
     }
 
     //  1. 请求一级分类列表
     getCateOne()
     async function getCateOne() {
         // 1-2 发送请求获取
         const cat_one_list = await $.get('./server/getCateOne.php', null, null, 'json')
         console.log(cat_one_list)
         let str = `<span data-type="all" class="active">全部</span>` //这个要写在外面
         cat_one_list.list.forEach(item => {
 
             str += `
             <span data-type="${item.cat_one_id}">${item.cat_one_id}</span>
             `
         })
         $('.cateOneBox > .right').html(str)
     }
      // 1-2. 请求二级分类列表
      async function getCateTwo(){
          // 1. 请求二级分类列表数据
         const cat_two_list = await $.get('./server/getCateTwo.php', {cat_one:list_info.cat_one}, null, 'json')
           // 2. 根据二级列表数据渲染页面
           let str ='<span  data-type="all" class="active">全部</span>'
           cat_two_list.list.forEach(item =>{
               str +=`<span data-type="${item.cat_two_id}">${item.cat_two_id}</span>`
           })
           $('.catTwoBox .right').html(str)
      }
      // 1-3. 请求三级分类列表
      getCateThree()
      async function getCateThree(){
            // 1. 请求三级分类列表数据
            const cat_three_list =await $.get('./server/getCateThree.php',{cat_one: list_info.cat_one, cat_two:list_info.cat_two},null,'json')
         //    console.log(cat_three_list)
         let str ='<span  data-type="all" class="active">全部</span>'
         cat_three_list.list.forEach(item => {
         str +=`<span data-type="${item.cat_three_id}">${item.cat_three_id}</span>`
       })
       $('.catThreeBox .right').html(str)
 
      }
 
     // 2.请求 总页数 渲染分页器
     getTotalPage()
     async function getTotalPage() {
         // 2-1. 请求分页数据
         const totalInfo = await $.get('./server/getTotalPage.php', list_info, null, 'json')
         // console.log(totalInfo)
         // 2-2. 渲染分页内容  jquery-pagination 插件
         $('.pagination').pagination({
             pageCount: totalInfo.total , //一共多少页
             // 8-1.分页切换
             callback(index){
                 // console.log(index.getCurrent())
                 list_info.current = index.getCurrent()
                  // 从新请求商品列表
                  getGoodsList()
 
             }
         })
     }
 
    // 3. 请求商品列表数据
     getGoodsList()
     async function getGoodsList() {
         // 3-1. 请求商品列表
         const goodsList = await $.get('./server/getGoodsList.php', list_info, null, 'json')
         // console.log(goodsList)
         // console.log(goodsList.list)
          
         // 给全局变量 list 进行赋值
     list = goodsList.list
     
         // 3-2. 渲染页面
         let str = ''
         goodsList.list.forEach(item => {
             str += `
         <li class="thumbnail">
         <img src="${item.goods_big_logo}" alt="...">
         <div class="caption">
           <h3 data-id="${item.goods_id}">${item.goods_name}</h3>
           <p class="price">￥ 
           <span class="text-danger">${item.goods_price}</span></p>
           <p>
             <a href="javascript:;" class="btn btn-danger addCart" role="button" data-id="${ item.goods_id }">加入购物车</a>
             <a href="./cart.html" class="btn btn-warning" role="button">去结算</a>
           </p>
         </div>
       </li>
               `
         })
         $('.goodsList >ul').html(str)
     }
     // 4. 一级分类 的点击事件
     $('.cateOneBox').on('click','span',function(){
        
         $(this).addClass('active').siblings().removeClass('active')
         const type = $(this).data('type')  //type 就是一级分类里面的名，比如大家电
         list_info.cat_two = 'all'
         list_info.cat_three = 'all'
         list_info.current = 1  
         list_info.cat_one = type // console.log(list_info)
         getTotalPage()
         getGoodsList()
   $('.catThreeBox .right').html('<span data-type="all" class="active">全部</span>')  
          if(type === 'all'){
             $('.catTwoBox > .right').html('<span class="active">全部</span>')
            
          }else{
              getCateTwo()
          }
     })
      // 5. 二级分类的点击事件
       $('.catTwoBox').on('click', 'span', function(){
         $(this).addClass('active').siblings().removeClass('active')
         list_info.cat_three = 'all'
         list_info.current = 1  
         const type = $(this).data('type')//console.log(type)
            list_info.cat_two = type
            getTotalPage()
            getGoodsList()
         if(type === 'all'){
              $('.catThreeBox .right').html('<span data-type="all" class="active">全部</span>')
 
         }else{
          getCateThree() 
 
         }
       })
        // 6. 三级分类的点击事件
   $('.catThreeBox').on('click', 'span', function () {
     const type = $(this).data('type')
 
     $(this).addClass('active').siblings().removeClass('active')
 
     list_info.cat_three = type
     list_info.current = 1
     getTotalPage()
     getGoodsList()
   })
   // 7. 排序方式的点击事件
   $('.sortBox').on('click','span',function(){
       const method = $(this).attr('data-method')
       const type = $(this).attr('data-type')
     //   console.log(method,type)
       $(this).addClass('active').siblings().removeClass('active')
        list_info.sort_method = method
        list_info.sort_type = type
     //    console.log(list_info.sort_method,list_info.sort_type)
        getTotalPage()
        getGoodsList()
        $(this)
        .attr('data-type',type === 'ASC'? 'DESC':'ASC')
        .siblings()
        .attr('data-type','ASC')
   })
  
     //   9. 点击 商品描述 跳转到 详情页  
     $('.goodsList ul').on('click','h3',function(){
       // console.log(this)
       const id = $(this).data('id')
        setCookie('goods_id',id)
         window.location.href = './detail.html'
     })
     // 10、加入购物车
     $('.goodsList').on('click', '.addCart', function () {
       const cart = JSON.parse(window.localStorage.getItem('cart')) || []
        const id = $(this).data('id')
       const flag = cart.some(item => item.goods_id == id)
       if (flag) {
           const cart_goods = cart.filter(item => item.goods_id == id)[0]
           cart_goods.cart_number = cart_goods.cart_number - 0 + 1 //此处换成+1
       } else {
       const info = list.filter(item => item.goods_id == id)[0]
         info.cart_number = 1
           cart.push(info)
       }
       window.localStorage.setItem('cart', JSON.stringify(cart))
 
   })
 
 
 })
 
 