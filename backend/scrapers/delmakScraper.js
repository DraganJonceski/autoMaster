//Delmak scraper

async function scrapeDelmakCategory(listUrl) {
  let url = listUrl;
  const products = [];
  while (url) {
  const { data: html } = await axios.get(listUrl, 
    { headers: { 'User-Agent': 'Mozilla/5.0' }
  });

    const $ = cheerio.load(html);
    //console.log('Total product-card elements:', $('.product-card').length);

    // Each product card
    $('.product-card').each((_, el) => {
      const card = $(el);

      let href = card.find('a').attr('href');
      if (href && !href.startsWith('http')) {
        href = `${BASE_URL}${href.startsWith('/') ? '' : '/'}${href}`;
      }

      const name =
       card.find('h5').text().trim() ||
       card.find('h6').text().trim();

      const partNumber = card.find('.pc___item_number').text().trim() || null;

      const priceText = 
      card.find('span.money.price.price-sale').text().trim() ||
      card.find('span.money.price').first().text().trim();
      
      const price = Number(priceText.replace(/[^\d,\\.]/g, '').replace(',', '.') );

      //console.log('CARD:', { name, price, href: href ? 'yes' : 'no', itemId });

      if (!name || !price || !href) return;

      products.push({
      partName: name,
      partNumber,
      price,
      productUrl: href
    });
  });

     // check for next page link
    const nextLink = $('.pagination .next a').attr('href');
    if (nextLink) {
      url = nextLink.startsWith('http') ? nextLink : `${BASE_URL}${nextLink}`;
    } else {
      url = null;
    }
  }
  
  return products;
}