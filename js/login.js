$(function () {
    $("#login").validate({
        // 1、规则配置
        rules: {
            username: {
                required: true,
                minlength: 5,
                maxlength: 10

            },
            password:{
                required: true,
                minlength: 6,
                maxlength: 12
            }

        },
        // 2、提示信息配置
        messages: {
            username:{
                required: '请填写用户名信息',
                minlength: '最少5个字符',
                maxlength: '最多10个字符'
            }

        },
        // 3、表单提交事件（表单验证通通过以后会执行的函数）
        submitHandler(form) {
            
            // 3-1 拿到用户输入的信息
            const info = $(form).serialize()
            // console.log(info)
            // 3-2发送请求到后端        
                $.post('./server/login.php',info, null,'json').then(res =>{
                   console.log(res.code)
                   if(res.code === 0){
                    //    登陆失败 移出hide 就是让他显示
                    $('.login_error').removeClass('hide') 
                   }else if(res.code === 1) {
                    //    登陆成功 跳转页面 ，存储cookie
                    setCookie('nickname',res.nickname) 
                    // 跳转页面
                    window.location.href = './index1.html'

                   }

                })
        }
    })
})