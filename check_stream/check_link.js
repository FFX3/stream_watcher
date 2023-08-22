const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const {Builder, By, Key, until } = require('selenium-webdriver');

const screen = {
  width: 640,
  height: 480
};

async function buildBrowser(){
  return await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().headless().windowSize(screen).addArguments('--no-sandbox').addArguments('--disable-dev-shm-usage'))
    .setFirefoxOptions(new firefox.Options().headless().windowSize(screen))
    .build();
}

async function checkYoutube(link) {
  let driver = await buildBrowser()
  try {
    await driver.get(link);
    const videoElement = await driver.findElement(By.css('video'))
    const src = await videoElement.getAttribute('src')
    console.log(src)
    if(src){
        return true
    } else {
        return false
    }
  } finally {
    await driver.quit();
  }
};

async function checkWebRTC(link) {
    console.log(`webrtc: ${link}`)
  let driver = await buildBrowser()
  try {
    await driver.get(link);

    try {
        const videoElement = await driver.wait(until.elementLocated(By.css('video')), 10000);
        return true
    } catch {
        return false
    }
  } finally {
    await driver.quit();
  }
};

module.exports = { checkYoutube, checkWebRTC }
