export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-10 pt-10 text-left leading-relaxed">
      <h1 className="mb-5 text-3xl font-bold text-white">Welcome to Ether</h1>

      <p>
        I made this site as a way to store my exported songs from my DAW so
        that I could listen to them in my car and on my phone. This turned
        into me wanting to hear other people&apos;s music on this platform,
        and then wanting a way for artists to share music and audio that they
        are working on or have finished.
      </p>

      <p>The idea of Ether is that everyone can post:</p>

      <div className="my-4 whitespace-pre-wrap [tab-size:4]">
        {"Music\n    Sound recordings\nSpoken Words\n    Thoughts Aloud"}
      </div>

      <p>
        You can listen to your own work and discover what other artists are
        creating as well.
      </p>

      <p>
        I have a lot of ideas for how to expand Ether, and there are still
        some bugs. If you would like to help, this is an open-source project.
        You can also reach out to me at{" "}
        <a href="mailto:19cowarner@gmail.com">19cowarner@gmail.com</a>.
      </p>
    </main>
  );
}
