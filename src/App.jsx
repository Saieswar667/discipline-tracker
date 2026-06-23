import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const today = new Date().toISOString().split("T")[0];

  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem("currentUser")) || null);
  const [authMode, setAuthMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userKey = currentUser ? `user_${currentUser.id}` : null;

  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState("");
  const [newCategory, setNewCategory] = useState("🏋️ Fitness");
  const [editingId, setEditingId] = useState(null);
const [editingTitle, setEditingTitle] = useState("");

const categories = [
  "🏋️ Fitness",
  "🥗 Diet",
  "📚 Study",
  "💰 Finance",
  "🧠 Mindset",
  "❤️ Relationships",
  "🎯 Custom",
];
  const [punishmentMsg, setPunishmentMsg] = useState("");
  const [progress, setProgress] = useState({});
  const [punishmentActive, setPunishmentActive] = useState(false);
  const [history, setHistory] = useState({});

  useEffect(() => {
    if (!currentUser) return;
    const savedData = JSON.parse(localStorage.getItem(userKey)) || {};
    setActivities(savedData.activities || []);
    setPunishmentMsg(savedData.punishmentMsg || "");
    setProgress(savedData.progress || {});
    setPunishmentActive(savedData.punishmentActive || false);
    setHistory(savedData.history || {});
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(
      userKey,
      JSON.stringify({ activities, punishmentMsg, progress, punishmentActive, history })
    );
  }, [activities, punishmentMsg, progress, punishmentActive, history, currentUser]);

  useEffect(() => {
    if (punishmentActive && punishmentMsg) alert(punishmentMsg);
  }, [punishmentActive]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (punishmentActive && punishmentMsg) showNotification(punishmentMsg);
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [punishmentActive, punishmentMsg]);

  useEffect(() => {
    if (!currentUser) return;

    const autoCheck = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 23 && now.getMinutes() === 59) {
        checkDayResult();
      }
    }, 60000);

    return () => clearInterval(autoCheck);
  }, [currentUser, activities, progress, punishmentMsg]);

  const completedCount = activities.filter((activity) => progress[today]?.[activity.id]).length;
  const progressPercent = activities.length === 0 ? 0 : Math.round((completedCount / activities.length) * 100);

  const streak = Object.keys(history)
    .sort()
    .reverse()
    .reduce((count, date) => {
      if (history[date] === "clean") return count + 1;
      return count;
    }, 0);

  const level = streak >= 91 ? 5 : streak >= 31 ? 4 : streak >= 8 ? 3 : streak >= 1 ? 2 : 1;

  const levelName =
    level === 5
      ? "Discipline Monster 👑"
      : level === 4
      ? "Unstoppable Beast"
      : level === 3
      ? "Consistency Warrior"
      : level === 2
      ? "Rising Fighter"
      : "Beginner";

  const nextLevelTarget = level === 1 ? 1 : level === 2 ? 8 : level === 3 ? 31 : level === 4 ? 91 : 91;
  const levelProgress = level === 5 ? 100 : Math.min(Math.round((streak / nextLevelTarget) * 100), 100);

  const badges = [];
  if (streak >= 1) badges.push("🏆 First Clean Day");
  if (streak >= 7) badges.push("🔥 7 Day Streak");
  if (streak >= 30) badges.push("💎 30 Day Streak");
  if (streak >= 90) badges.push("👑 Discipline King");
  if (activities.length >= 5) badges.push("⚡ Habit Builder");
const quotes = [
  "Discipline is choosing what you want most over what you want now.",
  "Nobody is coming to save you.",
  "Your future is created by what you do today.",
  "Consistency beats motivation.",
  "The pain of discipline is less than the pain of regret.",
  "You either suffer the pain of discipline or the pain of disappointment.",
];

const dailyQuote =
  quotes[new Date().getDate() % quotes.length];
  const getLast7Days = () => {
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const fullDate = date.toISOString().split("T")[0];
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    days.push({
      date: fullDate,
      dayName,
      status: history[fullDate] || "empty",
    });
  }

  return days;
};

const weeklyData = getLast7Days();

const cleanDaysCount = weeklyData.filter((day) => day.status === "clean").length;

const weeklySuccessRate = Math.round((cleanDaysCount / 7) * 100);
  const registerUser = () => {
    if (!name || !email || !password) return alert("Fill all details");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((u) => u.email === email)) return alert("User already exists");

    const newUser = { id: Date.now(), name, email, password };
    localStorage.setItem("users", JSON.stringify([...users, newUser]));

    alert("Account created successfully. Login now.");
    setAuthMode("login");
    setName("");
    setEmail("");
    setPassword("");
  };

  const loginUser = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) return alert("Invalid email or password");

    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(user);
    setEmail("");
    setPassword("");
  };

  const logoutUser = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

 const addActivity = () => {
  if (!newActivity.trim()) return alert("Enter activity name");

  setActivities([
    ...activities,
    {
      id: Date.now(),
      title: newActivity,
      category: newCategory,
    },
  ]);

  setNewActivity("");
};

  const deleteActivity = (id) => {
    setActivities(activities.filter((item) => item.id !== id));
  };
  const startEditActivity = (activity) => {
  setEditingId(activity.id);
  setEditingTitle(activity.title);
};

