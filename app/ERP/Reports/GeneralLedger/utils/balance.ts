// import { JournalEntry } from '@/types.db';
// import { round2 } from './format';

import { JournalEntry } from "@/lib/api/accounting-api";

// Helper function to round to 2 decimal places
export const round2 = (num: number): number => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const isEntryBalanced = (entry: JournalEntry) => {
    let debit = 0;
    let credit = 0;
    for (const line of entry.journalEntryLines || []) {
        debit += parseFloat(line.debitAmount || '0') || 0;
        credit += parseFloat(line.creditAmount || '0') || 0;
    }
    const diff = round2(debit - credit);
    return Math.abs(diff) < 0.01;
};

export const currencyAccentClass = (code?: string) => {
    switch (code) {
        case 'USD':
            return 'border-sky-500';
        case 'EUR':
            return 'border-indigo-500';
        case 'GBP':
            return 'border-violet-500';
        case 'ZWL':
            return 'border-emerald-500';
        case 'ZAR':
            return 'border-amber-500';
        default:
            return 'border-navy-500';
    }
};