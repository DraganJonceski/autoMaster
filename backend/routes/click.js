router.post('/track-click', async (req, res) => {
  const { productId, supplier } = req.body;
  
  const click = new Click({
    productId,
    supplier,
    timestamp: new Date(),
    userIp: req.ip,
    referrer: req.referrer
  });
  
  await click.save();
  
  // Redirect to affiliate URL
  const product = await Product.findById(productId);
  res.redirect(product.affiliateUrl);
});
