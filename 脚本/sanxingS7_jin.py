# coding: utf-8
from appium import webdriver
from time import sleep
import os

# 登录手机号密码
phone = ''
# 密码
password = ''
# 设备名
deviceName = '192.168.2.186:5558'
devicename = '8dc2175c'
# 设备版本
platformVersion = '8.0.0'

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
    with os.popen(r'adb connect 192.168.2.186:5558', 'r') as f:
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
                print('设备：', deviceName, '无法连接，请把手机插到电脑上，输入命令：adb -s ', devicename, 'tcpip 5558')
                exit()
            else:
                pass
        except UnicodeDecodeError:
            print('设备：', deviceName, '无法连接，请把手机插到电脑上，输入命令：adb -s ', devicename, 'tcpip 5558')
            exit()

# 开端口
# adb -s 8dc2175c tcpip 5558
# 连接三星s8
# adb connect 10.211.21.126:5558
# 断开连接
# adb disconnect connect 10.211.21.126:5558

# appium需要的参数
desired_caps = {'platformName': 'Android',
                'deviceName': deviceName,
                # 'deviceName': '8dc2175c',
                'platformVersion': platformVersion,
                'appPackage': 'com.kuaishou.nebula',
                'appActivity': 'com.yxcorp.gifshow.HomeActivity',
                'unicodeKeyboard': True,
                'resetKeyboard': True}
driver = webdriver.Remote("http://127.0.0.1:4723/wd/hub", desired_caps)
sleep(3)
try:
    driver.swipe(537, 1472, 537, 1472, 1)
    # 点击同意用户协议
    driver.swipe(542, 1414, 542, 1414, 1)
    sleep(3)
    try:
        # 点击系统权限弹框
        driver.find_element_by_id('com.android.packageinstaller:id/permission_allow_button').click()
        try:
            # 点击系统权限弹框
            driver.find_element_by_id('com.android.packageinstaller:id/permission_allow_button').click()
            try:
                # 点击系统权限弹框
                driver.find_element_by_id('com.android.packageinstaller:id/permission_allow_button').click()
            except:
                pass
        except:
            pass
    except:
        pass
    sleep(1)
    try:
        # 点击一下屏幕
        driver.swipe(500, 2000, 500, 200, 1000)
        # 关闭‘恭喜收到现金红包’
        driver.swipe(130, 395, 130, 395, 1)
    except:
        # 关闭‘恭喜收到现金红包’
        driver.swipe(130, 395, 130, 395, 1)
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
sleep(2)
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
        driver.swipe(500, 1600, 500, 200, 1000)
        sleep(5)
    except:
        pass