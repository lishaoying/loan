/**
 * 公共配置
 **/
var publicAllocation = {
    url: "",            //请求地址
    //Ajax二次封装
    initAjax: function(url, data, successfun) {
        $.ajax({
            url: url,
            data: data,
            type: "post",
            dataType: "json",
            success:function(data){
                if(successfun && typeof(successfun) === "function"){
                    successfun(data);
                }
            },
            error: function() {
                alert("网络超时");
            }
        });
    },
    //解析地址栏
    parseURL: function(urlparameter) {
        var _url = window.location.href.split("?")[1];
        if (_url != undefined) {
            var _index;
            var _arr = _url.split("&");
            for (var i = 0, _len = _arr.length; i < _len; i++) {
                if (_arr[i].indexOf(urlparameter + "=") >= 0) {
                    _index = i;
                    break;
                } else {
                    _index = -1;
                }
            }
            if (_index >= 0) {
                var _key = _arr[_index].split("=")[1];
                return _key;
            }
        }
    },
    /**
     * Login加载
     **/
    PageLoading: function (options) {
        var defaults = {
            opacity: 1,
            backgroundColor: "#fff",
            loadingTips: "",
            TipsColor: "#666",
            delayTime: 300,
            zIndex: 999,
            sleep: 0
        };
        var options = $.extend(defaults, options);
        var _PageHeight = document.documentElement.clientHeight,
            _PageWidth = document.documentElement.clientWidth;
        var _LoadingHtml = '<div id="loadingPage" style="position:fixed;left:0;top:0;_position: absolute;width:100%;height:' + _PageHeight + 'px;background:' + options.backgroundColor + ';opacity:' + options.opacity + ';filter:alpha(opacity=' + options.opacity * 100 + ');z-index:' + options.zIndex + ';"><div id="loadingTips" style="position: absolute; width: 40px;; height: 32px; background: ' + options.backgroundColor + ' url(images/loading.gif) no-repeat 5px center; color:' + options.TipsColor + '; font-size: 0px;">' + options.loadingTips + '</div></div>';
        $("body").append(_LoadingHtml);
        var _LoadingTipsH = document.getElementById("loadingTips").clientHeight,
            _LoadingTipsW = document.getElementById("loadingTips").clientWidth;

        var _LoadingTop = _PageHeight > _LoadingTipsH ? (_PageHeight - _LoadingTipsH) / 2 : 0,
            _LoadingLeft = _PageWidth > _LoadingTipsW ? (_PageWidth - _LoadingTipsW) / 2 + 40 / 4 : 0;

        $("#loadingTips").css({
            "left": _LoadingLeft + "px",
            "top": _LoadingTop + "px"
        });
        //监听页面加载状态
        document.onreadystatechange = PageLoaded;
        //当页面加载完成后执行
        function PageLoaded() {
            if (document.readyState == "complete") {
                console.log("页面加载完成");
                var loadingMask = $('#loadingPage');
                setTimeout(function () {loadingMask.animate({"opacity": 0}, options.delayTime, function () {
                    $(this).hide();
                    $(this).remove();
                });}, options.delayTime);
            }
        }
    },
    /**
     * 手机验证码倒计时
     **/
    Countdown: function(obj) {
        var count = 120;
        var timer = setInterval(function(){
            if(count == 0){
                obj.removeAttribute("disabled");
                obj.value = "重新获取验证码";
                count = 120;
                clearInterval(timer);
            }else{
                obj.setAttribute("disabled",true);
                obj.value = "" + count + "秒";
                count--;
            }
        },1000);
    },
    //复制公共类原型
    copy: function(source){
        var target = {};
        for (var i in source) {
            if (source.hasOwnProperty(i)) {
                target[i] = source[i];
            }
        }
        return target;
    }
};
publicAllocation.PageLoading({sleep: 300000});

/**
 * 公共类
 */
function Employee() {
    this.init.apply(this, arguments);
}
Employee.prototype = {
    constructor: Employee,
    init: function (doc, win) {
        this.doc = doc;
        this.win = win;
    },
    //动态计算fontSize
    rootNodeFontSize: function(){
        var docEl = this.doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            reCalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
                console.log(docEl.style.fontSize);
            };
        if (!this.doc.addEventListener) return;
        this.win.addEventListener(resizeEvt, reCalc, false);
        this.doc.addEventListener('DOMContentLoaded', reCalc, false);
    }
};
/**
 * 子类继承
 */
