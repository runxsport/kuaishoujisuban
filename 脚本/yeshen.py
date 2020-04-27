# coding: utf-8
from appium import webdriver
from time import sleep

# 登录手机号密码
# phone = '18295995951'
phone = '15221154439'
# phone = '15934466382'

# 密码
password = 'admin123456'
# password = '123321'

# 开端口
# adb -s b5fcaaf8 tcpip 5556
# LKN5T18A27002155
# 连接vivoX20
# adb connect 192.168.2.42:5556
# 断开连接
# adb disconnect 192.168.2.42:5556

# appium需要的参数
desired_caps = {'platformName': 'Android',
                # 'deviceName': '192.168.2.42:5556',
                'deviceName': '127.0.0.1:62003',
                'platformVersion': '5.1.1',
                'appPackage': 'com.kuaishou.nebula',
                'appActivity': 'com.yxcorp.gifshow.HomeActivity',
                'unicodeKeyboard': True,
                'resetKeyboard': True}
driver = webdriver.Remote("http://127.0.0.1:4723/wd/hub", desired_caps)
print('登录的账号：',phone)
sleep(1)

try:
    # 点击登录
    driver.find_element_by_id('com.kuaishou.nebula:id/left_text').click()
    # 点击其他方式登录
    driver.find_element_by_id('com.kuaishou.nebula:id/other_login_view').click()
except:
    pass

# 断言是否登录成功
try:
    # 输入手机号
    driver.find_element_by_id('com.kuaishou.nebula:id/login_name_et').send_keys(phone)
    # 点击下一步
    driver.find_element_by_id('com.kuaishou.nebula:id/next_view').click()
    try:
        # 点击密码登陆
        driver.find_element_by_id('com.kuaishou.nebula:id/forget_psd_btn').click()
    except:
        # 点击密码登陆
        driver.find_element_by_id('com.kuaishou.nebula:id/forget_psd_btn').click()
    # 输入密码
    driver.find_element_by_id('com.kuaishou.nebula:id/login_psd_et').send_keys(password)
    # 点击登录
    driver.find_element_by_id('com.kuaishou.nebula:id/login_view').click()
    sleep(3)
    driver.swipe(132, 303, 132, 303, 1)
except:
    pass
# 循环滑动屏幕
while True:
    try:
        # 滑动屏幕
        driver.swipe(250, 900, 250, 90, 1000)
        sleep(3)
    except:
        pass