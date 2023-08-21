const link = 'https://video.elumicate.com/?v=tCKevHSoNP7nASB6FUcUeQQkaqA4yK&p=0'
// const link = 'https://video.elumicate.com/?v=tCKevHSoNP7nASB6FUcUeQQkaqA4yK__________&p=0'
// const link = 'https://www.youtube.com/watch?v=Y_TLxje5Qw4'
// const link = 'https://www.youtube.com/watch?v=ZE646Qeqil8' //offline

const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const {Builder, By, Key, until } = require('selenium-webdriver');

const screen = {
  width: 640,
  height: 480
};

async function checkYoutube(link) {
  let driver = await new Builder()
    .forBrowser('firefox')
    .setChromeOptions(new chrome.Options().headless().windowSize(screen))
    .setFirefoxOptions(new firefox.Options().headless().windowSize(screen))
    .build();
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
  let driver = await new Builder()
    .forBrowser('firefox')
    .setChromeOptions(new chrome.Options().headless().windowSize(screen))
    .setFirefoxOptions(new firefox.Options().headless().windowSize(screen))
    .build();
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