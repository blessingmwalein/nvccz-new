# Financial Statements Update Guide

This guide provides instructions for updating the Income Statement, Balance Sheet, and Cash Flow views to support the new backend structure with expand/collapse functionality for transactions.

## ✅ Completed Components

### 1. Transaction View Drawer (`components/accounting/transaction-view-drawer.tsx`)
- Displays detailed transaction information
- Shows journal entries, source transactions, customer/vendor details, bank info
- Export to JSON functionality
- Color-coded badges for status and source types

### 2. Transactions Data Table (`components/accounting/transactions-data-table.tsx`)
- Reusable table component for displaying transactions
- Search functionality (reference, description, source)
- Export to CSV and PDF
- Row click handler to open transaction drawer
- Summary totals (debits, credits, net)
- Color-coded amounts (green for debits, red for credits)

## 🔧 Required Updates

### 3. Income Statement View Update

#### Key Changes Needed:

1. **Add new imports**:
```tsx
import { ChevronDown, ChevronUp } from "lucide-react"
import { TransactionsDataTable } from "./transactions-data-table"
import { TransactionViewDrawer } from "./transaction-view-drawer"
```

2. **Add state for expand/collapse and transaction drawer**:
```tsx
const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set())
const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null)
const [isTransactionDrawerOpen, setIsTransactionDrawerOpen] = useState(false)
```

3. **Add toggle and transaction click handlers**:
```tsx
const toggleAccount = (accountId: string) => {
  setExpandedAccounts(prev => {
    const newSet = new Set(prev)
    if (newSet.has(accountId)) {
      newSet.delete(accountId)
    } else {
      newSet.add(accountId)
    }
    return newSet
  })
}

const handleTransactionClick = (transaction: any) => {
  setSelectedTransaction(transaction)
  setIsTransactionDrawerOpen(true)
}
```

4. **Update account rendering to add expand button and transactions table**:

For each account in the sections (revenue, operatingExpenses, etc.):

```tsx
{incomeStatement.sections.revenue.accounts.map((account) => {
  const isExpanded = expandedAccounts.has(account.accountId)
  const hasTransactions = account.transactions && account.transactions.length > 0
  
  return (
    <div key={account.accountId} className="ml-8 space-y-1">
      <div className="flex justify-between py-1">
        <div className="flex items-center gap-2">
          {hasTransactions && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleAccount(account.accountId)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
          <span className="text-sm">{account.accountName}</span>
          {hasTransactions && (
            <Badge variant="outline" className="text-xs">
              {account.transactions.length} txns
            </Badge>
          )}
        </div>
        <span className="font-mono text-sm text-right w-32 text-green-700">
          {formatCurrency(account.amount || account.netAmount)}
        </span>
      </div>
      
      {/* Expandable Transactions */}
      {isExpanded && hasTransactions && (
        <div className="ml-8 my-2 p-4 bg-gray-50 rounded-lg">
          <TransactionsDataTable
            transactions={account.transactions}
            onRowClick={handleTransactionClick}
            title={`${account.accountName} Transactions`}
          />
        </div>
      )}
    </div>
  )
})}
```

5. **Add Transaction Drawer at the end of the component (before closing div)**:
```tsx
<TransactionViewDrawer
  isOpen={isTransactionDrawerOpen}
  onClose={() => setIsTransactionDrawerOpen(false)}
  transaction={selectedTransaction}
/>
```

### 4. Balance Sheet View Update

Similar pattern to Income Statement:

1. **Add same imports and state**
2. **Update the account rendering sections**:

For Assets (Current, Fixed, Other):
```tsx
{balanceSheet.assets.currentAssets.accounts.map((account) => {
  const isExpanded = expandedAccounts.has(account.accountNo)
  const hasTransactions = account.transactions && account.transactions.length > 0
  
  return (
    <div key={account.accountNo}>
      <div className="flex justify-between py-1 pl-2">
        <div className="flex items-center gap-2">
          {hasTransactions && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleAccount(account.accountNo)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
          <span className="text-sm">{account.accountName}</span>
          {hasTransactions && (
            <Badge variant="outline" className="text-xs">
              {account.transactions.length}
            </Badge>
          )}
        </div>
        <span className="font-mono text-sm">
          {formatMoney(account.balance)}
        </span>
      </div>
      
      {isExpanded && hasTransactions && (
        <div className="ml-6 my-2 p-4 bg-blue-50 rounded-lg">
          <TransactionsDataTable
            transactions={account.transactions}
            onRowClick={handleTransactionClick}
            title={`${account.accountName} Transactions`}
          />
        </div>
      )}
    </div>
  )
})}
```

Apply the same pattern to:
- Liabilities (Current and Long-term)
- Equity accounts

### 5. Cash Flow View Update

The cash flow has a different structure with `operatingActivities.accounts`, `investingActivities.accounts`, `financingActivities.accounts`:

