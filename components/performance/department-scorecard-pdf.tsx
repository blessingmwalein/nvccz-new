import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: "#3b82f6",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748b",
  },
  section: {
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 10,
    borderBottom: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: "#64748b",
    width: "40%",
  },
  value: {
    fontSize: 10,
    color: "#1e293b",
    width: "60%",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#f8fafc",
    padding: 12,
    marginBottom: 10,
    borderRadius: 4,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 3,
  },
  scoreBox: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 4,
    marginBottom: 15,
    alignItems: "center",
  },
  scoreText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
  },
  scoreLabel: {
    fontSize: 12,
    color: "#ffffff",
    marginTop: 5,
  },
  badge: {
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    padding: 5,
    borderRadius: 3,
    fontSize: 9,
    marginTop: 5,
    alignSelf: "flex-start",
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  gridItem: {
    width: "48%",
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: "#f1f5f9",
    fontWeight: "bold",
  },
  tableCell: {
    fontSize: 9,
    color: "#1e293b",
    flex: 1,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    marginTop: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottom: 1,
    borderBottomColor: "#f1f5f9",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#94a3b8",
    borderTop: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
  },
})

interface DepartmentScorecardPDFProps {
  data: any
}

export function DepartmentScorecardPDF({ data }: DepartmentScorecardPDFProps) {
  const getPerformanceBandColor = (band: string) => {
    switch (band) {
      case "Excellent":
        return "#10b981"
      case "Good":
        return "#3b82f6"
      case "Fair":
        return "#f59e0b"
      default:
        return "#ef4444"
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{data.department} Department Scorecard</Text>
          <Text style={styles.subtitle}>
            Performance Report -{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* Overall Score */}
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>{data.scorecard.finalScore.total}</Text>
          <Text style={styles.scoreLabel}>
            {data.scorecard.finalScore.performanceBand}
          </Text>
          <Text
            style={[
              styles.badge,
              {
                backgroundColor:
                  getPerformanceBandColor(data.scorecard.finalScore.performanceBand) +
                  "20",
              },
            ]}
          >
            {data.scorecard.finalScore.rating}
          </Text>
        </View>

        {/* Summary Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Total Goals</Text>
                <Text style={styles.value}>{data.scorecard.summary.totalGoals}</Text>
                <Text style={styles.cardText}>
                  {data.scorecard.summary.completedGoals} completed
                </Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Team Members</Text>
                <Text style={styles.value}>{data.scorecard.summary.totalUsers}</Text>
                <Text style={styles.cardText}>
                  {data.scorecard.summary.managers} managers,{" "}
                  {data.scorecard.summary.officers} officers
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Performance Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Breakdown</Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Outcomes</Text>
              <Text style={styles.value}>
                {data.scorecard.sections.outcomes.totalScore}/
                {data.scorecard.sections.outcomes.maxScore}
              </Text>
            </View>
            <Text style={styles.cardText}>
              {data.scorecard.sections.outcomes.outcomeGoals} goals •{" "}
              {data.scorecard.sections.outcomes.completionRate}% complete
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Outputs</Text>
              <Text style={styles.value}>
                {data.scorecard.sections.outputs.totalScore}/
                {data.scorecard.sections.outputs.maxScore}
              </Text>
            </View>
            <Text style={styles.cardText}>
              {data.scorecard.sections.outputs.outputGoals} goals •{" "}
              {data.scorecard.sections.outputs.completionRate}% complete
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Service Delivery</Text>
              <Text style={styles.value}>
                {data.scorecard.sections.serviceDelivery.totalScore}/
                {data.scorecard.sections.serviceDelivery.maxScore}
              </Text>
            </View>
            <Text style={styles.cardText}>
              {data.scorecard.sections.serviceDelivery.serviceGoals} goals •{" "}
              {data.scorecard.sections.serviceDelivery.userSatisfaction}% satisfaction
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Management</Text>
              <Text style={styles.value}>
                {data.scorecard.sections.management.totalScore}/
                {data.scorecard.sections.management.maxScore}
              </Text>
            </View>
            <Text style={styles.cardText}>
              Financial:{" "}
              {
                data.scorecard.sections.management.financialManagement
                  .score
              }
              /
              {
                data.scorecard.sections.management.financialManagement
                  .maxScore
              }
            </Text>
            <Text style={styles.cardText}>
              Capacity:{" "}
              {
                data.scorecard.sections.management.organizationalCapacity
                  .score
              }
              /
              {
                data.scorecard.sections.management.organizationalCapacity
                  .maxScore
              }
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Cross-Cutting</Text>
              <Text style={styles.value}>
                {data.scorecard.sections.crossCutting.totalScore}/
                {data.scorecard.sections.crossCutting.maxScore}
              </Text>
            </View>
            <Text style={styles.cardText}>
              {data.scorecard.sections.crossCutting.priorities.join(", ")}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated on {new Date().toLocaleString()}</Text>
        </View>
      </Page>

      {/* Goals Page */}
      {data.goals.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Department Goals</Text>
            <Text style={styles.subtitle}>{data.goals.length} Active Goals</Text>
          </View>

          <View style={styles.section}>
            {data.goals.map((goal: any, index: number) => (
              <View key={goal.id} style={styles.card}>
                <Text style={styles.cardTitle}>{goal.title}</Text>
                <View style={styles.row}>
                  <Text style={styles.label}>Progress:</Text>
                  <Text style={styles.value}>{goal.progressPercentage}%</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Current/Target:</Text>
                  <Text style={styles.value}>
                    {goal.kpi.unitPosition === "prefix"
                      ? goal.kpi.unitSymbol
                      : ""}
                    {parseFloat(goal.currentValue).toLocaleString()}
                    {goal.kpi.unitPosition === "suffix"
                      ? goal.kpi.unitSymbol
                      : ""}{" "}
                    /{" "}
                    {goal.kpi.unitPosition === "prefix"
                      ? goal.kpi.unitSymbol
                      : ""}
                    {parseFloat(goal.targetValue).toLocaleString()}
                    {goal.kpi.unitPosition === "suffix"
                      ? goal.kpi.unitSymbol
                      : ""}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Stage:</Text>
                  <Text style={styles.value}>{goal.stage.replace("_", " ")}</Text>
                </View>
                {goal.individualGoals && goal.individualGoals.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <Text
                      style={[styles.cardText, { fontWeight: "bold" }]}
                    >
                      Individual Contributors ({goal.individualGoals.length})
                    </Text>
                    {goal.individualGoals.map((indGoal: any) => (
                      <View key={indGoal.id} style={{ marginTop: 4 }}>
                        <Text style={styles.cardText}>
                          • {indGoal.assignedTo.firstName}{" "}
                          {indGoal.assignedTo.lastName} -{" "}
                          {indGoal.progressPercentage}%
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <Text>Page 2 - Department Goals</Text>
          </View>
        </Page>
      )}

      {/* Team Members Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Team Members</Text>
          <Text style={styles.subtitle}>{data.users.length} Members</Text>
        </View>

        <View style={styles.section}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { flex: 2 }]}>Name</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Email</Text>
            <Text style={styles.tableCell}>Role</Text>
          </View>
          {data.users.map((user: any) => (
            <View key={user.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{user.name}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{user.email}</Text>
              <Text style={styles.tableCell}>{user.role}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>Page 3 - Team Members</Text>
        </View>
      </Page>
    </Document>
  )
}
