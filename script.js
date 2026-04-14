 // ----------------------------
      // Demo todo data (replace as needed)
      // ----------------------------
      const todo = {
        id: "1",
        title: "Design onboarding flow",
        description:
          "Polish the first-run experience: clear steps, empty states, and a smooth completion moment.",
        priority: "High", // Low | Medium | High
        dueAt: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(), // due ~36 hours from now
        completed: false,
        statusText: "In progress",
        tags: ["UX", "Frontend", "Onboarding"]
      };

      // ----------------------------
      // Formatting helpers
      // ----------------------------
      function formatDueAbsolute(d) {
        const month = d.toLocaleString("en-US", { month: "short" });
        return `Due ${month} ${d.getDate()}, ${d.getFullYear()}`;
      }

      function formatDueRelative(now, due) {
        const diffMs = due.getTime() - now.getTime();
        const absMs = Math.abs(diffMs);
        const isOverdue = diffMs < 0;

        const minute = 60 * 1000;
        const hour = 60 * minute;
        const day = 24 * hour;

        const format = (value, unit) => {
          const plural = value === 1 ? "" : "s";
          return isOverdue
            ? `Overdue by ${value} ${unit}${plural}`
            : `Due in ${value} ${unit}${plural}`;
        };

        if (absMs < minute) {
          const seconds = Math.max(0, Math.round(absMs / 1000));
          if (seconds <= 59) {
            const unit = "sec";
            const plural = seconds === 1 ? "" : "s";
            return isOverdue ? `Overdue by ${seconds} ${unit}${plural}` : `Due in ${seconds} ${unit}${plural}`;
          }
        }

        if (absMs < hour) {
          const minutes = Math.max(1, Math.round(absMs / minute));
          return format(minutes, "minute");
        }

        if (absMs < day) {
          const hours = Math.max(1, Math.round(absMs / hour));
          return format(hours, "hour");
        }

        const days = Math.max(1, Math.round(absMs / day));
        return format(days, "day");
      }

      function normalizeTagForTestId(tag) {
        return String(tag)
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\-_]/g, "");
      }

      // ----------------------------
      // Render + update
      // ----------------------------
      const titleEl = document.querySelector('[data-testid="test-todo-title"]');
      const descEl = document.querySelector('[data-testid="test-todo-description"]');
      const priorityEl = document.querySelector('[data-testid="test-todo-priority"]');
      const dueTimeEl = document.querySelector('[data-testid="test-todo-due-date"]');
      const timeRemainingEl = document.querySelector('[data-testid="test-todo-time-remaining"]');
      const statusEl = document.querySelector('[data-testid="test-todo-status"]');
      const checkboxEl = document.querySelector('[data-testid="test-todo-complete-toggle"]');
      const tagListEl = document.querySelector('#tagList');
      const priorityBox = document.querySelector('#priorityBox');
      const timeBox = document.querySelector('#timeBox');

      function applyPriorityStyles(priority) {
        const className = {
          High: "priority-high",
          Medium: "priority-medium",
          Low: "priority-low"
        }[priority] || "priority-low";

        priorityBox.classList.remove("priority-high", "priority-medium", "priority-low");
        priorityBox.classList.add(className);

        priorityEl.classList.remove("priority-high", "priority-medium", "priority-low");
        priorityEl.classList.add(className);
      }

      function renderTags() {
        tagListEl.innerHTML = "";
        if (!todo.tags || todo.tags.length === 0) {
          const li = document.createElement("li");
          li.className = "no-tags";
          li.textContent = "No tags";
          tagListEl.appendChild(li);
          return;
        }

        for (const tag of todo.tags) {
          const li = document.createElement("li");

          const chip = document.createElement("span");
          chip.className = "tag-chip";
          chip.textContent = tag;

          // Each tag can optionally have: data-testid="test-todo-tag-{tag-name}"
          chip.setAttribute("data-testid", `test-todo-tag-${normalizeTagForTestId(tag)}`);
          chip.setAttribute("aria-label", `Tag: ${tag}`);

          li.appendChild(chip);
          tagListEl.appendChild(li);
        }
      }

      function renderStatic() {
        titleEl.textContent = todo.title;
        descEl.textContent = todo.description;
        priorityEl.textContent = todo.priority;
        applyPriorityStyles(todo.priority);

        statusEl.textContent = todo.completed ? "Done" : todo.statusText;

        // Checkbox state
        checkboxEl.checked = !!todo.completed;

        // Title style
        const titleClass = todo.completed ? "completed" : "";
        titleEl.classList.toggle("completed", !!todo.completed);

        // Due absolute
        const dueDate = new Date(todo.dueAt);
        dueTimeEl.setAttribute("datetime", dueDate.toISOString());
        dueTimeEl.textContent = formatDueAbsolute(dueDate);

        renderTags();
      }

      function updateLive() {
        const now = new Date();
        const due = new Date(todo.dueAt);

        const isOverdue = due.getTime() < now.getTime() && !todo.completed;

        // Time remaining
        const text = todo.completed ? "Completed" : formatDueRelative(now, due);
        timeRemainingEl.textContent = text;

        // Visual cue for overdue
        timeBox.classList.toggle("overdue", isOverdue);
        timeBox.classList.toggle("on-track", !isOverdue);

        timeRemainingEl.classList.toggle("overdue", isOverdue);
        timeRemainingEl.classList.toggle("on-track", !isOverdue);

        // Ensure due absolute stays correct (rarely changes, but due formatting must be accurate)
        dueTimeEl.textContent = formatDueAbsolute(due);
      }

      // Checkbox interaction (optional)
      checkboxEl.addEventListener("change", () => {
        todo.completed = checkboxEl.checked;
        statusEl.textContent = todo.completed ? "Done" : todo.statusText;

        titleEl.classList.toggle("completed", !!todo.completed);

        // Recompute visual states immediately
        updateLive();
      });

      // Basic actions (optional)
      document.querySelector('[data-testid="test-todo-edit-button"]').addEventListener("click", () => {
        // Replace with your edit modal/navigation
        console.log("Edit clicked for id:", todo.id);
      });

      document.querySelector('[data-testid="test-todo-delete-button"]').addEventListener("click", () => {
        // Replace with your delete confirmation flow
        console.log("Delete clicked for id:", todo.id);
      });

      // Init
      renderStatic();
      updateLive();

      // Update reasonably every 30 - 60 seconds
      // Requirement says about once every 30-60 seconds.
      setInterval(updateLive, 45_000);