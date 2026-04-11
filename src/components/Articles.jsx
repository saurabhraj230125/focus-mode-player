import React from "react";

export default function Articles() {
  const articles = [
    {
      id: 1,
      category: "Productivity",
      title: "The Science of Deep Work: How to Focus Better",
      description: "Learn the exact neurological triggers and simple environmental tweaks that can double your concentration and study efficiency in 30 days.",
      readTime: "5 min read",
      date: "Mar 15, 2026",
      link: "#"
    },
    {
      id: 2,
      category: "Study Hacks",
      title: "Top 5 Study Techniques Used by Elite Students",
      description: "From active recall to the Feynman technique, discover the evidence-based methods used by top-performing students to ace exams.",
      readTime: "8 min read",
      date: "Mar 12, 2026",
      link: "#"
    },
    {
      id: 3,
      category: "Time Management",
      title: "Balancing the Chaos: Time Management for Founders",
      description: "Master your schedule. Learn how to ruthlessly prioritize tasks, avoid burnout, and balance your side projects with your personal life.",
      readTime: "6 min read",
      date: "Mar 08, 2026",
      link: "#"
    },
    {
      id: 4,
      category: "Workflow",
      title: "Building the Ultimate Second Brain",
      description: "Stop forgetting brilliant ideas. Tips on creating a digital note-taking system that is easy to revise, search, and remember forever.",
      readTime: "10 min read",
      date: "Mar 01, 2026",
      link: "#"
    },
    {
      id: 5,
      category: "Focus",
      title: "Pomodoro Technique: Maximize Focus in Short Bursts",
      description: "Learn how to use 25-minute focus sprints to increase productivity, retain information better, and avoid burnout.",
      readTime: "4 min read",
      date: "Feb 25, 2026",
      link: "#"
    },
    {
      id: 6,
      category: "Memory",
      title: "Active Recall vs Passive Review: Which Works?",
      description: "Understand the science of memory retention and how to implement active recall for long-term learning success.",
      readTime: "7 min read",
      date: "Feb 20, 2026",
      link: "#"
    },
    {
      id: 7,
      category: "Motivation",
      title: "How to Build a Daily Study Habit That Sticks",
      description: "Step-by-step strategies for creating routines that make studying automatic and enjoyable every day.",
      readTime: "6 min read",
      date: "Feb 18, 2026",
      link: "#"
    },
    {
      id: 8,
      category: "Learning",
      title: "The Feynman Technique: Learn Anything Deeply",
      description: "Discover Richard Feynman's method for truly understanding complex subjects by teaching them to yourself or others.",
      readTime: "5 min read",
      date: "Feb 15, 2026",
      link: "#"
    },
    {
      id: 9,
      category: "Exam Prep",
      title: "Effective Revision Strategies for JEE & Competitive Exams",
      description: "Proven methods to prioritize topics, revise smartly, and maximize marks under pressure.",
      readTime: "8 min read",
      date: "Feb 10, 2026",
      link: "#"
    },
    {
      id: 10,
      category: "Productivity",
      title: "Digital Minimalism: Focus Without Distractions",
      description: "Learn to reduce digital noise, manage notifications, and maintain a laser focus during study sessions.",
      readTime: "6 min read",
      date: "Feb 05, 2026",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* --- PAGE HEADER --- */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Strategies</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium">
            Master your focus, optimize your workflow, and achieve your biggest goals with our expert guides.
          </p>
        </div>

        {/* --- ARTICLE GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10">
          {articles.map((article) => (
            <a
              href={article.link}
              key={article.id}
              className="group flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:border-orange-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="h-48 w-full bg-gradient-to-br from-slate-100 to-slate-50 relative overflow-hidden group-hover:from-orange-50 group-hover:to-amber-50 transition-colors duration-500">
                <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-orange-200/20 rounded-full blur-3xl group-hover:bg-orange-300/40 transition-colors"></div>
                <div className="absolute bottom-[-50%] left-[-10%] w-48 h-48 bg-amber-200/20 rounded-full blur-2xl group-hover:bg-amber-300/40 transition-colors"></div>
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-1">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-orange-700 uppercase bg-orange-100 rounded-full w-max">
                  {article.category}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-500 mb-6 line-clamp-3 leading-relaxed flex-1">
                  {article.description}
                </p>
                <div className="flex items-center justify-between pt-5 border-t border-gray-100 text-sm font-medium text-gray-400">
                  <div className="flex items-center gap-1.5">{article.date}</div>
                  <div className="flex items-center gap-1.5">{article.readTime}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
