import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import adminApiService, { 
  User, 
  HardcodedRole, 
  DepartmentWithRoles, 
  CreateUserRequest, 
  UpdateUserRequest 
} from "@/lib/api/admin-api"

interface AdminState {
  users: User[]
  roles: HardcodedRole[]
  departmentsWithRoles: DepartmentWithRoles[]
  selectedUser: User | null
  loading: boolean
  usersLoading: boolean
  rolesLoading: boolean
  error: string | null
  
  // User details
  selectedUserDetails: any | null
  selectedUserDetailsLoading: boolean
  
  // Filters
  selectedDepartmentFilter: string
  selectedRoleFilter: string
  searchTerm: string
}

const initialState: AdminState = {
  users: [],
  roles: [],
  departmentsWithRoles: [],
  selectedUser: null,
  loading: false,
  usersLoading: false,
  rolesLoading: false,
  error: null,
  
  // User details
  selectedUserDetails: null,
  selectedUserDetailsLoading: false,
  
  selectedDepartmentFilter: 'all',
  selectedRoleFilter: 'all',
  searchTerm: '',
}

// Async thunks - simplified without caching
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getUsers()
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch users')
    }
  }
)

export const fetchUserById = createAsyncThunk(
  'admin/fetchUserById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getUserById(userId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user')
    }
  }
)

export const createUser = createAsyncThunk(
  'admin/createUser',
  async (data: CreateUserRequest, { dispatch, rejectWithValue }) => {
    try {
      const response = await adminApiService.createUser(data)
      dispatch(fetchUsers())
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create user')
    }
  }
)

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ userId, data }: { userId: string; data: UpdateUserRequest }, { dispatch, rejectWithValue }) => {
    try {
      const response = await adminApiService.updateUser(userId, data)
      dispatch(fetchUsers())
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update user')
    }
  }
)

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await adminApiService.deleteUser(userId)
      dispatch(fetchUsers())
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete user')
    }
  }
)

export const fetchAllRoles = createAsyncThunk(
  'admin/fetchAllRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getAllRoles()
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch roles')
    }
  }
)

export const fetchDepartmentsWithRoles = createAsyncThunk(
  'admin/fetchDepartmentsWithRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getDepartmentsWithRoles()
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch departments with roles')
    }
  }
)

export const fetchUserDetails = createAsyncThunk(
  'admin/fetchUserDetails',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getUserDetails(userId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user details')
    }
  }
)

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload
    },
    setSelectedDepartmentFilter: (state, action: PayloadAction<string>) => {
      state.selectedDepartmentFilter = action.payload
    },
    setSelectedRoleFilter: (state, action: PayloadAction<string>) => {
      state.selectedRoleFilter = action.payload
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    resetFilters: (state) => {
      state.selectedDepartmentFilter = 'all'
      state.selectedRoleFilter = 'all'
      state.searchTerm = ''
    },
    clearUserDetails: (state) => {
      state.selectedUserDetails = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false
        state.users = action.payload.data || []
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false
        state.error = action.payload as string
      })
      
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedUser = action.payload
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Fetch all roles
      .addCase(fetchAllRoles.pending, (state) => {
        state.rolesLoading = true
      })
      .addCase(fetchAllRoles.fulfilled, (state, action) => {
        state.rolesLoading = false
        state.roles = action.payload.data || []
      })
      .addCase(fetchAllRoles.rejected, (state, action) => {
        state.rolesLoading = false
        state.error = action.payload as string
      })
      
      // Fetch departments with roles
      .addCase(fetchDepartmentsWithRoles.pending, (state) => {
        state.rolesLoading = true
      })
      .addCase(fetchDepartmentsWithRoles.fulfilled, (state, action) => {
        state.rolesLoading = false
        state.departmentsWithRoles = action.payload.data || []
      })
      .addCase(fetchDepartmentsWithRoles.rejected, (state, action) => {
        state.rolesLoading = false
        state.error = action.payload as string
      })
      
      // Fetch user details
      .addCase(fetchUserDetails.pending, (state) => {
        state.selectedUserDetailsLoading = true
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.selectedUserDetailsLoading = false
        state.selectedUserDetails = action.payload
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.selectedUserDetailsLoading = false
        state.error = action.payload as string
      })
  },
})

export const {
  setSelectedUser,
  setSelectedDepartmentFilter,
  setSelectedRoleFilter,
  setSearchTerm,
  resetFilters,
  clearUserDetails,
} = adminSlice.actions

export default adminSlice.reducer
