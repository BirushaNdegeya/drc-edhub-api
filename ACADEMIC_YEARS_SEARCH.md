# Academic Years Search API Guide

## Overview

Fast search endpoint for academic years. Optimized for real-time search/autocomplete functionality.

## Endpoint

```
GET /api/academic-years/search/query?q={searchTerm}&limit={limit}
```

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | ✅ Yes | - | Search query (searches in name and province) |
| `limit` | number | ❌ No | 10 | Maximum number of results (max: 100) |

## Response

**Success (200):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "2023-2024",
    "province": "Kinshasa"
  },
  {
    "id": "2cd45f64-5717-4562-b3fc-2c963f66afa7",
    "name": "2024-2025",
    "province": "Kinshasa"
  }
]
```

**Empty Result:**
```json
[]
```

## Examples

### Search by Name
```
GET /api/academic-years/search/query?q=2023&limit=5
```

### Search by Province
```
GET /api/academic-years/search/query?q=Kinshasa&limit=10
```

### With Custom Limit
```
GET /api/academic-years/search/query?q=2024&limit=20
```

---

## Frontend Integration

### 1. **React with Axios** (Recommended)

```typescript
import axios from 'axios';
import { useState, useCallback } from 'react';

const AcademicYearSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchAcademicYears = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('/api/academic-years/search/query', {
        params: {
          q: query,
          limit: 10,
        },
      });
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Search academic years..."
        onChange={(e) => searchAcademicYears(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      <ul>
        {results.map((year) => (
          <li key={year.id}>
            {year.name} - {year.province}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AcademicYearSearch;
```

### 2. **React with Debounce** (Better Performance)

```typescript
import axios from 'axios';
import { useState, useCallback, useRef } from 'react';

const AcademicYearSearchWithDebounce = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();

  const searchAcademicYears = useCallback((query: string) => {
    // Clear previous timeout
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Set new timeout - wait 300ms after user stops typing
    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/academic-years/search/query', {
          params: { q: query, limit: 10 },
        });
        setResults(response.data);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce delay: 300ms
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Search academic years..."
        onChange={(e) => searchAcademicYears(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      <ul>
        {results.map((year) => (
          <li key={year.id}>{year.name} - {year.province}</li>
        ))}
      </ul>
    </div>
  );
};

export default AcademicYearSearchWithDebounce;
```

### 3. **Angular Service**

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AcademicYearService {
  constructor(private http: HttpClient) {}

  searchAcademicYears(query: string, limit: number = 10): Observable<any[]> {
    return this.http.get<any[]>('/api/academic-years/search/query', {
      params: {
        q: query,
        limit: limit.toString(),
      },
    });
  }
}

// Usage in Component
export class AcademicYearSearchComponent {
  searchResults$ = new Observable<any[]>();

  constructor(
    private academicYearService: AcademicYearService,
    private searchSubject: Subject<string>,
  ) {
    this.searchResults$ = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) =>
        query.trim()
          ? this.academicYearService.searchAcademicYears(query)
          : of([])
      ),
    );
  }

  onSearch(query: string) {
    this.searchSubject.next(query);
  }
}
```

### 4. **Vue.js 3 with Composition API**

```vue
<template>
  <div>
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search academic years..."
    />
    <p v-if="loading">Loading...</p>
    <ul>
      <li v-for="year in results" :key="year.id">
        {{ year.name }} - {{ year.province }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const searchQuery = ref('');
const results = ref([]);
const loading = ref(false);
let debounceTimer;

const searchAcademicYears = async (query) => {
  if (!query.trim()) {
    results.value = [];
    return;
  }

  loading.value = true;
  try {
    const response = await axios.get('/api/academic-years/search/query', {
      params: {
        q: query,
        limit: 10,
      },
    });
    results.value = response.data;
  } catch (error) {
    console.error('Search failed:', error);
    results.value = [];
  } finally {
    loading.value = false;
  }
};

// Watch with debounce
watch(
  searchQuery,
  (newQuery) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchAcademicYears(newQuery);
    }, 300);
  },
);
</script>
```

### 5. **Vanilla JavaScript**

```html
<input
  id="searchInput"
  type="text"
  placeholder="Search academic years..."
/>
<ul id="results"></ul>

<script>
  const searchInput = document.getElementById('searchInput');
  const resultsList = document.getElementById('results');
  let debounceTimer;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();

    if (!query) {
      resultsList.innerHTML = '';
      return;
    }

    debounceTimer = setTimeout(() => {
      fetch(
        `/api/academic-years/search/query?q=${encodeURIComponent(query)}&limit=10`
      )
        .then((response) => response.json())
        .then((data) => {
          resultsList.innerHTML = data
            .map(
              (year) =>
                `<li>${year.name} - ${year.province}</li>`
            )
            .join('');
        })
        .catch((error) => {
          console.error('Search failed:', error);
          resultsList.innerHTML = '';
        });
    }, 300);
  });
</script>
```

---

## Performance Optimization Tips

### 1. **Debouncing** (Highly Recommended)
Prevents excessive API calls while user is typing:
```typescript
// Wait 300-500ms after user stops typing before making request
const debounceDelay = 300;
```

### 2. **Request Cancellation**
Cancel previous requests when new search is initiated:
```typescript
const controller = new AbortController();
// Previous request
controller.abort();
// New request with signal
fetch(url, { signal: controller.signal });
```

### 3. **Request Memoization**
Cache search results for recently searched terms:
```typescript
const cache = new Map();
if (cache.has(query)) {
  return cache.get(query);
}
```

### 4. **Limit Results**
Always set an appropriate limit:
```typescript
limit: 10 // Start with 10, max 100
```

### 5. **Minimum Query Length**
Require at least 2-3 characters before searching:
```typescript
if (query.length < 2) {
  setResults([]);
  return;
}
```

---

## Complete React Example with All Best Practices

```typescript
import axios from 'axios';
import { useState, useCallback, useRef } from 'react';

interface AcademicYear {
  id: string;
  name: string;
  province: string;
}

const AcademicYearSearch = () => {
  const [results, setResults] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const debounceTimer = useRef<NodeJS.Timeout>();
  const cancelToken = useRef<any>(null);

  const searchAcademicYears = useCallback(async (searchQuery: string) => {
    // Cancel previous request
    if (cancelToken.current) {
      cancelToken.current.cancel('New search initiated');
    }

    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    cancelToken.current = axios.CancelToken.source();

    try {
      const response = await axios.get<AcademicYear[]>(
        '/api/academic-years/search/query',
        {
          params: {
            q: searchQuery,
            limit: 10,
          },
          cancelToken: cancelToken.current.token,
        }
      );
      setResults(response.data);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Search failed:', error);
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Debounce the search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      searchAcademicYears(newQuery);
    }, 300);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search academic years (min 2 chars)..."
        className="search-input"
      />
      
      {loading && <div className="loader">Loading...</div>}
      
      {results.length > 0 && (
        <ul className="results-list">
          {results.map((year) => (
            <li key={year.id} className="result-item">
              <strong>{year.name}</strong>
              <span className="province">{year.province}</span>
            </li>
          ))}
        </ul>
      )}

      {!loading && query.length >= 2 && results.length === 0 && (
        <p className="no-results">No academic years found</p>
      )}
    </div>
  );
};

export default AcademicYearSearch;
```

---

## Troubleshooting

### Empty Results
- Ensure search query has at least 2 characters
- Check if academic years exist in database
- Try searching with different keywords (name or province)

### Slow Response
- Increase debounce delay to 500ms
- Reduce limit parameter
- Check network speed
- Ensure limit doesn't exceed 100

### CORS Issues
- Search endpoint should have CORS enabled
- Configure CORS in NestJS if needed

---

## Best Practices Summary

✅ **DO:**
- Use debouncing (300-500ms)
- Cancel previous requests on new search
- Require minimum 2-3 character query
- Cache recent search results
- Show loading state
- Handle empty results gracefully
- Limit results to 10-20 items

❌ **DON'T:**
- Make request on every keystroke
- Keep all results in memory without limit
- Make request without validation
- Ignore loading state
- Hardcode API URL (use environment variables)