function Manager() {
    this.baseProto = Employee.prototype;
    this.init.apply(this, arguments);
}
Manager.prototype = publicAllocation.copy(Employee.prototype);
Manager.prototype.constructor = Manager;
Manager.prototype.init = (function (name, func) {
    return function () {
        var old = this.base;
        this.base = this.baseProto[name];
        var ret = func.apply(this, arguments);
        return ret;
    }
})('init', function (name, salary, percentage) {
    this.base(name, salary);
    this.percentage = percentage;
});
var ParentC = new Employee(document, window);
ParentC.rootNodeFontSize();
var SubclassC = new Manager();
//console.log(m instanceof Manager); //true
//console.log(m instanceof Employee); //false
//console.log(e instanceof Employee); //true
//console.log(e instanceof Manager); //false

/**
 * index.html业务逻辑
 */
var index = (function(){
    var closeArea = $("#closeArea"),
        areaCont,
        publicYear,
        areaCont2,  //月份
        areaCont3,  //日
        areaList = $("#areaList"),
        _self;
    var index = function(){
        this.x = 2;
        this.Destination = ['境内','境外','港澳台'];  //目的地
        this.PeopleNumber = ['1','2','3','4','5','6','7','8','9','10'];  //人数
        this.StagePeriod = ['6个月','12个月','24个月'];  //分期期限
        this.FullYear = []; //年份
        this.Month = ['1','2','3','4','5','6','7','8','9','10','11','12']; //月份
        this.Day = []; //日
    };
    index.prototype = {
        init: function(){
            _self = this;
            $(".kh-index-bt1s .pr1rem label").text(_self.Format());
            //下拉
            $("#kh-Destination, #kh-PeopleNumber, #kh-StagePeriod, #kh-Date").on("click",function(){
                var _obj = $(this);
                closeArea.attr("data-id", _obj[0].id);
                $("#kh-title").text(_obj[0].children[0].innerHTML);
                if(_obj[0].id == "kh-Destination") { $(".kh-index-Triangle").toggleClass('Kh-open'); }
                if(_obj[0].id == "kh-PeopleNumber") { $(".kh-index-PeopleNumber").toggleClass('Kh-open'); }
                if(_obj[0].id == "kh-StagePeriod") { $(".kh-index-StagePeriod").toggleClass('Kh-open'); }
                if(_obj[0].id == "kh-Date") {
                    $("#kh-title").text("行程起始年份");
                    $(".kh-index-Date").toggleClass('Kh-open');
                }
                _self.DropDown(_obj,_self);
            });
            //关闭
            closeArea.click(function() {
                var _id = closeArea.attr("data-id");
                if(_id == "kh-Destination") { $(".kh-index-Triangle").removeClass('Kh-open'); }
                if(_id == "kh-PeopleNumber") { $(".kh-index-PeopleNumber").removeClass('Kh-open'); }
                if(_id == "kh-StagePeriod") { $(".kh-index-StagePeriod").removeClass('Kh-open'); }
                if(_id == "kh-Date") { $("#backUp").removeAttr("onClick").hide(); $(".kh-index-Date").removeClass('Kh-open'); }
                _self.ClockArea();
            });
        },
        DropDown: function(_obj,_self){
            $("#areaMask").fadeIn();
            $("#areaLayer").animate({"bottom": 0});
            var id = _obj.attr("id");
            switch (id) {
                case 'kh-Destination':
                    return _self.DestinationFun(id);
                break;
                case 'kh-PeopleNumber':
                    return _self.DestinationFun(id);
                break;
                case 'kh-StagePeriod':
                    return _self.DestinationFun(id);
                    break;
                case 'kh-Date':
                    return _self.DestinationFun(id);
                    break;
                default:
                    return;
            }
        },
        DestinationFun: function(_id){
            areaCont = "";
            if(_id == "kh-Destination"){
                for (var i = 0, l = this.Destination.length; i < l; i++) {
                    areaCont += '<li class="'+ i + '">' + this.Destination[i] + '</li>';
                }
            }
            if(_id == "kh-PeopleNumber"){
                $("#areaLayer").animate({ "scrollTop": 0 });
                for (var j = 0, k = this.PeopleNumber.length; j < k; j++) {
                    areaCont += '<li class="'+ j + '">' + this.PeopleNumber[j] + '</li>';
                }
            }
            if(_id == "kh-StagePeriod"){
                for (var e = 0, f = this.StagePeriod.length; e < f; e++) {
                    areaCont += '<li class="'+ e + '">' + this.StagePeriod[e] + '</li>';
                }
            }
            if(_id == "kh-Date"){
                _self.StartYear(new Date().getFullYear(), new Date().getMonth() + 1);
            }
            areaList.html(areaCont);
            $("#areaList li").click(function(){
                if(_id == "kh-Destination"){
                    $("#kh-Destination .pr1rem label").text(_self.Destination[$(this).attr("class")]);
                    $(".kh-index-Triangle").removeClass('Kh-open');
                }
                if(_id == "kh-PeopleNumber"){
                    $("#kh-PeopleNumber .pr1rem label").text(_self.PeopleNumber[$(this).attr("class")]);
                    $(".kh-index-PeopleNumber").removeClass('Kh-open');
                }
                if(_id == "kh-StagePeriod"){
                    $("#kh-StagePeriod .pr1rem label").text(_self.StagePeriod[$(this).attr("class")]);
                    $(".kh-index-StagePeriod").removeClass('Kh-open');
                    $("#term").text(_self.StagePeriod[$(this).attr("class")].replace(/[^0-9]/ig,""));
                }
                if(_id == "kh-Date"){
                    _self.StartMonth($(this).attr("class"));
                    return;
                }
                _self.ClockArea();
            });
        },
        ClockArea: function(){
            $("#areaMask").fadeOut();
            $("#areaLayer").animate({"bottom": "-100%"});
        },
        //当前时间Y-m-d
        Format: function(){
            var time = new Date();
            var y = time.getFullYear();
            var m = time.getMonth()+1;
            var d = time.getDate();
            return y + '-' + _self.AddTime(m) + '-' + _self.AddTime(d);
        },
        AddTime: function(m){
            return m < 10 ? '0'+ m:m
        },
        //行程起始年份
        StartYear: function(Year){
            $("#kh-title").text("行程起始年份");
            $("#areaLayer").animate({ "scrollTop": 0 });
            for(var i = Year, j = Year+10; i < j; i++){
                if(this.FullYear.length >= 10){
                }else{
                    this.FullYear.push(i);
                }
                areaCont += '<li class="'+ i + '">' + i + '</li>';
            }
        },
        //行程起始月份
        StartMonth: function(_Year){
            areaCont2 = "";
            publicYear = _Year;
            $("#kh-title").text("行程起始月份");
            $("#areaLayer").animate({ "scrollTop": 0 });
            for (var i = 0, j = this.Month.length; i < j; i++) {
                areaCont2 += '<li class="'+ i + '">' + this.Month[i] + '</li>';
            }
            areaList.html(areaCont2);
            $("#backUp").show(0,function(){
                $("#backUp").click(function(){
                    $("#backUp").removeAttr("onClick").hide();
                    _self.DestinationFun("kh-Date");
                })
            });
            $("#areaList li").click(function(){
                _self.StartDay(publicYear, $(this).attr("class"));
                $("#kh-title").text("行程起始日");
            });
        },
        //行程起始日
        StartDay: function(Year, Month){
            areaCont3 = "";
            $("#areaLayer").animate({ "scrollTop": 0 });
            var d = new Date(Year, Month, 1);
            d.setDate(d.getDate()+32 - d.getDate());
            for(var i = 1, j = 32-d.getDate(); i < j+1; i++){
                areaCont3 += '<li class="'+ i + '">' + i + '</li>';
            }
            areaList.html(areaCont3);
            $("#backUp").click(function(){
                areaList.children().remove();
                _self.StartMonth(Year);
            });
            var whole = parseFloat(Month) + 1;
            $("#areaList li").click(function(){
                $("#backUp").removeAttr("onClick").hide();
                $("#kh-Date .pr1rem label").text(Year + '-' + whole + '-' + $(this).attr("class"));
                $(".kh-index-Date").removeClass('Kh-open');
                _self.ClockArea();
            });
        }
    };
    /**
     * 验证
     */
    (function($){
        $.fn.validate = function(){
            var objThat = this,
                iSok = false;

            //自定义规则
            var defaults = {
                //验证错误提示信息
                tips_success: '', //验证成功时的提示信息，默认为空
                tips_integer: '只能输入整数',
                tips_AmountRange: '分期总金额范围为600~50000',

                //匹配正则
                reg_d: /^([1-9]\d*|0)(\.\d*[1-9])?$/ //只能输入整数
            };

            $(":text,:password").bind('input propertychange', function() {
                $("#ApplicationAmount").text($(this).val());
                var _validate = $(this).attr("data-check");
                if (_validate) {
                    var arr = _validate.split('||');
                    for (var i = 0, l = arr.length; i < l; i++) {
                        if (!check($(this), arr[i], $(this).val())){
                            $("#ApplicationAmount").text(10000);
                            $('#kh-index-button').attr("disabled",true);
                            document.getElementById("kh-index-button").style.backgroundColor = "#bbbbbb";
                            document.getElementById("kh-index-button").style.borderColor = "#bbbbbb";
                            iSok = false;
                            return false;
                        } else{
                            continue;
                        }
                    }
                    iSok = true;
                    if(iSok = true){
                        $("#ApplicationAmount").text($(this).val());
                        $('#kh-index-button').attr("disabled",false);
                        document.getElementById("kh-index-button").style.backgroundColor = "red";
                        document.getElementById("kh-index-button").style.borderColor = "red";
                    }
                }
            });

            var check = function (obj, _match, _val) {
                switch (_match) {
                    case 'integer':
                        return chk(_val, defaults.reg_d) ? showMsg(obj, defaults.tips_success, true) : showMsg(obj, defaults.tips_integer, false);
                    case 'AmountRange':
                        return _val < 600 || _val > 50000 ? showMsg(obj, defaults.tips_AmountRange, false) : showMsg(obj, defaults.tips_success, true);
                    default:
                        return true;
                }
            };

            var chk = function (str, reg) {
                return reg.test(str);
            };

            var showMsg = function (obj, msg, mark) {
                $(".kh-index-error").text(msg);
                if(mark){
                    $(".kh-index-error").text(msg);
                }
                return mark;
            };

            if (objThat.is("form")) {
                objThat.submit(function (e) {
                    e.preventDefault();
                    if(iSok === true){
                        alert("提交成功");
                    }
                });
            }
        }
    })(jQuery);
    $("#ImmediateApplication").validate();
    return {
        index : new index().init()
    };
})();


