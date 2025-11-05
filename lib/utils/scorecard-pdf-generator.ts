import jsPDF from "jspdf"
import "jspdf-autotable"

// Extend jsPDF with the autoTable plugin
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDFWithAutoTable
}

const generateScorecardPDF = (scorecardData: any, filename: string) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  }) as jsPDFWithAutoTable

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  const contentWidth = pageWidth - margin * 2
  let yPos = 20

  // Title
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.text("Performance Scorecard", pageWidth / 2, yPos, { align: "center" })
  yPos += 15

  // User Info
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text(scorecardData.user.name, margin, yPos)
  yPos += 6
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(
    `${scorecardData.user.department || "No Department"} • ${scorecardData.user.role || "No Role"}`,
    margin,
    yPos,
  )
  yPos += 10

  // Summary Cards
  const summary = scorecardData.scorecard.summary
  const finalScore = scorecardData.scorecard.finalScore
  const summaryData = [
    ["Total Goals", summary.totalGoals, "Completed Goals", summary.completedGoals],
    ["Total Tasks", summary.totalTasks, "Completed Tasks", summary.completedTasks],
    ["Final Score", `${finalScore.total} (${finalScore.rating})`, "Performance Band", finalScore.performanceBand],
  ]

  doc.autoTable({
    startY: yPos,
    body: summaryData,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 2,
    },
    columnStyles: {
      0: { fontStyle: "bold" },
      2: { fontStyle: "bold" },
    },
  })
  yPos = doc.autoTable.previous.finalY + 10

  // Performance Breakdown
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Performance Breakdown", margin, yPos)
  yPos += 6

  const sections = scorecardData.scorecard.sections
  const breakdownData = []
  if (sections.resultsDelivery) {
    breakdownData.push([
      "Results Delivery",
      `${sections.resultsDelivery.completionRate}% completion`,
      `${sections.resultsDelivery.totalScore} / ${sections.resultsDelivery.maxScore}`,
    ])
  }
  if (sections.budgetPerformance) {
    breakdownData.push([
      "Budget Performance",
      `${sections.budgetPerformance.budgetUtilization}% utilization`,
      `${sections.budgetPerformance.totalScore} / ${sections.budgetPerformance.maxScore}`,
    ])
  }

  if (breakdownData.length > 0) {
    doc.autoTable({
      startY: yPos,
      head: [["Section", "Metric", "Score"]],
      body: breakdownData,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] },
    })
    yPos = doc.autoTable.previous.finalY + 10
  }

  // Goals
  if (scorecardData.goals && scorecardData.goals.length > 0) {
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Active Goals", margin, yPos)
    yPos += 6

    const goalData = scorecardData.goals.map((goal: any) => [
      goal.title,
      goal.stage.replace("_", " "),
      `${goal.progressPercentage}%`,
    ])

    doc.autoTable({
      startY: yPos,
      head: [["Title", "Stage", "Progress"]],
      body: goalData,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] },
    })
    yPos = doc.autoTable.previous.finalY + 10
  }

  // Tasks
  if (scorecardData.tasks && scorecardData.tasks.length > 0) {
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Tasks", margin, yPos)
    yPos += 6

    const taskData = scorecardData.tasks.map((task: any) => [
      task.title,
      task.stage.replace("_", " "),
      task.priority,
      new Date(task.date).toLocaleDateString(),
    ])

    doc.autoTable({
      startY: yPos,
      head: [["Title", "Stage", "Priority", "Due Date"]],
      body: taskData,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] },
    })
    yPos = doc.autoTable.previous.finalY + 10
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" },
    )
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      margin,
      doc.internal.pageSize.getHeight() - 10,
    )
  }

  doc.save(filename)
}

export default generateScorecardPDF
