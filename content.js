chrome.runtime.onMessage.addListener(async ({ type, query, url }) => {

  // await page.goto(`https://www.google.com/maps/search/${categoryName} in ${pinCode}/`, { timeout: 30000 })
  // window.location.replace(`https://www.google.com/maps/search/${type}%20${query.replaceAll(' ', '%20')}/`)
  const searchInput = document.getElementById('searchboxinput')
  searchInput.value = `${type} ${query}`
  searchInput.dispatchEvent(ev)

  const dataAll = []
  let restaurantsCount = 0
  await delay(12000)
  let allRestaurants = document.querySelectorAll('div[role="article"]')


  let hasNewRestaurants = true
  const limit = 5
  while (hasNewRestaurants && restaurantsCount < limit && allRestaurants.length >= restaurantsCount) {
    allRestaurants[restaurantsCount].querySelector('a').click()
    await delay(5000)
    try {
      const resName = document.querySelector('div[role="main"] .fontHeadlineLarge span').innerText

      const addressExists = document.querySelector('div[role="main"] button[data-item-id*="address"]')
      let resAddress = null
      if (addressExists) {
        resAddress = document.querySelector('div[role="main"] button[data-item-id*="address"] .rogA2c .fontBodyMedium').innerText
      }

      // Get menu link
      const menuExists = document.querySelector('div[role="main"] a[data-tooltip*="menu"]')
      let resMenuLink = null
      if (menuExists) {
        resMenuLink = menuExists.getAttribute('href')
      }

      const websiteExists = document.querySelector('div[role="main"] a[data-tooltip*="website"]')
      let resWebsite = null
      if (websiteExists) {
        resWebsite = websiteExists.getAttribute('href')
      }

      const phoneExists = document.querySelector('div[role="main"] button[data-tooltip*="phone"]')
      let resPhone = null
      if (phoneExists) {
        resPhone = phoneExists.querySelector('.rogA2c .fontBodyMedium').innerText
      }

      dataAll.push({
        'Name': resName,
        'Address': resAddress,
        'MenuLink': resMenuLink,
        'Website': resWebsite,
        'Phone': resPhone,
      })
    }
    catch (e) { console.log(e) }

    restaurantsCount++
    // if (restaurantsCount > allRestaurants.length - 2) {
    //   const posX = 100
    //   const posY = 250
    //   await page.mouse.move(posX, posY)
    //   await delay(1000)
    //   await page.mouse.wheel(0, 15000)



    //   await delay(10000)

    //   allRestaurants = ('div[role="article"]')


    // }
    try {
      // if (restaurantsCount > limit) {
      //   document.querySelector(`div[role="feed"]`).scrollBy(0, 2000)
      //   await delay(5000)

      //   allRestaurants = document.querySelectorAll('div[role="article"]')
      // }
    }
    catch (e) {
      console.log(e)
    }


  }

  console.log('Restaurants --->>>>', dataAll)

  try {
    // for (let dataIndex = 0; dataIndex < dataAll.length; dataIndex++) {


    //   const element = dataAll[dataIndex]
    //   await page.goto(`https://www.google.com/search?q=facebook ${element.Name} in ${pinCode}`)

    //   const firstPageLink = await page.$('#search a[href*="www.facebook.com"]')
    //   if (firstPageLink) {
    //     await firstPageLink.click()
    //     await delay(3000)
    //     // Look for about page
    //     const aboutPage = await page.$('a[href*="/about"]')
    //     await aboutPage.click()
    //     await delay(3000)

    //     const allSpans = await page.$$('div [role="main"] span[dir="auto"] span')
    //     const alternativeSolution = await page.$$eval('div [role="main"] span[dir="auto"]', paragraphs => paragraphs.map(p => p.innerText.trim()))
    //     for (let spanMatchIndex = alternativeSolution.length - 1; spanMatchIndex > 0; spanMatchIndex--) {
    //       const element = alternativeSolution[spanMatchIndex]
    //       //const contentText = await page.innerText('div [role="main"] span[dir="auto"] span');
    //       const hasPhoneNumber = /^(\+\d{1,9}\s)?\(?\d{3,4}\)?[\s.-]\d{3}[\s.-]\d{4}$/.exec(element)
    //       if (hasPhoneNumber) {
    //         dataAll[dataIndex].FBPhone = hasPhoneNumber[0]
    //         break
    //       }

    //     }

    //   }

    // }
  }
  catch { }

  // var xls = json2xls(dataAll)

  // fs.writeFileSync('FileName.xlsx', xls, 'binary')

})


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

var ev = new KeyboardEvent('keydown', {
  altKey: false,
  bubbles: true,
  cancelBubble: false,
  cancelable: true,
  charCode: 0,
  code: "Enter",
  composed: true,
  ctrlKey: false,
  currentTarget: null,
  defaultPrevented: true,
  detail: 0,
  eventPhase: 0,
  isComposing: false,
  isTrusted: true,
  key: "Enter",
  keyCode: 13,
  location: 0,
  metaKey: false,
  repeat: false,
  returnValue: false,
  shiftKey: false,
  type: "keydown",
  which: 13
})