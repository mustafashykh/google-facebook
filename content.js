chrome.runtime.onMessage.addListener(async ({ type, query, searchMap }) => {
  if (!searchMap) return

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
    if (!allRestaurants[restaurantsCount]) break
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

  }

  console.log('Restaurants --->>>>', dataAll)

  await chrome.storage?.sync.set({ restaurants: [...dataAll.map] });

})


chrome.runtime.onMessage.addListener(async ({ searchGoogle }) => {
  if (searchGoogle) {
    const { restaurants } = await chrome.storage.sync.get(["restaurants"])
    console.log("RESTAURANTS in storage -- ", restaurants)
    if (!restaurants.length) return

    const allLinks = []
    try {
      for (let dataIndex = 0; dataIndex < restaurants.length; dataIndex++) {
        const element = restaurants[dataIndex]
        let queryHtml = await fetch(`https://www.google.com/search?q=facebook ${element.Name} in ${10001}`)
        queryHtml = await queryHtml.text()

        var parser = new DOMParser()
        var htmlDoc = parser.parseFromString(queryHtml, 'text/html')
        const a = htmlDoc.querySelector('a[href*="www.facebook.com"]')
        const href = `${a.getAttribute('href')}about`
        allLinks.push(href)
        // await chrome.storage?.sync.set({ restaurants: [...restaurants.map((res, index) => ({ ...res, isFacebook: index == dataIndex ? href : false }))] })

      }
    }

    catch (e) { console.log(e) }
    if (allLinks.length) {
      console.log("FacebookLinks -- ", allLinks)
      await chrome.storage?.sync.set({ restaurants: [...restaurants.map((res, ind) => ({ ...res, isFacebook: allLinks[ind] }))] })
      const storage = await chrome.storage?.sync.get(['restaurants'])
      console.log("STORAGE -- ", storage)
    }
  }

})

chrome.runtime.onMessage.addListener(async ({ searchFacebook }) => {
  if (searchFacebook) {

    try {

    }

    catch { }
  }

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