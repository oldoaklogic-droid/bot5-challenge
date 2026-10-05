(function () {
  const earnedEl = document.getElementById("earned");
  const dayEl = document.getElementById("day-num");
  const totalDaysEl = document.getElementById("total-days");
  const spentEl = document.getElementById("spent");
  const capitalEl = document.getElementById("capital");
  const updatedEl = document.getElementById("updated");
  const meterEl = document.getElementById("goal-meter");
  function money(n) {
    return Number(n || 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  }

  function apply(data) {
    const goal = data.goal_usd || 100000;
    const earned = data.earned_usd || 0;
    if (earnedEl) {
      earnedEl.textContent = money(earned);
      const goalSpan = document.createElement("span");
      goalSpan.className = "goal";
      goalSpan.textContent = " / " + money(goal);
      earnedEl.appendChild(goalSpan);
    }
    if (dayEl) dayEl.textContent = String(data.day ?? "—");
    if (totalDaysEl) totalDaysEl.textContent = String(data.total_days ?? 100);
    if (spentEl) spentEl.textContent = money(data.spent_usd || 0);
    if (capitalEl) capitalEl.textContent = money(data.starting_capital_usd || 100);
    if (updatedEl) updatedEl.textContent = "Updated " + (data.last_updated || "—");
    if (meterEl) {
      // Log-ish visual so $0–few hundred still shows a sliver vs $100k
      const pct = Math.min(100, Math.max(0, (Math.log10(earned + 1) / Math.log10(goal + 1)) * 100));
      const linear = Math.min(100, (earned / goal) * 100);
      // Prefer linear but ensure visible nudge when earned > 0
      let width = linear;
      if (earned > 0 && width < 1.5) width = 1.5;
      if (earned === 0) width = 0;
      meterEl.style.width = width.toFixed(2) + "%";
      meterEl.setAttribute("aria-valuenow", String(earned));
      meterEl.title = pct.toFixed(1) + "% of log-scale progress (linear bar uses earned/goal)";
    }
    // Checkout not live yet — CTAs point to #newsletter in HTML.
  }

  fetch("progress.json", { cache: "no-store" })
    .then(function (r) {
      if (!r.ok) throw new Error("progress.json missing");
      return r.json();
    })
    .then(apply)
    .catch(function () {
      apply({
        day: 1,
        total_days: 100,
        earned_usd: 0,
        spent_usd: 0,
        starting_capital_usd: 100,
        goal_usd: 100000,
        checkout_url: "CHECKOUT_URL",
        last_updated: "unavailable",
      });
    });
})();
