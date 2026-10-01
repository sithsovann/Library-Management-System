<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Library Management System')</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        :root {
            /* 🎨 Change these to restyle the whole site */
            --color-primary: #2563EB;      /* main brand color (buttons, links, nav) */
            --color-primary-dark: #1D4ED8; /* hover state */
            --color-bg: #F8FAFC;           /* page background */
            --color-surface: #FFFFFF;      /* card/table background */
            --color-text: #1E293B;         /* main text */
            --color-text-muted: #64748B;   /* secondary text */
            --color-border: #E2E8F0;       /* borders/dividers */
            --color-success: #16A34A;
            --color-danger: #DC2626;
            --font-family: 'Inter', system-ui, sans-serif;
        }
        body {
            background-color: var(--color-bg);
            color: var(--color-text);
            font-family: var(--font-family);
        }
        .btn-primary {
            background-color: var(--color-primary);
            color: white;
        }
        .btn-primary:hover {
            background-color: var(--color-primary-dark);
        }
        .card {
            background-color: var(--color-surface);
            border: 1px solid var(--color-border);
        }
        .nav-link {
            color: var(--color-text-muted);
        }
        .nav-link:hover, .nav-link.active {
            color: var(--color-primary);
        }
    </style>
    @stack('styles')
</head>
<body class="min-h-screen">
    <nav class="card border-b px-6 py-4 flex items-center justify-between">
        <a href="/" class="text-lg font-semibold" style="color: var(--color-primary)">📚 Library System</a>
        <div class="flex gap-6 text-sm font-medium items-center">
            <a href="/books" class="nav-link">Books</a>
            <a href="/borrowers" class="nav-link">Borrowers</a>
            <a href="/loans" class="nav-link">Loans</a>

            @auth
                <span style="color: var(--color-text-muted)">{{ Auth::user()->name }}</span>
                <form action="{{ route('logout') }}" method="POST">
                    @csrf
                    <button type="submit" class="nav-link">Logout</button>
                </form>
            @else
                <a href="{{ route('login') }}" class="nav-link">Login</a>
                <a href="{{ route('register') }}" class="btn-primary px-4 py-1.5 rounded">Register</a>
            @endauth
        </div>
    </nav>

    <main class="max-w-5xl mx-auto px-6 py-8">
        @if(session('success'))
            <div class="mb-4 px-4 py-3 rounded-lg" style="background-color: #DCFCE7; color: var(--color-success);">
                {{ session('success') }}
            </div>
        @endif

        @yield('content')
    </main>
</body>
</html>