/**
 * LandingExit.html业务逻辑
 */
var LandingExit = (function(){
    var _count = 0,
        _self;
    var m1 = function(){
        this.x = 2;
    };
    m1.prototype = {
        init: function(){
            _self = this;
            _self.test();
        },
        test: function(){
        }
    };
    return {
        m1 : new m1().init()
    };
})();

/**
 * Login.html业务逻辑
 */
var Login = (function(){
    var _count = 0,
        _self;
    var m1 = function(){
        this.x = 2;
    };
    m1.prototype = {
        init: function(){
            _self = this;
            _self.test();
        },
        test: function(){
        }
    };
    return {
        m1 : new m1().init()
    };
})();

/**
 * MyGuide.html业务逻辑
 */
var MyGuide = (function(){
    var _count = 0,
        _self;
    var m1 = function(){
        this.x = 2;
    };
    m1.prototype = {
        init: function(){
            _self = this;
            _self.test();
        },
        test: function(){
        }
    };
    return {
        m1 : new m1().init()
    };
})();

/**
 * MyInformation.html业务逻辑
 */
var MyInformation = (function(){
    var _count = 0,
        _self;
    var m1 = function(){
        this.x = 2;
    };
    m1.prototype = {
        init: function(){
            _self = this;
            _self.test();
        },
        test: function(){
        }
    };
    return {
        m1 : new m1().init()
    };
})();

