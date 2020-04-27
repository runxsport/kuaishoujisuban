# coding: utf-8
from appium import webdriver
from time import sleep

# 登录手机号密码
# phone = '18295995951'
phone = '15221154439'
# 宝哥手机号
# phone = '18516058681'
# 杨兄手机号
# phone = '15102117919'

# 密码
password = 'admin123456'
# 宝哥登录密码
# password = '1qaz2wsx'
# 杨兄登录密码
# password = 'yzp123456'

# 开端口
# adb -s 3bd6729e tcpip 5559
# 连接三星s8
# adb connect 10.211.20.92:5559
# 断开连接
# adb disconnect connect 10.211.20.92:5559

# appium需要的参数
desired_caps = {'platformName': 'Android',
                'deviceName': '10.211.20.92:5559',
                # 'deviceName': '3bd6729e',
                'platformVersion': '8.1.0',
                'appPackage': 'com.kuaishou.nebula',
                'appActivity': 'com.yxcorp.gifshow.HomeActivity',
                'unicodeKeyboard': True,
                'resetKeyboard': True}
driver = webdriver.Remote("http://127.0.0.1:4723/wd/hub", desired_caps)
sleep(3)
try:
    # 点击同意用户协议
    driver.swipe(362, 934, 362, 934, 1)
    sleep(3)
    try:
        # 点击系统权限弹框
        driver.find_element_by_id('com.android.packageinstaller:id/permission_allow_button').click()
        try:
            driver.find_element_by_id('com.android.packageinstaller:id/permission_allow_button').click()
        except:
            pass
        try:
            driver.find_element_by_id('com.android.packageinstaller:id/permission_allow_button').click()
        except:
            pass
    except:
        # 点击同意用户协议
        driver.swipe(362, 934, 362, 934, 1)
    sleep(1)
    try:
        driver.swipe(500, 2000, 500, 200, 1000)
        # 关闭‘恭喜收到现金红包’
        driver.swipe(88, 305, 88, 305, 1)
    except:
        # 关闭‘恭喜收到现金红包’
        driver.swipe(88, 305, 88, 305, 1)
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