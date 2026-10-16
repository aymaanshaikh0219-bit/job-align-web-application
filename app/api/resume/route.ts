import mammoth from 'mammoth'
import { extractText, getDocumentProxy } from 'unpdf'
import { parseResume } from '@/lib/resume-parser'

const MAX_BYTES = 5 * 1024 * 1024

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)
  const file = form?.get('file')

  if (!(file instanceof File)) {
    return Response.json({ error: 'Please choose a resume file.' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: 'File is larger than 5 MB.' }, { status: 413 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase()
  const buffer = await file.arrayBuffer()

  try {
    let text = ''
    if (ext === 'pdf') {
      const pdf = await getDocumentProxy(new Uint8Array(buffer))
      const result = await extractText(pdf, { mergePages: false })
      text = result.text.join('\n')
    } else if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) })
      text = result.value
    } else if (ext === 'txt' || ext === 'md') {
      text = new TextDecoder().decode(buffer)
    } else if (ext === 'doc') {
      return Response.json(
        { error: 'Legacy .doc files are not supported. Save it as PDF or DOCX and try again.' },
        { status: 415 },
      )
    } else {
      return Response.json({ error: 'Please upload a PDF, DOCX, or TXT file.' }, { status: 415 })
    }

    text = text.slice(0, 50_000)
    if (!text.trim()) {
      return Response.json(
        { error: 'No text found. Scanned/image PDFs are not supported — try pasting the text instead.' },
        { status: 422 },
      )
    }

    return Response.json({ text, parsed: parseResume(text) })
  } catch (error) {
    console.error('[resume] Failed to read file:', error)
    return Response.json({ error: "Couldn't read that file. Try pasting the text instead." }, { status: 500 })
  }
}
