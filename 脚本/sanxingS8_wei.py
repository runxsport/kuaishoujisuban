# coding: utf-8
from appium import webdriver
from time import sleep

# 伟哥手机号
phone = '18161804550'
# 伟哥登录密码
password = 'lwz123456'

# 开端口
# adb -s 9889d641434f445a50 tcpip 5560
# 连接三星s8
# adb connect 10.211.22.47:5560
# 断开连接
# adb disconnect connect 10.211.22.47:5560

# appium需要的参数
desired_caps = {'platformName': 'Android',
                'deviceName': '10.211.22.47'
                              ':5557',
                # 'deviceName': '9889d641434f445a50',
                'platformVersion': '8.0.0',
                'appPackage': 'com.kuaishou.nebula',
                'appActivity': 'com.yxcorp.gifshow.HomeActivity',
                'unicodeKeyboard': True,
                'resetKeyboard': True}
driver = webdriver.Remote("http://127.0.0.1:4723/wd/hub", desired_caps)
sleep(3)

try:
    # 点击一下屏幕
    driver.swipe(537, 1472, 537, 1472, 1)
    # 点击同意用户协议
    driver.swipe(542, 1414, 542, 1414, 1)
    sleep(3)

    try:
        # 点击系统权限弹框
        driver.find_element_by_id('com.android.packageinstaller:id/permission_allow_button').click()
        driver.find_element_by_id('com.android.packageinstaller:id/permission_allow_button').click()
        driver.find_element_by_id('com.android.packageinstaller:id/permission_allow_button').click()
    except:
        pass
    sleep(1)

    try:
        driver.swipe(500, 2000, 500, 200, 1000)
        # 关闭‘恭喜收到现金红包’
        driver.swipe(136, 470, 136, 470, 1)
    except:
        # 关闭‘恭喜收到现金红包’
        driver.swipe(136, 470, 136, 470, 1)
except:
    pass
sleep(1)

try:
    # 点击登录
    driver.find_element_by_id('com.kuaishou.nebula:id/like_icon').click()
    # 点击其他方式登录登录
    driver.find_element_by_id('com.kuaishou.nebula:id/other_login_tv').click()
except:
    pass

# 断言是否登录成功
try:
    # 点击密码登录
    driver.find_element_by_id('com.kuaishou.nebula:id/login_mode_switcher').click()
    # 输入手机号
    driver.find_element_by_xpath(
        '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget'
        '.FrameLayout/android.widget.LinearLayout/android.widget.RelativeLayout['
        '2]/android.widget.RelativeLayout/android.widget.EditText').send_keys(phone)
    # 输入密码
    driver.find_element_by_id('com.kuaishou.nebula:id/password_et').send_keys(password)
    # 勾选用户协议
    driver.find_element_by_id('com.kuaishou.nebula:id/protocol_checkbox').click()
    # 点击登录
    driver.find_element_by_id('com.kuaishou.nebula:id/confirm_btn').click()
except:
    pass

# 循环滑动屏幕
while True:
    try:
        # 滑动屏幕
        driver.swipe(500, 2000, 500, 200, 1000)
        sleep(3)
    except:
        pass