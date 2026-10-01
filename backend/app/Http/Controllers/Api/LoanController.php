<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Loan;
use Illuminate\Http\Request;

class LoanController extends Controller
{
    public function index()
    {
        return Loan::with(['book', 'borrower'])->get();
    }

    // Checkout a book
    public function store(Request $request)
    {
        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
            'borrower_id' => 'required|exists:borrowers,id',
            'due_at' => 'required|date|after:today',
        ]);

        $book = Book::findOrFail($validated['book_id']);

        if ($book->available_copies < 1) {
            return response()->json(['message' => 'No copies available for this book.'], 422);
        }

        $loan = Loan::create([
            'book_id' => $book->id,
            'borrower_id' => $validated['borrower_id'],
            'borrowed_at' => now(),
            'due_at' => $validated['due_at'],
            'status' => 'borrowed',
        ]);

        $book->decrement('available_copies');

        return response()->json($loan->load(['book', 'borrower']), 201);
    }

    // Return a book
    public function returnBook(Loan $loan)
    {
        if ($loan->status === 'returned') {
            return response()->json(['message' => 'This loan is already returned.'], 422);
        }

        $loan->update([
            'returned_at' => now(),
            'status' => 'returned',
        ]);

        $loan->book->increment('available_copies');

        return response()->json($loan->load(['book', 'borrower']));
    }

    // List overdue loans
    public function overdue()
    {
        return Loan::with(['book', 'borrower'])
            ->where('status', 'borrowed')
            ->where('due_at', '<', now())
            ->get();
    }
}