/**
 * MyLoan.html业务逻辑
 */
var MyLoan = (function(){
    var _count = 0,
        _self;
    var m1 = function(){
        this.x = 2;
    };
    m1.prototype = {
        init: function(){
            _self = this;
            _self.test();
        },
        test: function(){
        }
    };
    return {
        m1 : new m1().init()
    };
})();

/**
 * MyRepayment.html业务逻辑
 */
var MyRepayment = (function(){
    var _count = 0,
        _self;
    var m1 = function(){
        this.x = 2;
    };
    m1.prototype = {
        init: function(){
            _self = this;
            _self.test();
        },
        test: function(){
        }
    };
    return {
        m1 : new m1().init()
    };
})();

/**
 * SignatureResult.html业务逻辑
 */
var SignatureResult = (function(){
    var _count = 0,
        _self;
    var m1 = function(){
        this.x = 2;
    };
    m1.prototype = {
        init: function(){
            _self = this;
            _self.test();
        },
        test: function(){
        }
    };
    return {
        m1 : new m1().init()
    };
})();

/**
 * UnitInformation.html业务逻辑
 */
var UnitInformation = (function(){
    var _count = 0,
        _self;
    var m1 = function(){
        this.x = 2;
    };
    m1.prototype = {
        init: function(){
            _self = this;
            _self.test();
        },
        test: function(){
        }
    };
    return {
        m1 : new m1().init()
    };
})();