const saveEditActivity = (id) => {
  if (!editingTitle.trim()) return alert("Activity name cannot be empty");

  setActivities(
    activities.map((activity) =>
      activity.id === id
        ? { ...activity, title: editingTitle }
        : activity
    )
  );

  setEditingId(null);
  setEditingTitle("");
};

const cancelEditActivity = () => {
  setEditingId(null);
  setEditingTitle("");
};

const resetToday = () => {
  const updatedProgress = { ...progress };
  delete updatedProgress[today];

  const updatedHistory = { ...history };
  delete updatedHistory[today];

  setProgress(updatedProgress);
  setHistory(updatedHistory);
  setPunishmentActive(false);

  alert("Today's progress reset ✅");
};

  const markComplete = (id) => {
    setProgress({
      ...progress,
      [today]: {
        ...progress[today],
        [id]: true,
      },
    });
  };

  const markPending = (id) => {
    const updatedToday = { ...(progress[today] || {}) };
    delete updatedToday[id];

    setProgress({
      ...progress,
      [today]: updatedToday,
    });
  };

  const checkDayResult = () => {
    if (activities.length === 0) return alert("Add at least one activity first.");
    if (!punishmentMsg.trim()) return alert("Write your punishment message first.");

    const todayProgress = progress[today] || {};
    const allCompleted = activities.every((activity) => todayProgress[activity.id] === true);

    if (allCompleted) {
      setPunishmentActive(false);
      setHistory({ ...history, [today]: "clean" });
      alert("Clean day completed. Punishment stopped ✅");
    } else {
      setPunishmentActive(true);
      setHistory({ ...history, [today]: "failed" });
      alert(punishmentMsg);
    }
  };

  const requestNotificationPermission = () => {
    if (!("Notification" in window)) return alert("Your browser does not support notifications.");

    Notification.requestPermission().then((permission) => {
      alert(permission === "granted" ? "Notifications enabled ✅" : "Notifications blocked ❌");
    });
  };

  const showNotification = (message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Discipline Reminder", { body: message });
    }
  };

  if (!currentUser) {
    return (
      <div className="app">
        <div className="card authCard">
          <div className="logoCircle">🔥</div>
          <h1>{authMode === "login" ? "Login" : "Register"}</h1>

          {authMode === "register" && (
            <input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
          )}

          <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button className="checkBtn" onClick={authMode === "login" ? loginUser : registerUser}>
            {authMode === "login" ? "Login" : "Register"}
          </button>

          <p className="switchText">{authMode === "login" ? "Don't have an account?" : "Already have an account?"}</p>

          <button className="notifyBtn" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>
            {authMode === "login" ? "Create Account" : "Go to Login"}
          </button>
        </div>
      </div>
    );
  }

  return (
  <div className="app">
    <div className="dashboard">
      <div className="dashboardHeader">
        <div>
          <h1>Discipline Tracker</h1>
          <p className="subtitle">Welcome, {currentUser.name}</p>
        </div>

        <button className="logoutBtn" onClick={logoutUser}>
          Logout
        </button>
      </div>

      <div className="dashboardGrid">
        <div className="leftColumn">
          <div className="statsGrid">
            <div className="statBox">
              <h2>{progressPercent}%</h2>
              <p>Today Progress</p>
            </div>

            <div className="statBox">
              <h2>{completedCount}/{activities.length}</h2>
              <p>Tasks Done</p>
            </div>

            <div className="statBox">
              <h2>🔥 {streak}</h2>
              <p>Clean Streak</p>
            </div>
          </div>

          <div className="levelCard">
            <h2>Level {level}</h2>
            <p>{levelName}</p>

            <div className="levelBar">
              <div
                className="levelFill"
                style={{ width: `${levelProgress}%` }}
              ></div>
            </div>

            <small>{levelProgress}% to next level</small>
          </div>

          <div className="badgeCard">
            <h2>🏆 Achievements</h2>

            <div className="badgeGrid">
              {badges.length > 0 ? (
                badges.map((badge, index) => (
                  <div key={index} className="badge">
                    {badge}
                  </div>
                ))
              ) : (
                <p>No achievements unlocked yet.</p>
              )}
            </div>
          </div>

          <div className="quoteCard">
            <h2>🔥 Today's Mission</h2>
            <p>{dailyQuote}</p>
          </div>
          <div className="weeklyCard">
  <h2>📊 Weekly Analytics</h2>

  <div className="weeklyBars">
    {weeklyData.map((day) => (
      <div className="weekDay" key={day.date}>
        <div
          className={`weekBar ${
            day.status === "clean"
              ? "weekClean"
              : day.status === "failed"
              ? "weekFailed"
              : "weekEmpty"
          }`}
        ></div>

        <small>{day.dayName}</small>
      </div>
    ))}
  </div>

  <p className="successRate">Success Rate: {weeklySuccessRate}%</p>
</div>

          <button onClick={requestNotificationPermission} className="notifyBtn">
            Enable Notifications
          </button>

          {punishmentActive ? (
            <div className="punishmentBox">
              <h2>Punishment Active ❌</h2>
              <p>{punishmentMsg}</p>
            </div>
          ) : (
            <div className="cleanBox">
              <h2>No Punishment Active ✅</h2>
            </div>
          )}
        </div>

        <div className="rightColumn">
          <div className="section">
            <h2>Your Punishment Message</h2>
            <textarea
              placeholder="Example: That's why she didn't choose you..."
              value={punishmentMsg}
              onChange={(e) => setPunishmentMsg(e.target.value)}
            />
          </div>

          <div className="section">
            <h2>Add Daily Activity</h2>

            <div className="inputRow">
              <input
                placeholder="Example: Gym, No cheat meal, Study..."
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
              />

              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <button onClick={addActivity}>Add</button>
            </div>
          </div>

          <div className="section">
            <h2>Today's Activities</h2>

            {activities.length === 0 ? (
              <p>No activities added yet.</p>
            ) : (
              activities.map((activity) => (
                 <div className="activity" key={activity.id}>
  <div className="activityInfo">
    <small>{activity.category || "🎯 Custom"}</small>

    {editingId === activity.id ? (
      <input
        className="editInput"
        value={editingTitle}
        onChange={(e) => setEditingTitle(e.target.value)}
      />
    ) : (
      <span>{activity.title}</span>
    )}
  </div>

  <div className="activityActions">
    {editingId === activity.id ? (
      <>
        <button className="complete" onClick={() => saveEditActivity(activity.id)}>
          Save
        </button>

        <button className="delete" onClick={cancelEditActivity}>
          Cancel
        </button>
      </>
    ) : (
      <>
        {progress[today]?.[activity.id] ? (
          <button className="done" onClick={() => markPending(activity.id)}>
            Completed
          </button>
        ) : (
          <button className="complete" onClick={() => markComplete(activity.id)}>
            Mark Done
          </button>
        )}

        <button className="editBtn" onClick={() => startEditActivity(activity)}>
          Edit
        </button>

        <button className="delete" onClick={() => deleteActivity(activity.id)}>
          Delete
        </button>
      </>
    )}
  </div>
</div>
              ))
            )}
          </div>

          <button className="checkBtn" onClick={checkDayResult}>
            End Day Check
          </button>
          <button className="resetBtn" onClick={resetToday}>
  Reset Today
</button>

          <div className="section">
            <h2>Monthly Calendar</h2>

            <div className="calendarGrid">
              {Array.from({
                length: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() + 1,
                  0
                ).getDate(),
              }).map((_, index) => {
                const day = index + 1;
                const date = `${new Date().getFullYear()}-${String(
                  new Date().getMonth() + 1
                ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                return (
                  <div
                    key={date}
                    className={`calendarDay ${
                      history[date] === "clean"
                        ? "cleanDay"
                        : history[date] === "failed"
                        ? "failedDay"
                        : ""
                    }`}
                  >
                    <span>{day}</span>
                    <small>
                      {history[date] === "clean"
                        ? "✅"
                        : history[date] === "failed"
                        ? "❌"
                        : "⬜"}
                    </small>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="section">
            <h2>History</h2>

            {Object.keys(history).length === 0 ? (
              <p>No history yet.</p>
            ) : (
              Object.keys(history)
                .sort()
                .reverse()
                .slice(0, 7)
                .map((date) => (
                  <div className="historyItem" key={date}>
                    <span>{date}</span>
                    <strong>
                      {history[date] === "clean"
                        ? "Clean Day ✅"
                        : "Failed Day ❌"}
                    </strong>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {punishmentActive && (
        <div className="punishmentOverlay">
          <div className="punishmentModal">
            <h1>❌ YOU FAILED TODAY</h1>
            <h2>You broke your promise.</h2>
            <p className="punishmentText">"{punishmentMsg}"</p>
<button onClick={() => setPunishmentActive(false)}>
  I Understand
</button>
          </div>
        </div>
      )}
    </div>
  </div>
);
}

export default App;