```tsx
{/* Operating Activities - Accounts */}
{cashFlow.operatingActivities?.accounts && cashFlow.operatingActivities.accounts.length > 0 && (
  <div className="space-y-2 mt-4">
    <div className="text-sm font-semibold text-gray-700 flex items-center gap-2 pl-2">
      <FileText className="w-4 h-4" />
      Operating Accounts Detail
    </div>
    {cashFlow.operatingActivities.accounts.map((account) => {
      const isExpanded = expandedAccounts.has(account.accountId)
      const hasTransactions = account.transactions && account.transactions.length > 0
      
      return (
        <div key={account.accountId} className="ml-4">
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center gap-2">
              {hasTransactions && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleAccount(account.accountId)}
                  className="h-6 w-6 p-0"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              )}
              <span className="text-sm">{account.accountName} ({account.accountType})</span>
              {hasTransactions && (
                <Badge variant="outline" className="text-xs">
                  {account.transactions.length} txns
                </Badge>
              )}
            </div>
            <span className={cn(
              "font-mono text-sm",
              account.netAmount >= 0 ? "text-green-700" : "text-red-700"
            )}>
              {formatMoney(account.netAmount)}
            </span>
          </div>
          
          {isExpanded && hasTransactions && (
            <div className="ml-6 my-2 p-4 bg-blue-50 rounded-lg">
              <TransactionsDataTable
                transactions={account.transactions}
                onRowClick={handleTransactionClick}
                title={`${account.accountName} - Cash Flow Transactions`}
              />
            </div>
          )}
        </div>
      )
    })}
  </div>
)}
```

Repeat for `investingActivities.accounts` and `financingActivities.accounts`.

## 📝 Implementation Checklist

### Income Statement (`income-statement-view.tsx`)
- [ ] Add new imports (ChevronDown, ChevronUp, TransactionsDataTable, TransactionViewDrawer)
- [ ] Add state for expandedAccounts, selectedTransaction, isTransactionDrawerOpen
- [ ] Add toggleAccount and handleTransactionClick handlers
- [ ] Update revenue section accounts rendering with expand/collapse
- [ ] Update operating expenses section accounts rendering
- [ ] Update income tax section accounts rendering (if total > 0)
- [ ] Update below-the-line section accounts rendering (if total !== 0)
- [ ] Add TransactionViewDrawer component at end
- [ ] Test expand/collapse functionality
- [ ] Test transaction drawer opening

### Balance Sheet (`balance-sheet-view.tsx`)
- [ ] Add new imports
- [ ] Add state management
- [ ] Update Current Assets accounts rendering
- [ ] Update Fixed Assets accounts rendering
- [ ] Update Other Assets accounts rendering
- [ ] Update Current Liabilities accounts rendering
- [ ] Update Long-term Liabilities accounts rendering
- [ ] Update Equity accounts rendering (if any)
- [ ] Add Transaction View Drawer
- [ ] Test all sections

### Cash Flow (`cash-flow-view.tsx`)
- [ ] Add new imports
- [ ] Add state management
- [ ] Add account detail section for Operating Activities
- [ ] Add account detail section for Investing Activities
- [ ] Add account detail section for Financing Activities
- [ ] Add Transaction View Drawer
- [ ] Ensure presentation view still works
- [ ] Test with both traditional and account-based views

## 🎨 Styling Notes

- Use `bg-gray-50` or `bg-blue-50` for expanded transaction sections
- Keep consistent spacing: `ml-4`, `ml-6`, `ml-8` for nested levels
- Use `rounded-lg` for transaction containers
- Badge colors: 
  - `variant="outline"` for transaction counts
  - Green/Red for positive/negative amounts
  - Blue for sources (CASHBOOK), Purple for MANUAL_ENTRY

## 🧪 Testing Checklist

- [ ] All three views load without errors
- [ ] Expand/collapse buttons appear only when transactions exist
- [ ] Transaction count badges show correct numbers
- [ ] Clicking expand shows TransactionsDataTable
- [ ] Clicking transaction row opens TransactionViewDrawer
- [ ] Transaction drawer shows all details correctly
- [ ] Export CSV from transactions table works
- [ ] Export PDF from transactions table works
- [ ] Export JSON from transaction drawer works
- [ ] Search in transactions table filters correctly
- [ ] Totals in transactions table calculate correctly
- [ ] Loading states work properly
- [ ] Error states display correctly

## 📚 Additional Resources

- Transaction API structure documented in user request
- Existing ProcurementDataTable can serve as additional reference
- Trial Balance view already has similar expand/collapse pattern

## 🚀 Deployment Notes

After implementing all changes:
1. Test in development with real API responses
2. Verify all export functions work correctly
3. Check responsive design on mobile/tablet
4. Ensure no TypeScript errors
5. Test performance with large transaction lists (100+ transactions)
6. Verify lazy loading if implemented

---

**Status**: Components 1-2 completed ✅, Components 3-5 require manual implementation following this guide.
