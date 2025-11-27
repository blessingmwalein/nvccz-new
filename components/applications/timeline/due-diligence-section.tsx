"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Calendar, User, DollarSign, FileText, CheckSquare, Eye, Clock, Play, UserPlus, ChevronDown, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { DueDiligenceSkeleton } from "@/components/ui/skeleton-loader"
import type { DueDiligenceData, DueDiligenceTask } from "@/lib/api/due-diligence-api"

interface DueDiligenceSectionProps {
  data: DueDiligenceData | null
  loading: boolean
  error: string | null
  currentStage: string
  activityApprovalData?: any
  onRefresh: () => void
  onInitiate?: () => void
  onCreateTask?: (category: string) => void
}

export function DueDiligenceSection({
  data,
  loading,
  error,
  currentStage,
  activityApprovalData,
  onRefresh,
  onInitiate,
  onCreateTask
}: DueDiligenceSectionProps) {
  if (loading) {
    return <DueDiligenceSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Clock className="w-8 h-8 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 mb-2">Failed to load due diligence data</p>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <Button onClick={onRefresh} variant="outline" size="sm" className="rounded-full">
          <Clock className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 mb-2">No due diligence data available</p>
        <p className="text-sm text-gray-400 mb-4">
          Due diligence has not been initiated for this application yet.
        </p>
        <div className="flex gap-2 justify-center">
          {currentStage === "SHORTLISTED" && onInitiate && (
            <Button
              onClick={onInitiate}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full"
            >
              <Play className="w-4 h-4 mr-2" />
              Initiate Due Diligence
            </Button>
          )}
          <Button onClick={onRefresh} variant="outline" size="sm" className="rounded-full">
            <Clock className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Due diligence areas for tabs
  const areas = [
    { key: 'market', label: 'Market Research', category: 'Market Research' },
    { key: 'financial', label: 'Financial Assessment', category: 'Financial Assessment' },
    { key: 'competitive', label: 'Competitive Analysis', category: 'Competitive Analysis' },
    { key: 'management', label: 'Management Team Evaluation', category: 'Management Team Evaluation' },
    { key: 'legal', label: 'Legal Compliance', category: 'Legal Compliance' },
    { key: 'risk', label: 'Risk Assessment', category: 'Risk Assessment' },
  ];
  const [activeArea, setActiveArea] = useState(areas[0].key);

  // Group tasks by category
  const tasksByCategory = data?.tasks?.reduce((acc: Record<string, DueDiligenceTask[]>, task: DueDiligenceTask) => {
    const category = task.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {}) || {};

  const getTasksForArea = (areaCategory: string) => {
    return tasksByCategory[areaCategory] || [];
  };

  return (
    <div className="space-y-4">
      {/* Due Diligence Overview */}
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-normal flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
              <Eye className="w-4 h-4 text-amber-500" />
            </div>
            Due Diligence Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <Badge className={`mt-1 ${
                data.status === 'COMPLETED' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {data.status}
              </Badge>
            </div>
            <div>
              <label className="text-sm text-gray-500">Overall Score</label>
              <p className="text-sm font-medium">{data.overallScore || 'Not scored'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Recommendation</label>
              <Badge className={`mt-1 ${
                data.recommendation === 'APPROVE' 
                  ? 'bg-green-100 text-green-800'
                  : data.recommendation === 'REJECT'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {data.recommendation || 'Pending'}
              </Badge>
            </div>
            <div>
              <label className="text-sm text-gray-500">Reviewer</label>
              <p className="text-sm font-medium">
                {data.reviewer ? 
                  `${data.reviewer.firstName} ${data.reviewer.lastName}` : 
                  'Not assigned'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Due Diligence Area Tabs */}
      <div className="flex gap-1 mb-2">
        {areas.map(area => (
          <Button
            key={area.key}
            variant={activeArea === area.key ? 'default' : 'outline'}
            className={`rounded-full px-2 py-0.5 text-xs ${activeArea === area.key ? 'bg-blue-600 text-white' : ''}`}
            onClick={() => setActiveArea(area.key)}
          >
            {area.label}
          </Button>
        ))}
      </div>

      {/* Assessment Details - show only selected area */}
      {activeArea === 'market' && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-normal flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-500" />
                </div>
                Market Research
              </CardTitle>
              {onCreateTask && (
                <Button
                  onClick={() => onCreateTask('Market Research')}
                  size="sm"
                  className="rounded-full bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Market Research Assessment</h4>
                <Badge className={data.marketResearchViable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {data.marketResearchViable ? 'Viable' : 'Not Viable'}
                </Badge>
              </div>
              {data.marketResearchComments && (
                <p className="text-sm text-gray-600">{data.marketResearchComments}</p>
              )}
            </div>

            {/* Tasks for this area */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Tasks ({getTasksForArea('Market Research').length})</h4>
              {getTasksForArea('Market Research').length > 0 ? (
                getTasksForArea('Market Research').map((task) => (
                  <div key={task.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{task.title}</h5>
                        {task.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-xs ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </Badge>
                          <Badge className={`text-xs ${
                            task.stage === 'completed' ? 'bg-green-100 text-green-800' :
                            task.stage === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.stage.replace('_', ' ')}
                          </Badge>
                          {task.isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {task.team?.slice(0, 2).map((member: any, index: number) => (
                          <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                              {member.firstName[0]}{member.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {task.team && task.team.length > 2 && (
                          <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{task.team.length - 2}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>Due: {format(new Date(task.date), 'MMM dd, yyyy')}</span>
                      <span>Created by: {task.creator.firstName} {task.creator.lastName}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No tasks assigned to this area yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      {activeArea === 'financial' && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-normal flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-500" />
                </div>
                Financial Assessment
              </CardTitle>
              {onCreateTask && (
                <Button
                  onClick={() => onCreateTask('Financial Assessment')}
                  size="sm"
                  className="rounded-full bg-green-600 hover:bg-green-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Financial Assessment</h4>
                <Badge className={data.financialViable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {data.financialViable ? 'Viable' : 'Not Viable'}
                </Badge>
              </div>
              {data.financialComments && (
                <p className="text-sm text-gray-600">{data.financialComments}</p>
              )}
            </div>

            {/* Tasks for this area */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Tasks ({getTasksForArea('Financial Assessment').length})</h4>
              {getTasksForArea('Financial Assessment').length > 0 ? (
                getTasksForArea('Financial Assessment').map((task) => (
                  <div key={task.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{task.title}</h5>
                        {task.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-xs ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </Badge>
                          <Badge className={`text-xs ${
                            task.stage === 'completed' ? 'bg-green-100 text-green-800' :
                            task.stage === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.stage.replace('_', ' ')}
                          </Badge>
                          {task.isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {task.team?.slice(0, 2).map((member: any, index: number) => (
                          <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                            <AvatarFallback className="text-xs bg-green-100 text-green-800">
                              {member.firstName[0]}{member.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {task.team && task.team.length > 2 && (
                          <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{task.team.length - 2}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>Due: {format(new Date(task.date), 'MMM dd, yyyy')}</span>
                      <span>Created by: {task.creator.firstName} {task.creator.lastName}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No tasks assigned to this area yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeArea === 'competitive' && (
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-normal flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-100 to-violet-200 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-purple-500" />
                </div>
                Competitive Analysis
              </CardTitle>
              {onCreateTask && (
                <Button
                  onClick={() => onCreateTask('Competitive Analysis')}
                  size="sm"
                  className="rounded-full bg-purple-600 hover:bg-purple-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Competitive Analysis</h4>
                <Badge className={data.competitiveOpportunities ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {data.competitiveOpportunities ? 'Viable' : 'Not Viable'}
                </Badge>
              </div>
              {data.competitiveComments && (
                <p className="text-sm text-gray-600">{data.competitiveComments}</p>
              )}
            </div>

            {/* Tasks for this area */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Tasks ({getTasksForArea('Competitive Analysis').length})</h4>
              {getTasksForArea('Competitive Analysis').length > 0 ? (
                getTasksForArea('Competitive Analysis').map((task) => (
                  <div key={task.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{task.title}</h5>
                        {task.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-xs ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </Badge>
                          <Badge className={`text-xs ${
                            task.stage === 'completed' ? 'bg-green-100 text-green-800' :
                            task.stage === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.stage.replace('_', ' ')}
                          </Badge>
                          {task.isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {task.team?.slice(0, 2).map((member: any, index: number) => (
                          <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                            <AvatarFallback className="text-xs bg-purple-100 text-purple-800">
                              {member.firstName[0]}{member.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {task.team && task.team.length > 2 && (
                          <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{task.team.length - 2}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>Due: {format(new Date(task.date), 'MMM dd, yyyy')}</span>
                      <span>Created by: {task.creator.firstName} {task.creator.lastName}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No tasks assigned to this area yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeArea === 'management' && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-normal flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-orange-500" />
                </div>
                Management Team Evaluation
              </CardTitle>
              {onCreateTask && (
                <Button
                  onClick={() => onCreateTask('Management Team Evaluation')}
                  size="sm"
                  className="rounded-full bg-orange-600 hover:bg-orange-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Management Team Evaluation</h4>
                <Badge className={data.managementTeamQualified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {data.managementTeamQualified ? 'Qualified' : 'Not Qualified'}
                </Badge>
              </div>
              {data.managementComments && (
                <p className="text-sm text-gray-600">{data.managementComments}</p>
              )}
            </div>

            {/* Tasks for this area */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Tasks ({getTasksForArea('Management Team Evaluation').length})</h4>
              {getTasksForArea('Management Team Evaluation').length > 0 ? (
                getTasksForArea('Management Team Evaluation').map((task) => (
                  <div key={task.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{task.title}</h5>
                        {task.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-xs ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </Badge>
                          <Badge className={`text-xs ${
                            task.stage === 'completed' ? 'bg-green-100 text-green-800' :
                            task.stage === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.stage.replace('_', ' ')}
                          </Badge>
                          {task.isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {task.team?.slice(0, 2).map((member: any, index: number) => (
                          <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                            <AvatarFallback className="text-xs bg-orange-100 text-orange-800">
                              {member.firstName[0]}{member.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {task.team && task.team.length > 2 && (
                          <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{task.team.length - 2}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>Due: {format(new Date(task.date), 'MMM dd, yyyy')}</span>
                      <span>Created by: {task.creator.firstName} {task.creator.lastName}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No tasks assigned to this area yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeArea === 'legal' && (
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-normal flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-100 to-rose-200 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-red-500" />
                </div>
                Legal Compliance
              </CardTitle>
              {onCreateTask && (
                <Button
                  onClick={() => onCreateTask('Legal Compliance')}
                  size="sm"
                  className="rounded-full bg-red-600 hover:bg-red-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Legal Compliance</h4>
                <Badge className={data.legalCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {data.legalCompliant ? 'Compliant' : 'Not Compliant'}
                </Badge>
              </div>
              {data.legalComments && (
                <p className="text-sm text-gray-600">{data.legalComments}</p>
              )}
            </div>

            {/* Tasks for this area */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Tasks ({getTasksForArea('Legal Compliance').length})</h4>
              {getTasksForArea('Legal Compliance').length > 0 ? (
                getTasksForArea('Legal Compliance').map((task) => (
                  <div key={task.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{task.title}</h5>
                        {task.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-xs ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </Badge>
                          <Badge className={`text-xs ${
                            task.stage === 'completed' ? 'bg-green-100 text-green-800' :
                            task.stage === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.stage.replace('_', ' ')}
                          </Badge>
                          {task.isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {task.team?.slice(0, 2).map((member: any, index: number) => (
                          <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                            <AvatarFallback className="text-xs bg-red-100 text-red-800">
                              {member.firstName[0]}{member.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {task.team && task.team.length > 2 && (
                          <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{task.team.length - 2}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>Due: {format(new Date(task.date), 'MMM dd, yyyy')}</span>
                      <span>Created by: {task.creator.firstName} {task.creator.lastName}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No tasks assigned to this area yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeArea === 'risk' && (
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-normal flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-100 to-amber-200 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                </div>
                Risk Assessment
              </CardTitle>
              {onCreateTask && (
                <Button
                  onClick={() => onCreateTask('Risk Assessment')}
                  size="sm"
                  className="rounded-full bg-yellow-600 hover:bg-yellow-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Risk Assessment</h4>
                <Badge className={data.riskTolerable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {data.riskTolerable ? 'Tolerable' : 'Not Tolerable'}
                </Badge>
              </div>
              {data.riskComments && (
                <p className="text-sm text-gray-600">{data.riskComments}</p>
              )}
            </div>

            {/* Tasks for this area */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Tasks ({getTasksForArea('Risk Assessment').length})</h4>
              {getTasksForArea('Risk Assessment').length > 0 ? (
                getTasksForArea('Risk Assessment').map((task) => (
                  <div key={task.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{task.title}</h5>
                        {task.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-xs ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </Badge>
                          <Badge className={`text-xs ${
                            task.stage === 'completed' ? 'bg-green-100 text-green-800' :
                            task.stage === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.stage.replace('_', ' ')}
                          </Badge>
                          {task.isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {task.team?.slice(0, 2).map((member: any, index: number) => (
                          <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                            <AvatarFallback className="text-xs bg-yellow-100 text-yellow-800">
                              {member.firstName[0]}{member.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {task.team && task.team.length > 2 && (
                          <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{task.team.length - 2}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>Due: {format(new Date(task.date), 'MMM dd, yyyy')}</span>
                      <span>Created by: {task.creator.firstName} {task.creator.lastName}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No tasks assigned to this area yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Final Comments */}
      {data.finalComments && (
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-normal flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-100 to-violet-200 flex items-center justify-center">
                <FileText className="w-4 h-4 text-purple-500" />
              </div>
              Final Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{data.finalComments}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
