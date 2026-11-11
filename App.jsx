import { useEffect, useState } from "react";

const nav = [
  ["Overview", "⌂"], ["AI Speaking", "◉"], ["AI Writing", "✎"],
  ["Reading", "▤"], ["Listening", "♫"], ["Vocabulary", "✦"]
];
const questions = [
  "Do you work or are you a student?",
  "What do you enjoy most about learning English?",
  "How do you usually spend your weekends?"
];
const words = [
  ["Significant", "Important or large enough to be noticed", "There has been a significant increase in tourism."],
  ["Nevertheless", "Despite what has just been said", "The task was difficult; nevertheless, she completed it."],
  ["Tend to", "To usually do or be something", "People tend to use their phones throughout the day."],
  ["Beneficial", "Having a good effect or being useful", "Regular reading is beneficial for vocabulary development."]
];

function App() {
  const [page, setPage] = useState("Overview");
  const [name, setName] = useState("Learner");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [speakingAnswer, setSpeakingAnswer] = useState("");
  const [writing, setWriting] = useState("");
  const [task, setTask] = useState("Some people believe that students should study online. To what extent do you agree or disagree?");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState(null);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    fetch("/api/health").then(r => r.json()).then(setHealth).catch(() => setHealth({ ok: false, aiConfigured: false }));
  }, []);

  async function getFeedback(kind) {
    setLoading(true); setFeedback("");
    try {
      const endpoint = kind === "speaking" ? "/api/speaking" : "/api/writing";
      const body = kind === "speaking"
        ? { question: questions[questionIndex], answer: speakingAnswer, part: "Part 1" }
        : { task, essay: writing, taskType: "Task 2" };
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await response.json();
      setFeedback(data.feedback || data.error || "Something went wrong.");
    } catch {
      setFeedback("The server could not be reached. Start the project using npm run dev.");
    } finally { setLoading(false); }
  }

  const go = (item) => { setPage(item); setFeedback(""); };
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">B</div><span>bandup<span className="brand-ai">.ai</span></span></div>
      <div className="workspace-label">LEARNING SPACE</div>
      <nav>{nav.map(([label, icon]) => <button key={label} className={page === label ? "nav-item active" : "nav-item"} onClick={() => go(label)}><span className="nav-icon">{icon}</span>{label}{label === "AI Speaking" || label === "AI Writing" ? <span className="ai-tag">AI</span> : null}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-spark">✦</div><b>Keep your streak alive</b><p>Small steps every day lead to big progress.</p></div><div className="profile"><div className="avatar">L</div><div><b>{name}</b><small>Free learner</small></div><span className="dots">···</span></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> {page}</div><div className="top-actions"><span className="status-dot"></span><span className="status-text">{health?.aiConfigured ? "AI connected" : "Demo mode"}</span><div className="top-avatar">L</div></div></header>
      <div className="content">
        {page === "Overview" && <Overview setPage={setPage} />}
        {page === "AI Speaking" && <section><div className="eyebrow">AI PRACTICE ROOM</div><h1>Speaking practice</h1><p className="subhead">Build confidence one answer at a time. Your AI coach will give you detailed feedback.</p><div className="practice-card"><div className="practice-top"><span className="pill">PART 1 · INTRODUCTION</span><span className="muted">Question {questionIndex + 1} of {questions.length}</span></div><h2>{questions[questionIndex]}</h2><textarea value={speakingAnswer} onChange={e => setSpeakingAnswer(e.target.value)} placeholder="Type your answer here. Try to answer naturally in 2–4 sentences..." rows="6"/><div className="practice-actions"><button className="ghost-btn" onClick={() => {setQuestionIndex((questionIndex + 1) % questions.length); setSpeakingAnswer(""); setFeedback("");}}>Next question ↗</button><button className="primary-btn" disabled={loading || !speakingAnswer.trim()} onClick={() => getFeedback("speaking")}>{loading ? "Analysing..." : "✦ Get AI feedback"}</button></div>{feedback && <Feedback text={feedback}/>}</div><p className="tiny-note">Text-based practice: pronunciation cannot be assessed without an audio recording. AI scores are estimates, not official IELTS results.</p></section>}
        {page === "AI Writing" && <section><div className="eyebrow">AI WRITING STUDIO</div><h1>Write with purpose.</h1><p className="subhead">Submit your essay and get feedback using the four IELTS Writing criteria.</p><div className="practice-card"><div className="practice-top"><span className="pill">WRITING TASK 2</span><span className="muted">{writing.trim() ? writing.trim().split(/\s+/).length : 0} words</span></div><label className="field-label">Essay question</label><textarea className="question-box" rows="3" value={task} onChange={e => setTask(e.target.value)}/><label className="field-label">Your essay</label><textarea value={writing} onChange={e => setWriting(e.target.value)} placeholder="Write your introduction, body paragraphs and conclusion here..." rows="11"/><div className="practice-actions"><span className="muted">Aim for 250+ words</span><button className="primary-btn" disabled={loading || !writing.trim()} onClick={() => getFeedback("writing")}>{loading ? "Checking..." : "✦ Evaluate my essay"}</button></div>{feedback && <Feedback text={feedback}/>}</div><p className="tiny-note">AI feedback is for learning and is not an official IELTS band score.</p></section>}
        {page === "Reading" && <section><div className="eyebrow">READING PRACTICE</div><h1>Train your reading skills.</h1><p className="subhead">A short sample exercise to practise identifying information.</p><div className="practice-card"><span className="pill">TRUE / FALSE / NOT GIVEN</span><h2>Urban green spaces</h2><p className="passage">Many cities have started investing in public parks and green spaces. Research suggests that these areas can encourage physical activity and provide residents with places to relax. However, the benefits depend partly on how accessible and well-maintained the spaces are.</p><div className="question-block"><b>Statement:</b><p>All city parks are free to enter.</p><div className="choice-row">{["TRUE","FALSE","NOT GIVEN"].map(x => <button key={x} className="choice" onClick={e => {document.querySelectorAll(".choice").forEach(b => b.classList.remove("selected"));e.currentTarget.classList.add("selected");}}>{x}</button>)}</div><p className="tiny-note">Sample question only. Full timed practice tests can be added next.</p></div></div></section>}
        {page === "Listening" && <section><div className="eyebrow">LISTENING PRACTICE</div><h1>Listen actively.</h1><p className="subhead">Use this sample note-completion exercise to practise reading questions before listening.</p><div className="practice-card"><span className="pill">SECTION 1 · NOTE COMPLETION</span><h2>Community course registration</h2><p className="passage">You are registering for a community photography course. Listen to the information and complete the notes.</p><div className="note-list"><p>Course day: <input placeholder="Enter day"/></p><p>Starting time: <input placeholder="Enter time"/></p><p>Room number: <input placeholder="Enter room"/></p></div><div className="audio-placeholder">♫ <span>Audio sample will be added in the next version</span></div></div></section>}
        {page === "Vocabulary" && <section><div className="eyebrow">YOUR WORD BANK</div><h1>Grow your vocabulary.</h1><p className="subhead">Learn useful academic words and practise using them in context.</p><div className="word-card"><span className="pill">ACADEMIC VOCABULARY</span><div className="word-number">{String(wordIndex + 1).padStart(2,"0")} / {String(words.length).padStart(2,"0")}</div><h2>{words[wordIndex][0]}</h2><p className="definition">{words[wordIndex][1]}</p><div className="example">“{words[wordIndex][2]}”</div><div className="practice-actions"><button className="ghost-btn" onClick={() => setWordIndex((wordIndex + words.length - 1) % words.length)}>← Previous</button><button className="primary-btn" onClick={() => setWordIndex((wordIndex + 1) % words.length)}>Next word →</button></div></div></section>}
      </div>
      <footer>© 2026 BandUp AI <span>Learn consistently. Improve confidently.</span></footer>
    </main>
  </div>;
}

function Overview({ setPage }) {
  return <section><div className="welcome-row"><div><div className="eyebrow">YOUR IELTS JOURNEY</div><h1>Ready to level up?</h1><p className="subhead">A little progress every day adds up to a lot.</p></div><div className="goal-chip">✦ Goal: Band 7.0</div></div>
    <div className="hero-card"><div><div className="hero-kicker">YOUR NEXT MILESTONE</div><h2>Make 7.0 your next chapter.</h2><p>Build the four skills with focused practice and useful feedback.</p><button className="light-btn" onClick={() => setPage("AI Speaking")}>Start practising <span>→</span></button></div><div className="hero-art"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="orbit-core">7.0<small>YOUR GOAL</small></div><span className="star s1">✦</span><span className="star s2">✧</span></div></div>
    <div className="section-heading"><div><h2>Your practice space</h2><p>Choose a skill and get started.</p></div><span className="muted">6 learning tools</span></div>
    <div className="tool-grid">
      {[
        ["◉","AI Speaking","Practise with an AI examiner.","Speaking","blue"],
        ["✎","AI Writing","Get feedback on your essays.","Writing","purple"],
        ["▤","Reading","Improve speed and comprehension.","Reading","green"],
        ["♫","Listening","Train your listening accuracy.","Listening","orange"],
        ["✦","Vocabulary","Build a stronger word bank.","Vocabulary","pink"],
        ["◎","Progress","Track your learning journey.","Overview","blue"]
      ].map(([icon,title,desc,target,color]) => <button className="tool-card" key={title} onClick={() => setPage(target)}><div className={`tool-icon ${color}`}>{icon}</div><div><b>{title}</b><p>{desc}</p></div><span className="card-arrow">↗</span></button>)}
    </div>
    <div className="bottom-grid"><div className="small-panel"><div className="section-heading"><div><h3>Weekly focus</h3><p>Suggested starting routine</p></div></div><div className="focus-row"><span className="focus-dot blue-dot"></span><div><b>Writing practice</b><small>Plan and write one Task 2 essay</small></div><span className="duration">30 min</span></div><div className="focus-row"><span className="focus-dot purple-dot"></span><div><b>Speaking practice</b><small>Answer 5 Part 1 questions</small></div><span className="duration">15 min</span></div><div className="focus-row"><span className="focus-dot green-dot"></span><div><b>Vocabulary review</b><small>Learn 5 academic words</small></div><span className="duration">10 min</span></div></div><div className="small-panel progress-panel"><div className="section-heading"><div><h3>Your target</h3><p>Set your own starting point</p></div></div><div className="target-score">7.0<span> / 9.0</span></div><div className="progress-track"><div></div></div><p className="tiny-note">This is your goal, not a measured score. Complete practice tests to track your progress.</p></div></div>
  </section>;
}

function Feedback({ text }) {
  return <div className="feedback"><div className="feedback-title">✦ AI coach feedback</div><pre>{text}</pre></div>;
}

export default App;