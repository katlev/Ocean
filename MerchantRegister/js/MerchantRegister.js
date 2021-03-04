/*MerchantRegister js*/
//注册页面转换
$(function () {

    Mer_token = window.localStorage.getItem('Mer_token')

    IdCardUpload()
    /*身份证明上传*/
    function IdCardUpload() {
        var input = document.getElementById("file_input1")
        var result , div;
        if(typeof FileReader === 'undefined'){
            result.innerHTML = "你的浏览器不支持File Reader"
            input.setAttribute('disabled','disabled')

        }else{
            input.addEventListener('change',readFile,false)
        }

        function readFile() {
            for(var i = 0 ; i < this.files.length ; i++){
                if(!input['value'].match(/.jpg|.gif|.png|.bmp/i)){
                    alert("上传的图片格式不正确")
                }
                var reader = new FileReader()
                reader.readAsDataURL(this.files[i])
                var formData = new FormData()
                formData.append('image',this.files[i])
                $('.UploadI').css('display','none')
                reader.onload = function (e) {
                    result = '<img src=" '+ this.result +' " alt="" id="idCardImg"/>'
                    /*console.log(result)*/
                    div = document.createElement('div')
                    div.className = 'UploadImg'
                    div.innerHTML = result
                    document.querySelector('.MerchantPhotoUpload').appendChild(div)

                    $.ajax({
                        type:'post',
                        url:'http://39.108.184.155:8080/searanch/upload/uploadImag',
                        headers:{'Authorization':Mer_token},
                        xhrFields:{//实现跨域访问
                            withCredentials:false
                        },
                        processData:false,
                        contentType:false,
                        data: formData,
                        success:function (res) {
                            console.log(res)
                            if(res.code === 200){
                                console.log(res.message)
                                alert('证件照上传成功')
                                console.log(res.data)
                                let IdCardUrl = res.data
                                window.localStorage.setItem('idCardUrl',IdCardUrl)
                            }else{
                                console.log(res.message)
                                alert('证件照上传失败')
                            }
                        },
                        error:function (error) {
                            console.log(error)
                            console.log('上传错误')
                        }
                    })
                }
            }
        }

        var select = document.querySelector(".MerchantIdCard .MerchantPhotoUpload")
        select.onclick = function () {
            $("#file_input1").trigger("click")
        }

    }

    LicenseUpload()
    /*养殖证明上传*/
    function LicenseUpload() {
        var input = document.getElementById("file_input2")
        var result , div;
        if(typeof FileReader === 'undefined'){
            result.innerHTML = "你的浏览器不支持File Reader"
            input.setAttribute('disabled','disabled')

        }else{
            input.addEventListener('change',readFile,false)
        }

        function readFile() {
            for(var i = 0 ; i < this.files.length ; i++){
                if(!input['value'].match(/.jpg|.gif|.png|.bmp/i)){
                    alert("上传的图片格式不正确")
                }
                var reader = new FileReader()
                reader.readAsDataURL(this.files[i])
                var formData2 = new FormData()
                formData2.append('image',this.files[i])
                $('.LicenseI').css('display','none')
                reader.onload = function (e) {
                    result = '<img src=" '+ this.result +' " alt="" id="licenseImg"/>'
                    div = document.createElement('div')
                    div.className = 'LicenseImg'
                    div.innerHTML = result
                    document.querySelector('.MerchantPhotoLicense').appendChild(div)

                    $.ajax({
                        type:'post',
                        url:'http://39.108.184.155:8080/searanch/upload/uploadImag',
                        headers:{'Authorization':Mer_token},
                        xhrFields:{//实现跨域访问
                            withCredentials:false
                        },
                        processData:false,
                        contentType:false,
                        data: formData2,
                        success:function (res) {
                            console.log(res)
                            if(res.code === 200){
                                console.log(res.message)
                                alert('养殖证上传成功')
                                console.log(res.data)
                                let licenseCardUrl = res.data
                                window.localStorage.setItem('licenseCardUrl',licenseCardUrl)
                            }else{
                                console.log(res.message)
                                alert('养殖证上传失败')
                            }
                        },
                        error:function (error) {
                            console.log(error)
                            console.log('上传错误')
                        }
                    })
                }
            }
        }

        var select = document.querySelector(".MerchantLicense .MerchantPhotoLicense")
        select.onclick = function () {
            $("#file_input2").trigger("click")
        }
    }

    RegisterStepTab()
    /*样式切换*/
    function RegisterStepTab() {
        $('#Register1').click(
            function () {
                var merchantphone = $('#MerchantPhone').val()
                var merchantcode = $('#MerchantCode').val()
                var merchantRegisterName = $('#MerchantRegisterName').val()
                var merchantRegisterPwd = $('#MerchantRegisterPwd').val()
                var merchantRegisterPwdAgain = $('#MerchantRegisterPwdAgn').val()

                if(merchantphone.trim() === '' ||
                    merchantcode.trim() === '' ||
                    merchantRegisterName.trim() === '' ||
                    merchantRegisterPwd.trim() === '' ||
                    merchantRegisterPwdAgain.trim() === ''){
                    alert("输入不能为空！")
                    console.log('输入为空')
                }else if(merchantRegisterPwd !== merchantRegisterPwdAgain){
                    alert("输入的密码不一致")
                }
                else{
                    $('#step1').css('display','none')
                    $('#step2').css('display','inline-block')
                }
            }
        )
        $('#Register2').click(function () {
            var merchantName = $('#MerchantName').val()
            var country = $('#s1 option:selected').text()
            var province = $('#id_provSelect option:selected').text()
            var city = $('#id_citySelect option:selected').text()
            var address = $('#MerchantRegisterAddress').val()
            var merchantemail = $('#MerchantRegisterEmail').val()

            if( merchantName.trim() === '' ||
                merchantemail.trim() === ''||
                country.trim() === ''||
                province.trim() === '' ||
                city.trim() === '' ||
                address.trim() === ''){
                alert('输入不能为空！')
            }
            else{
                $('#step2').css('display','none')
                $('#step3').css('display','inline-block')
            }
        })

        $('#Register3').click(function () {
            var MerchantIdNumber = $('#MerchantIdNumber').val()
            if(MerchantIdNumber === ''){
                alert('输入不能为空')
            }else{
                $('#step3').css('display','none')
                $('#step4').css('display','inline-block')
            }
        })
    }

    MerchantRegister()
    /*商户注册*/
    function MerchantRegister() {

        $('#Register4').click(function () {

            var merchantPhone = $('#MerchantPhone').val()
            var code = $('#MerchantCode').val()
            var username = $('#MerchantRegisterName').val()
            var password = $('#MerchantRegisterPwd').val()
            var country = $('#s1 option:selected').text()
            var province = $('#id_provSelect option:selected').text()
            var city = $('#id_citySelect option:selected').text()
            var address = $('#MerchantRegisterAddress').val()
            var email = $('#MerchantRegisterEmail').val()
            var idCard = $('#MerchantIdNumber').val()
            var license = $('#MerchantLicenseName').val()
            var merchantName = $('#MerchantName').val()
            var idCardImag = window.localStorage.getItem('idCardUrl')
           /* console.log('id:',idCardImag)*/
            var licenseImag = window.localStorage.getItem('licenseCardUrl')
            /*console.log(licenseImag)*/

            $.ajax({
                type:'post',
                url:'http://39.108.184.155:8080/searanch/merchantRegister',
                datatype: 'json',
                contentType:'application/json;charset=UTF-8',
                xhrFields: {
                    withCredentials:true
                },
                data:JSON.stringify({
                    merchantPhone:merchantPhone,
                    code:code,
                    username:username,
                    password:password,
                    country:country,
                    province:province,
                    city:city,
                    address:address,
                    email:email,
                    idCardImag:idCardImag,
                    licenseImag:licenseImag,
                    idCard:idCard,
                    license:license,
                    merchantName:merchantName
                }),
                success:function (res) {
                    console.log(res)
                    if(res.code === 200){
                        console.log(res.message)
                        alert('注册成功')
                        window.location.href="../MerchantLogin/MerchantLogin.html"
                    }else{
                        console.log(res.message)
                        alert(res.message)
                    }
                },
                error:function (error) {
                    console.log(error)
                    console.log('请求失败')
                }
            })
        })
    }
})

