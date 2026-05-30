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

export async function generateProShareImage(result, toxicPattern) {
  const width = 1080
  const height = 1920
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  const gradient = ctx.createLinearGradient(0, 0, width, 320)
  gradient.addColorStop(0, '#eef5fc')
  gradient.addColorStop(1, '#ffffff')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, 360)

  ctx.fillStyle = '#4A90D9'
  ctx.font = '900 36px Nunito, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('FaceType', width / 2, 120)

  ctx.font = '120px serif'
  ctx.fillText(result.emoji, width / 2, 400)

  ctx.fillStyle = '#1a1a2e'
  ctx.font = '900 64px Nunito, sans-serif'
  ctx.fillText(result.style, width / 2, 520)

  const teaser = toxicPattern?.pattern
    ? `Toxic pattern: ${toxicPattern.pattern}`
    : result.roast
  ctx.fillStyle = '#FF6B6B'
  ctx.font = 'italic 400 34px Inter, sans-serif'
  const lines = wrapText(ctx, teaser, width - 160)
  let y = 620
  for (const line of lines.slice(0, 3)) {
    ctx.fillText(line, width / 2, y)
    y += 48
  }

  ctx.fillStyle = '#9ca3af'
  ctx.font = '400 32px Inter, sans-serif'
  ctx.fillText('facetype.app', width / 2, height - 80)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}

export async function shareProResult(result, toxicPattern) {
  const blob = await generateProShareImage(result, toxicPattern)
  const file = new File([blob], 'facetype-pro-result.png', { type: 'image/png' })

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
  a.download = 'facetype-pro-result.png'
  a.click()
  URL.revokeObjectURL(url)
}
