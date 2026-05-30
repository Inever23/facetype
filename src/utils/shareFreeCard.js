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

export async function generateFreeShareImage(result) {
  const width = 1080
  const height = 1920
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, width, height)

  ctx.textAlign = 'center'

  ctx.font = '120px serif'
  ctx.fillText(result.emoji, width / 2, 520)

  ctx.fillStyle = '#ffffff'
  ctx.font = '900 72px Nunito, sans-serif'
  const styleLines = wrapText(ctx, result.style, width - 120)
  let y = 680
  for (const line of styleLines.slice(0, 3)) {
    ctx.fillText(line, width / 2, y)
    y += 82
  }

  ctx.fillStyle = '#9ca3af'
  ctx.font = '400 36px Inter, sans-serif'
  const teaser = 'Find out your dating style at facetype.app'
  const teaserLines = wrapText(ctx, teaser, width - 160)
  y += 60
  for (const line of teaserLines) {
    ctx.fillText(line, width / 2, y)
    y += 48
  }

  ctx.fillStyle = '#6b7280'
  ctx.font = '600 32px Nunito, sans-serif'
  ctx.fillText('FaceType', width / 2, height - 100)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}

export async function shareFreeResult(result) {
  const blob = await generateFreeShareImage(result)
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
