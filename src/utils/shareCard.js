function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let line = ''

  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

export async function generateShareImage(result) {
  const width = 1080
  const height = 1920
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  const gradient = ctx.createLinearGradient(0, 0, width, 200)
  gradient.addColorStop(0, '#eef5fc')
  gradient.addColorStop(1, '#ffffff')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, 280)

  ctx.fillStyle = '#4A90D9'
  ctx.font = '600 36px Syne, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('FaceType', width / 2, 120)

  ctx.font = '120px serif'
  ctx.fillText(result.emoji, width / 2, 420)

  ctx.fillStyle = '#1a1a2e'
  ctx.font = '800 72px Syne, sans-serif'
  ctx.fillText(result.style, width / 2, 560)

  ctx.fillStyle = '#6b7280'
  ctx.font = '400 40px Syne, sans-serif'
  const descLines = wrapText(ctx, result.description, width - 160)
  let y = 680
  for (const line of descLines.slice(0, 5)) {
    ctx.fillText(line, width / 2, y)
    y += 52
  }

  ctx.fillStyle = '#FF6B6B'
  ctx.font = 'italic 36px Syne, sans-serif'
  const roastLines = wrapText(ctx, result.roast, width - 160)
  y += 40
  for (const line of roastLines.slice(0, 3)) {
    ctx.fillText(line, width / 2, y)
    y += 48
  }

  ctx.fillStyle = '#9ca3af'
  ctx.font = '400 32px Syne, sans-serif'
  ctx.fillText('facetype.app', width / 2, height - 80)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}

export async function shareResult(result) {
  const blob = await generateShareImage(result)
  const file = new File([blob], 'facetype-result.png', { type: 'image/png' })

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'My FaceType Result',
        text: `I'm ${result.style}! ${result.emoji}`,
      })
      return
    } catch (err) {
      if (err.name === 'AbortError') return
    }
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'facetype-result.png'
  a.click()
  URL.revokeObjectURL(url)
}
