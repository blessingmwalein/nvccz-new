// ============================================================================
// USER AVATAR COMPONENT
// Displays user avatar with detailed dropdown info
// ============================================================================

'use client'

import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Mail, Building2, UserCircle2, Shield } from 'lucide-react'
import type { UserInfo } from '@/lib/api/types/procurement.types'

interface UserAvatarProps {
  user: UserInfo
  size?: 'sm' | 'md' | 'lg'
  showDropdown?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
}

const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const getRoleLabel = (roleCode: string | null | undefined): string => {
  if (!roleCode) return 'Staff'
  
  const roleLabels: Record<string, string> = {
    PROC_MGR: 'Procurement Manager',
    PROC_OFF: 'Procurement Officer',
    BUYER: 'Buyer',
    PROC_COORD: 'Procurement Coordinator',
    PROC_MEM: 'Procurement Member',
    FIN_MGR: 'Finance Manager',
    ACCOUNTANT: 'Accountant',
    FIN_ASST: 'Finance Assistant',
    ADMIN: 'Administrator',
  }
  
  return roleLabels[roleCode] || roleCode
}

const getDepartmentRoleBadge = (departmentRole: string | null | undefined) => {
  if (!departmentRole) return null
  
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    HEAD: 'default',
    DEPUTY: 'secondary',
    MEMBER: 'outline',
  }
  
  return (
    <Badge variant={variants[departmentRole] || 'outline'} className="text-xs">
      {departmentRole}
    </Badge>
  )
}

export function UserAvatar({ user, size = 'md', showDropdown = true, className = '' }: UserAvatarProps) {
  const initials = getInitials(user.firstName, user.lastName)
  const fullName = `${user.firstName} ${user.lastName}`

  if (!showDropdown) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={undefined} alt={fullName} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        {size !== 'sm' && (
          <div className="flex flex-col">
            <span className="text-sm font-medium">{fullName}</span>
            {user.email && <span className="text-xs text-muted-foreground">{user.email}</span>}
          </div>
        )}
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none ${className}`}>
          <Avatar className={`${sizeClasses[size]} cursor-pointer`}>
            <AvatarImage src={undefined} alt={fullName} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 py-2">
            <Avatar className="h-14 w-14">
              <AvatarImage src={undefined} alt={fullName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-base font-semibold leading-none">{fullName}</p>
              <p className="text-xs text-muted-foreground leading-none">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <div className="px-2 py-3 space-y-3">
            {/* Department */}
            {user.userDepartment && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium">{user.userDepartment}</p>
                </div>
              </div>
            )}

            {/* Department Role */}
            {user.departmentRole && (
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Department Role</p>
                  <div className="mt-1">{getDepartmentRoleBadge(user.departmentRole)}</div>
                </div>
              </div>
            )}

            {/* System Role */}
            {user.roleCode && (
              <div className="flex items-center gap-2">
                <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">System Role</p>
                  <p className="text-sm font-medium">{getRoleLabel(user.roleCode)}</p>
                </div>
              </div>
            )}

            {/* Email (always show) */}
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium truncate">{user.email}</p>
              </div>
            </div>

            {/* User ID */}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">User ID</p>
              <p className="text-xs font-mono text-muted-foreground truncate">{user.id}</p>
            </div>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Simple variant for table cells
export function UserAvatarCell({ user }: { user: UserInfo }) {
  const initials = getInitials(user.firstName, user.lastName)
  const fullName = `${user.firstName} ${user.lastName}`

  return (
    <UserAvatar user={user} size="sm" showDropdown={true} />
  )
}

// Compact variant showing name
export function UserAvatarWithName({ user, size = 'md' }: { user: UserInfo; size?: 'sm' | 'md' | 'lg' }) {
  const initials = getInitials(user.firstName, user.lastName)
  const fullName = `${user.firstName} ${user.lastName}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1.5 transition-colors focus:outline-none">
          <Avatar className={sizeClasses[size]}>
            <AvatarImage src={undefined} alt={fullName} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{fullName}</span>
            {user.roleCode && (
              <span className="text-xs text-muted-foreground">{getRoleLabel(user.roleCode)}</span>
            )}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="start">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 py-2">
            <Avatar className="h-14 w-14">
              <AvatarImage src={undefined} alt={fullName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-base font-semibold leading-none">{fullName}</p>
              <p className="text-xs text-muted-foreground leading-none">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-3 space-y-3">
          {user.userDepartment && (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="text-sm font-medium">{user.userDepartment}</p>
              </div>
            </div>
          )}
          {user.departmentRole && (
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Department Role</p>
                <div className="mt-1">{getDepartmentRoleBadge(user.departmentRole)}</div>
              </div>
            </div>
          )}
          {user.roleCode && (
            <div className="flex items-center gap-2">
              <UserCircle2 className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">System Role</p>
                <p className="text-sm font-medium">{getRoleLabel(user.roleCode)}</p>
              </div>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
