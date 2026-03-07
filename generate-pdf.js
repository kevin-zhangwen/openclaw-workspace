const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('🚀 启动浏览器...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // 设置视口为 A4 横向比例
    await page.setViewport({ width: 1920, height: 1080 });
    
    const htmlPath = path.join(__dirname, 'openclaw-intro.html');
    const fileUrl = 'file://' + htmlPath;
    
    console.log('📄 加载 HTML 文件:', fileUrl);
    await page.goto(fileUrl, { 
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    console.log('📝 生成 PDF...');
    
    const pdfPath = path.join(__dirname, 'openclaw-intro.pdf');
    
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      orientation: 'landscape',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      },
      pageRanges: '1-14',
      preferCSSPageSize: false
    });

    const stats = fs.statSync(pdfPath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    
    console.log('✅ PDF 生成成功!');
    console.log(`📁 文件路径：${pdfPath}`);
    console.log(`📊 文件大小：${sizeMB} MB`);
    console.log(`📄 页数：14 页`);

  } catch (error) {
    console.error('❌ 生成失败:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
