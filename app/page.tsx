export default function Home() {
  return (
    <section className="space-y-20">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">
          Understand Your Voice.<br />Shape How You’re Heard.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Converze helps you visualize how you sound, discover your communication
          style, and intentionally transform it through daily practice.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-8 text-center">
        <div className="border p-6 rounded-xl">
          <h3 className="font-semibold">Record</h3>
          <p className="text-gray-600 mt-2">Capture your natural speech</p>
        </div>
        <div className="border p-6 rounded-xl">
          <h3 className="font-semibold">Visualize</h3>
          <p className="text-gray-600 mt-2">See your voice as shapes</p>
        </div>
        <div className="border p-6 rounded-xl">
          <h3 className="font-semibold">Discover</h3>
          <p className="text-gray-600 mt-2">Find your voice cluster</p>
        </div>
        <div className="border p-6 rounded-xl">
          <h3 className="font-semibold">Transform</h3>
          <p className="text-gray-600 mt-2">Practice daily</p>
        </div>
      </div>
    </section>
  )
}