/*发送验证码*/
var MerchantSend = {
    checked:1,
    MerchantSendCode:function () {
        var MerchantSendCodePhone = /^1\d{10}$/
        var phoneNumber = $('#MerchantPhone').val().replace(/\s+/g,"")

        if(!MerchantSendCodePhone.test(phoneNumber) ||phoneNumber.length === 0){
            alert("你输入的手机格式有错误！")
            return false
        }

        $.ajax({
            type:'post',
            url:'http://39.108.184.155:8080/searanch/getMessageCode',
            datatype:'json',
            data:{phoneNumber:phoneNumber},
            xhrFields:{//实现跨域访问
                withCredentials:true
            },
            success:function (res) {
                console.log(res)
                alert('验证码发送成功')
            },
            error:function (error) {
                console.log(error)
            }
        })

        if(MerchantSendCodePhone.test(phoneNumber)){
            var time = 60
            function MerchantCodeTime(){
                if(time === 0){
                    clearInterval(timer)
                    $('.SendCode a').addClass('MerchantSendCode1').removeClass('MerchantSendCode2').html('发送验证码')
                    MerchantSend.checked = 1
                    return true
                }
                $('.SendCode a').html(time + 's后再次发送')
                time--
                return false
                MerchantSend.checked = 0
            }
            $('.SendCode a').addClass('MerchantSendCode2').removeClass("MerchantSendCode1")
            MerchantCodeTime()
            var timer = setInterval(MerchantCodeTime,1000)
        }
    }
}



