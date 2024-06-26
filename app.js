import express from "express";

const courseGoals = [];

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Learn HTMX</title>
      <link rel="stylesheet" href="/main.css" />
      <script src="/htmx.js" defer></script>
    </head>
    <body>
      <main>
        <h1>Manage your course goals</h1>
        <section>
          <form 
            id="goal-form"
            hx-post="/goals"
            hx-target="#goals"
            hx-swap="outerHTML"
            hx-select="#goals"
            hx-on::after-request="this.reset()"
            hx-disabled-elt="form button"
          >
            <div>
              <label htmlFor="goal">Goal</label>
              <input type="text" id="goal" name="goal" required />
            </div>
            <button type="submit">Add goal</button>
          </form>
        </section>
        <section>
          <ul id="goals" 
            hx-swap="outerHTML"
            hx-confirm="Are you sure that you want to delete this goal?"
          >
          ${courseGoals
            .map(
              (goal) => `
            <li>
              <span>${goal.text}</span>
              <button 
                hx-delete="/goals/${goal.id}"
                hx-target="closest li"
              >
                Remove
              </button>
            </li>
          `
            )
            .join("")}
          </ul>
        </section>
      </main>
    </body>
  </html>
  `);
});

app.post("/goals", (req, res) => {
  // TODO: needs validation

  const id = new Date().getTime().toString();
  const text = req.body.goal;
  courseGoals.unshift({ id, text });

  res.redirect("/");
});

app.delete("/goals/:id", (req, res) => {
  const index = courseGoals.findIndex((goal) => goal.id === req.params.id);
  courseGoals.splice(index, 1);

  res.send();
});

app.listen(1337);
