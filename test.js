import { readFileSync, existsSync } from 'node:fs'
import { createServer } from 'node:http'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distPath = resolve(__dirname, 'dist')

let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    passed++
    console.log(`  ✓ ${name}`)
  } catch (e) {
    failed++
    console.log(`  ✗ ${name}`)
    console.log(`    ${e.message}`)
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Assertion failed')
}

// ---- Static file checks ----
console.log('\n📁 File statici')

test('dist/index.html esiste', () => {
  assert(existsSync(resolve(distPath, 'index.html')))
})

test('dist/robots.txt esiste', () => {
  assert(existsSync(resolve(distPath, 'robots.txt')))
})

test('dist/sitemap.xml esiste', () => {
  assert(existsSync(resolve(distPath, 'sitemap.xml')))
})

test('dist/assets/ contiene JS e CSS', () => {
  const html = readFileSync(resolve(distPath, 'index.html'), 'utf-8')
  assert(html.includes('./assets/'), 'index.html deve referenziare ./assets/')
})

// ---- HTML structure ----
console.log('\n📄 Struttura HTML')

const html = readFileSync(resolve(distPath, 'index.html'), 'utf-8')

test('DOCTYPE html', () => assert(html.includes('<!DOCTYPE html>')))
test('lang="it"', () => assert(html.includes('lang="it"')))
test('meta viewport', () => assert(html.includes('name="viewport"')))
test('title non vuoto', () => assert(html.includes('<title>MarkNote')))
test('meta description', () => assert(html.includes('name="description"')))
test('canonical URL', () => assert(html.includes('https://cristianporco.it/app/marknote/')))
test('og:title', () => assert(html.includes('og:title')))
test('og:description', () => assert(html.includes('og:description')))
test('og:url corretto', () => assert(html.includes('https://cristianporco.it/app/marknote/')))
test('JSON-LD Schema.org', () => assert(html.includes('application/ld+json')))
test('nessun path assoluto negli asset', () => {
  assert(!html.includes('src="/'), 'src non deve iniziare con /')
  assert(!html.includes('href="/assets'), 'href assets non deve iniziare con /')
})

// ---- robots.txt ----
console.log('\n🤖 robots.txt')

const robots = readFileSync(resolve(distPath, 'robots.txt'), 'utf-8')
test('robots.txt permette User-agent: *', () => assert(robots.includes('User-agent: *')))
test('robots.txt ha Allow: /', () => assert(robots.includes('Allow: /')))
test('robots.txt ha Sitemap', () => assert(robots.includes('Sitemap:')))

// ---- sitemap.xml ----
console.log('\n🗺️  sitemap.xml')

const sitemap = readFileSync(resolve(distPath, 'sitemap.xml'), 'utf-8')
test('sitemap.xml ha urlset', () => assert(sitemap.includes('<urlset')))
test('sitemap.xml ha il <loc> corretto', () => assert(sitemap.includes('cristianporco.it/app/marknote/')))

// ---- Server test ----
console.log('\n🌐 Server HTTP')

const server = createServer((req, res) => {
  let filePath
  if (req.url === '/' || req.url === '/index.html') {
    filePath = resolve(distPath, 'index.html')
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  } else if (req.url.startsWith('/assets/')) {
    filePath = resolve(distPath, req.url.slice(1))
    if (req.url.endsWith('.js')) res.writeHead(200, { 'Content-Type': 'application/javascript' })
    else if (req.url.endsWith('.css')) res.writeHead(200, { 'Content-Type': 'text/css' })
    else res.writeHead(200)
  } else if (req.url === '/robots.txt') {
    filePath = resolve(distPath, 'robots.txt')
    res.writeHead(200, { 'Content-Type': 'text/plain' })
  } else if (req.url === '/sitemap.xml') {
    filePath = resolve(distPath, 'sitemap.xml')
    res.writeHead(200, { 'Content-Type': 'application/xml' })
  } else {
    res.writeHead(404)
    res.end('Not found')
    return
  }
  try {
    const content = readFileSync(filePath)
    res.end(content)
  } catch {
    res.writeHead(404)
    res.end('Not found')
  }
})

await new Promise((resolve, reject) => {
  server.listen(0, '127.0.0.1', () => resolve())
})

const port = server.address().port
const baseUrl = `http://127.0.0.1:${port}`

try {
  // Fetch index.html
  const indexRes = await fetch(baseUrl)
  test('GET / restituisce 200', () => assert(indexRes.status === 200))
  const indexBody = await indexRes.text()
  test('GET / contiene div#app', () => assert(indexBody.includes('id="app"')))
  test('GET / contiene script module', () => assert(indexBody.includes('script type="module"')))

  // Fetch robots.txt
  const robotsRes = await fetch(`${baseUrl}/robots.txt`)
  test('GET /robots.txt restituisce 200', () => assert(robotsRes.status === 200))

  // Fetch sitemap.xml
  const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`)
  test('GET /sitemap.xml restituisce 200', () => assert(sitemapRes.status === 200))

  // Fetch JS asset
  const jsMatch = indexBody.match(/src="(\.\/assets\/[^"]+)"/)
  if (jsMatch) {
    const assetUrl = jsMatch[1].replace('./', '')
    const jsRes = await fetch(`${baseUrl}/${assetUrl}`)
    test('JS asset caricabile', () => assert(jsRes.status === 200))
    const jsBody = await jsRes.text()
    test('JS contiene Vue runtime', () => assert(jsBody.includes('createApp') || jsBody.includes('vue')))
    test('JS contiene marked', () => assert(jsBody.includes('marked')))
  }

  // Fetch CSS asset
  const cssMatch = indexBody.match(/href="(\.\/assets\/[^"]+\.css)"/)
  if (cssMatch) {
    const cssUrl = cssMatch[1].replace('./', '')
    const cssRes = await fetch(`${baseUrl}/${cssUrl}`)
    test('CSS asset caricabile', () => assert(cssRes.status === 200))
  }

} finally {
  server.close()
}

// ---- Results ----
console.log(`\n${'='.repeat(40)}`)
console.log(`  Passed: ${passed}  |  Failed: ${failed}`)
console.log(`${'='.repeat(40)}\n`)

process.exit(failed > 0 ? 1 : 0)
