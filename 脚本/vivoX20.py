# coding: utf-8
from appium import webdriver
from time import sleep
import os

# 登录手机号密码
# phone = '18295995951'
# phone = '15221154439'
phone = '15934466382'
# 密码
# password = 'admin123456'
password = '123321'
# 设备名
deviceName = '192.168.2.42:5556'
devicename = 'b5fcaaf8'
# 设备版本
platformVersion = '8.1.0'

# popen返回文件对象，跟open操作一样
with os.popen(r'adb devices', 'r') as f:
    text = f.read()
# print(text) # 打印cmd输出结果
# 输出结果字符串处理
s = text.split("\n")  # 切割换行
result = [x for x in s if x != '']  # 列生成式去掉空
# print(result)
# 可能有多个手机设备
devices = []  # 获取设备名称
for i in result:
    dev = i.split("\tdevice")
    if len(dev) >= 2:
        devices.append(dev[0])
if not devices:
    print('当前设备未连接上')
else:
    print('当前连接设备：',deviceName)
if deviceName in devices:
    print("设备：",deviceName,'已经正常连接，正在打开快手极速版！！！！')
else:
    print('该设备没有连接，正在尝试连接:adb connect',deviceName)
    # popen返回文件对象，跟open操作一样
    with os.popen(r'adb connect 192.168.2.42:5556', 'r') as f:
        try:
            text1 = f.read()
            # print(text) # 打印cmd输出结果
            # 输出结果字符串处理
            s = text1.split("\n")  # 切割换行
            result1 = [x for x in s if x != '']  # 列生成式去掉空
            # print(result)
            # 可能有多个手机设备
            connect = []  # 获取设备名称
            for i in result1:
                if len(i) >= 2:
                    connect.append(i[0])
            if not connect:
                print('当前设备未连接上')
            else:
                print('当前连接设备：', deviceName)
            if 'a' or 'c' in connect:
                print('设备：', deviceName, '已经正常连接，正在打开快手极速版！！！！')
            elif 'u' in connect:
                print('设备：', deviceName, '无法连接，请把手机插到电脑上，输入命令：adb -s ', devicename, 'tcpip 5556')
                exit()
            else:
                pass
        except UnicodeDecodeError:
            print('设备：', deviceName, '无法连接，请把手机插到电脑上，输入命令：adb -s ', devicename, 'tcpip 5556')
            exit()

# 开端口
# adb -s b5fcaaf8 tcpip 5556
# LKN5T18A27002155
# 连接vivoX20
# adb connect 192.168.2.42:5556
# 断开连接
# adb disconnect 192.168.2.42:5556

# appium需要的参数
desired_caps = {'platformName': 'Android',
                'deviceName': deviceName,
                'platformVersion': platformVersion,
                'appPackage': 'com.kuaishou.nebula',
                'appActivity': 'com.yxcorp.gifshow.HomeActivity',
                'unicodeKeyboard': True,
                'resetKeyboard': True}
driver = webdriver.Remote("http://127.0.0.1:4723/wd/hub", desired_caps)
sleep(2)
print('登录的账号：',phone)
# 断言登录和关闭弹框
try:
    # # 滑动一下屏幕
    # driver.swipe(500, 2000, 500, 200, 1000)
    # 点击同意用户协议
    driver.swipe(537, 1472, 537, 1472, 1)
    # 点击登录
    driver.find_element_by_id('com.kuaishou.nebula:id/like_icon').click()
    sleep(5)
    # 关闭‘恭喜收到现金红包’
    driver.swipe(132, 519, 132, 519, 1)
except:
    pass

try:
    # 点击登录
    driver.find_element_by_id('com.kuaishou.nebula:id/like_icon').click()
    # 点击其他方式登录
    driver.find_element_by_id('com.kuaishou.nebula:id/other_login_tv').click()
    # driver.find_element_by_xpath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget'
    #                              '.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget'
    #                              '.RelativeLayout[2]/android.widget.TextView') .click()
except:
    try:
        # 点击其他方式登录
        driver.find_element_by_id('com.kuaishou.nebula:id/other_login_tv').click()
    except:
        # 点击其他方式登录
        driver.find_element_by_id('com.kuaishou.nebula:id/other_login_tv').click()
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