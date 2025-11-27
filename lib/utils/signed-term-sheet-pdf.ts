import { PDFDocument, rgb } from "pdf-lib"

interface TermSheet {
  id: string
  title: string
  documentUrl: string
  documentFileName: string
  applicantSignatureUrl?: string | null
  applicantSignedAt?: string | null
  investorSignatureUrl?: string | null
  investorSignedAt?: string | null
  application: {
    businessName: string
    applicantName: string
  }
}

/**
 * Downloads an image from a URL and returns it as a Uint8Array
 */
async function fetchImageAsBytes(url: string): Promise<Uint8Array> {
  // Use a proxy to avoid CORS issues with Firebase Storage
  const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`
  const response = await fetch(proxyUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return new Uint8Array(arrayBuffer)
}

/**
 * Downloads a PDF from a URL and returns it as a Uint8Array
 */
async function fetchPdfAsBytes(url: string): Promise<Uint8Array> {
  // Use a proxy to avoid CORS issues with Firebase Storage
  const proxyUrl = `/api/proxy-pdf?url=${encodeURIComponent(url)}`
  const response = await fetch(proxyUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.statusText}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return new Uint8Array(arrayBuffer)
}

/**
 * Downloads the term sheet PDF with signatures appended at the bottom
 */
export async function downloadSignedTermSheetPdf(termSheet: TermSheet): Promise<void> {
  try {
    // 1. Fetch the original PDF
    const pdfBytes = await fetchPdfAsBytes(termSheet.documentUrl)
    const pdfDoc = await PDFDocument.load(pdfBytes)

    // 2. Get the last page or add a new signature page
    const pages = pdfDoc.getPages()
    const signaturePage = pages[pages.length - 1]
    const { width, height } = signaturePage.getSize()

    // Check if we need a new page for signatures (if last page doesn't have enough space)
    const signatureAreaHeight = 200
    const marginBottom = 50

    // 3. Add signature section
    let yPosition = marginBottom + signatureAreaHeight

    // Draw a separator line
    signaturePage.drawLine({
      start: { x: 50, y: yPosition + 20 },
      end: { x: width - 50, y: yPosition + 20 },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    })

    // Add "Signatures" header
    signaturePage.drawText("SIGNATURES", {
      x: 50,
      y: yPosition,
      size: 14,
      color: rgb(0.2, 0.2, 0.2),
    })

    yPosition -= 30

    // 4. Add applicant signature if exists
    if (termSheet.applicantSignatureUrl) {
      try {
        const signatureBytes = await fetchImageAsBytes(termSheet.applicantSignatureUrl)

        // Embed the PNG image
        const signatureImage = await pdfDoc.embedPng(signatureBytes)
        const signatureDims = signatureImage.scale(0.5) // Scale down the signature

        // Limit max dimensions
        const maxWidth = 150
        const maxHeight = 60
        const aspectRatio = signatureDims.width / signatureDims.height

        let finalWidth = signatureDims.width
        let finalHeight = signatureDims.height

        if (finalWidth > maxWidth) {
          finalWidth = maxWidth
          finalHeight = maxWidth / aspectRatio
        }
        if (finalHeight > maxHeight) {
          finalHeight = maxHeight
          finalWidth = maxHeight * aspectRatio
        }

        // Draw applicant label
        signaturePage.drawText("Applicant Signature:", {
          x: 50,
          y: yPosition,
          size: 10,
          color: rgb(0.4, 0.4, 0.4),
        })

        yPosition -= 10

        // Draw the signature image
        signaturePage.drawImage(signatureImage, {
          x: 50,
          y: yPosition - finalHeight,
          width: finalWidth,
          height: finalHeight,
        })

        // Draw applicant name and date
        signaturePage.drawText(termSheet.application.applicantName, {
          x: 50,
          y: yPosition - finalHeight - 15,
          size: 10,
          color: rgb(0.2, 0.2, 0.2),
        })

        if (termSheet.applicantSignedAt) {
          const signedDate = new Date(termSheet.applicantSignedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
          signaturePage.drawText(`Signed: ${signedDate}`, {
            x: 50,
            y: yPosition - finalHeight - 30,
            size: 9,
            color: rgb(0.5, 0.5, 0.5),
          })
        }

        yPosition -= finalHeight + 50
      } catch (imgError) {
        console.error("Error embedding applicant signature:", imgError)
        // Continue without the signature image
        signaturePage.drawText("Applicant Signature: [Signature on file]", {
          x: 50,
          y: yPosition - 20,
          size: 10,
          color: rgb(0.4, 0.4, 0.4),
        })
        yPosition -= 40
      }
    }

    // 5. Add investor signature if exists
    if (termSheet.investorSignatureUrl) {
      try {
        const signatureBytes = await fetchImageAsBytes(termSheet.investorSignatureUrl)
        const signatureImage = await pdfDoc.embedPng(signatureBytes)
        const signatureDims = signatureImage.scale(0.5)

        const maxWidth = 150
        const maxHeight = 60
        const aspectRatio = signatureDims.width / signatureDims.height

        let finalWidth = signatureDims.width
        let finalHeight = signatureDims.height

        if (finalWidth > maxWidth) {
          finalWidth = maxWidth
          finalHeight = maxWidth / aspectRatio
        }
        if (finalHeight > maxHeight) {
          finalHeight = maxHeight
          finalWidth = maxHeight * aspectRatio
        }

        // Position investor signature on the right side
        const xPosition = width / 2 + 20

        signaturePage.drawText("Investor Signature:", {
          x: xPosition,
          y: yPosition + finalHeight + 10,
          size: 10,
          color: rgb(0.4, 0.4, 0.4),
        })

        signaturePage.drawImage(signatureImage, {
          x: xPosition,
          y: yPosition,
          width: finalWidth,
          height: finalHeight,
        })

        if (termSheet.investorSignedAt) {
          const signedDate = new Date(termSheet.investorSignedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
          signaturePage.drawText(`Signed: ${signedDate}`, {
            x: xPosition,
            y: yPosition - 15,
            size: 9,
            color: rgb(0.5, 0.5, 0.5),
          })
        }
      } catch (imgError) {
        console.error("Error embedding investor signature:", imgError)
      }
    }

    // 6. Save and download the modified PDF
    const modifiedPdfBytes = await pdfDoc.save()
    const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" })
    const downloadUrl = URL.createObjectURL(blob)

    // Create download link
    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = `signed-${termSheet.documentFileName || "term-sheet.pdf"}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up
    URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error("Error generating signed PDF:", error)
    throw error
  }
}
