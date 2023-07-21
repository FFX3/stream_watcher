import sys, getopt
import cv2
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# TODO turn this into an ENV
chromedriver_path = "./chromedriver/stable/chromedriver"

def test_rtsp_link(url):
    try:
        cap = cv2.VideoCapture(url)
        ret, frame = cap.read()
        cap.release()
    except Exception as e:
        return 'offline'

    if ret:
        return True
    else:
        return False

def test_vdo_ninja_link(url):
    options = Options()
    options.add_argument('--headless')
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-infobars")

    try:
        service = Service(executable_path=chromedriver_path)
        driver = webdriver.Chrome(service=service, options=options)
        driver.set_page_load_timeout(10)
        driver.get(url)
        # Find the Play button and click it
        play_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, "bigPlayButton")))
        play_button.click()

        time.sleep(5)  # Allow some time for the video to load
        video_element = driver.find_element(By.TAG_NAME, "video")
        driver.quit()

        if video_element:
            return True
        else:
            return False
    except Exception as e:
        driver.quit()
        return False

def test_youtube_link(url):
    options = Options()
    options.add_argument('--headless')
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-infobars")

    try:
        service = Service(executable_path=chromedriver_path)
        driver = webdriver.Chrome(service=service, options=options)
        driver.set_page_load_timeout(10)
        driver.get(url)
        video_element = driver.find_element(By.TAG_NAME, "video")
        source = video_element.get_attribute('src')
        driver.quit()

        if source:
            return True
        else:
            return False
    except Exception as e:
        driver.quit()
        return False
    return False

def main(args):
    url = args[0]
    
    if "rtsp://" in url and test_rtsp_link(url):
        print('online')
        return True
    
    if "vdo.ninja" in url and test_vdo_ninja_link(url):
        print('online')
        return True

    if "video.elumicate" in url and test_vdo_ninja_link(url):
        print('online')
        return True

    if "youtube" in url and  test_youtube_link(url):
        print('online')
        return True


    print('offline')
    return False

if __name__ == "__main__":
   main(sys.argv[1:])
