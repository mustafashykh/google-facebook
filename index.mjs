
import { chromium } from '@playwright/test';
import json2xls from 'json2xls';
import fs from 'fs';

async function main() {
    const browser = await chromium.launch({
        headless: false // setting this to true will not run the UI
    });
    
    const page = await browser.newPage();
  
    const categoryName = 'restaurants';
    const pinCode = '84006';
    
    await page.goto(`https://www.google.com/maps/search/${categoryName} in ${pinCode}/`, {timeout: 30000});
    // await page.getByRole('textbox', { name: 'Search Google Maps' }).click();
    // await page.locator('#searchboxinput').fill(`${categoryName} in ${pinCode}`);
    // await page.locator('#searchboxinput').press('Enter');
    
    const dataAll = [];
    let restaurantsCount = 0;
    await page.waitForTimeout(6000);
    let allRestaurants = await page.$$('div[role="article"]');
    let hasNewRestaurants = true;
    const limit = 5;
    while (hasNewRestaurants && restaurantsCount < limit && allRestaurants.length>=restaurantsCount) {
        await allRestaurants[restaurantsCount].click();        
        await page.waitForTimeout(5000);
        try{
            const resName = await page.innerText('div[role="main"] .fontHeadlineLarge span');

            const addressExists = await page.$('div[role="main"] button[data-item-id*="address"]');
            let resAddress = null;
            if (addressExists) {
                resAddress = await page.innerText('div[role="main"] button[data-item-id*="address"] .rogA2c .fontBodyMedium');
            }
            
            // Get menu link
            const menuExists = await page.$('div[role="main"] a[data-tooltip*="menu"]');
            let resMenuLink = null;
            if (menuExists) {
                resMenuLink = await page.getAttribute('div[role="main"] a[data-tooltip*="menu"]', 'href')
            }
            
            const websiteExists = await page.$('div[role="main"] a[data-tooltip*="website"]');
            let resWebsite = null;
            if (websiteExists) {
                resWebsite = await page.getAttribute('div[role="main"] a[data-tooltip*="website"]', 'href');
            }

            const phoneExists = await page.$('div[role="main"] button[data-tooltip*="phone"]');
            let resPhone = null;
            if (phoneExists) {
                resPhone = await page.innerText('div[role="main"] button[data-tooltip*="phone"] .rogA2c .fontBodyMedium');
            }
            
            dataAll.push({
                'Name': resName,
                'Address': resAddress,
                'MenuLink': resMenuLink,
                'Website': resWebsite,
                'Phone': resPhone,
            });
        }
        catch { }

        restaurantsCount++;
        if (restaurantsCount > allRestaurants.length - 2) {            
            const posX = 100;
            const posY = 250;
            await page.mouse.move(posX, posY);
            await page.waitForTimeout(1000);
            await page.mouse.wheel(0, 15000);

            await page.waitForTimeout(10000);

            allRestaurants = await page.$$('div[role="article"]');
            
        }
    }

    console.log('Restaurants --->>>>', dataAll);

    try {
        for (let dataIndex = 0; dataIndex < dataAll.length; dataIndex++) {

            
            const element = dataAll[dataIndex];
            await page.goto(`https://www.google.com/search?q=facebook ${element.Name} in ${pinCode}`);

            const firstPageLink = await page.$('#search a[href*="www.facebook.com"]');
            if (firstPageLink) {
                await firstPageLink.click();
                await page.waitForTimeout(3000);
                // Look for about page
                const aboutPage = await page.$('a[href*="/about"]');
                await aboutPage.click();
                await page.waitForTimeout(3000);

                const allSpans = await page.$$('div [role="main"] span[dir="auto"] span');
                const alternativeSolution = await page.$$eval('div [role="main"] span[dir="auto"]', paragraphs => paragraphs.map(p => p.innerText.trim()))
                for (let spanMatchIndex = alternativeSolution.length-1; spanMatchIndex > 0; spanMatchIndex--) {
                    const element = alternativeSolution[spanMatchIndex];
                    //const contentText = await page.innerText('div [role="main"] span[dir="auto"] span');
                    const hasPhoneNumber = /^(\+\d{1,9}\s)?\(?\d{3,4}\)?[\s.-]\d{3}[\s.-]\d{4}$/.exec(element);
                    if(hasPhoneNumber){
                        dataAll[dataIndex].FBPhone = hasPhoneNumber[0];
                        break;
                    }
                    
                }
                
            }
            
        }
    }
    catch { }

    var xls = json2xls(dataAll);

    fs.writeFileSync('FileName.xlsx', xls, 'binary');


    // ---------------------
    await browser.close();
}

main();