/**
 * UploadContract.html业务逻辑
 */
var UploadContract = (function(){
    var _count = 0,
        _self;
    var m1 = function(){
        this.x = 2;
    };
    m1.prototype = {
        init: function(){
            _self = this;
            _self.test();
        },
        test: function(){
        }
    };
    return {
        m1 : new m1().init()
    };
})();

/**
 * UploadDocuments.html业务逻辑
 */
var UploadDocuments = (function(){
    var _count = 0,
        _self;
    var m1 = function(){
        this.x = 2;
    };
    m1.prototype = {
        init: function(){
            _self = this;
            _self.test();
        },
        test: function(){
        }
    };
    return {
        m1 : new m1().init()
    };
})();

/**
 * CheckCard.html业务逻辑
 */
var CheckCard = (function(){
    var _count = 0,
        _self;
    var m1 = function(){
        this.x = 2;
    };
    m1.prototype = {
        init: function(){
            _self = this;
            _self.test();
        },
        test: function(){
        }
    };
    return {
        m1 : new m1().init()
    };
})();

/**
 * BeiYinElectronicSignature.html业务逻辑
 */
var BeiYinElectronicSignature = (function(){
    var _count = 0,
        _self;
    var m1 = function(){
        this.x = 2;
    };
    m1.prototype = {
        init: function(){
            _self = this;
            _self.test();
        },
        test: function(){
        }
    };
    return {
        m1 : new m1().init()
    };
})();

/**
 * CreditMessage.html业务逻辑
 */
var CreditMessage = (function(){
    var _count = 0,
        _self;
    var m1 = function(){
        this.x = 2;
    };
    m1.prototype = {
        init: function(){
            _self = this;
            _self.test();
        },
        test: function(){
        }
    };
    return {
        m1 : new m1().init()
    };
})();

/**
 * EmergencyContact.html业务逻辑
 */
var EmergencyContact = (function(){
    var _count = 0,
        _self;
    var m1 = function(){
        this.x = 2;
    };
    m1.prototype = {
        init: function(){
            _self = this;
            _self.test();
        },
        test: function(){
        }
    };
    return {
        m1 : new m1().init()
    };
})();

/**
 * EssentialInformation.html业务逻辑
 */
var EssentialInformation = (function(){
    var _count = 0,
        _self;
    var m1 = function(){
        this.x = 2;
    };
    m1.prototype = {
        init: function(){
            _self = this;
            _self.test();
        },
        test: function(){
        }
    };
    return {
        m1 : new m1().init()
    };
})();

/**
 * ExaminationResults.html业务逻辑
 */
var ExaminationResults = (function(){
    var _count = 0,
        _self;
    var m1 = function(){
        this.x = 2;
    };
    m1.prototype = {
        init: function(){
            _self = this;
            _self.test();
        },
        test: function(){
        }
    };
    return {
        m1 : new m1().init()
    };
})();

//页面路由
(function (win) {
    var _pathname = win.location.pathname.split("/");
    switch (_pathname[3])
    {
        case "index.html":
            return index.index;
            break;
        case "LandingExit.html":
            return LandingExit.m1;
        case "Login.html":
            return Login.m1;
        case  "MyGuide.html":
            return MyGuide.m1;
        case "MyInformation.html":
            return MyInformation.m1;
        case "MyLoan.html":
            return MyLoan.m1;
        case "MyRepayment.html":
            return MyRepayment.m1;
        case "SignatureResult.html":
            return SignatureResult.m1;
        case "UnitInformation.html":
            return UnitInformation.m1;
        case "UploadContract.html":
            return UploadContract.m1;
        case "UploadDocuments.html":
            return UploadDocuments.m1;
        case "BeiYinElectronicSignature.html":
            return BeiYinElectronicSignature.m1;
        case "CheckCard.html":
            return CheckCard.m1;
        case "CreditMessage.html":
            return CreditMessage.m1;
        case "EmergencyContact.html":
            return EmergencyContact.m1;
        case "EssentialInformation.html":
            return EssentialInformation.m1;
        case "ExaminationResults.html":
            return ExaminationResults.m1;
        default:
    }
})(window);

