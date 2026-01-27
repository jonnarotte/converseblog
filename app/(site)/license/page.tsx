import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'License',
  description: 'MIT License for Converze',
}

export default function LicensePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link 
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Back to home
        </Link>
      </div>
      
      <h1 className="text-3xl font-medium">MIT License</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Copyright (c) 2026 Converze
        </p>
        
        <p>
          Permission is hereby granted, free of charge, to any person obtaining a copy
          of this software and associated documentation files (the &quot;Software&quot;), to deal
          in the Software without restriction, including without limitation the rights
          to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
          copies of the Software, and to permit persons to whom the Software is
          furnished to do so, subject to the following conditions:
        </p>
        
        <p>
          The above copyright notice and this permission notice shall be included in all
          copies or substantial portions of the Software.
        </p>
        
        <p>
          THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
          IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
          AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
          LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
          OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
          SOFTWARE.
        </p>
      </div>
    </div>
  )
}
