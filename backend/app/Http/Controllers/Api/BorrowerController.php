<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Borrower;
use Illuminate\Http\Request;

class BorrowerController extends Controller
{
    public function index()
    {
        return Borrower::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:borrowers,email',
            'phone' => 'nullable|string|max:20',
        ]);

        $borrower = Borrower::create($validated);

        return response()->json($borrower, 201);
    }

    public function show(Borrower $borrower)
    {
        return $borrower->load('loans');
    }

    public function update(Request $request, Borrower $borrower)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:borrowers,email,' . $borrower->id,
            'phone' => 'nullable|string|max:20',
        ]);

        $borrower->update($validated);

        return response()->json($borrower);
    }

    public function destroy(Borrower $borrower)
    {
        $borrower->delete();

        return response()->json(null, 204);
    }
}