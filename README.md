# 🥞 pancakes-cli

**The TypeScript library toolkit — scaffold, build, and publish your packages like flipping pancakes.**

![pancakes](https://em-content.zobj.net/source/microsoft-teams/363/pancakes_1f95e.png)

---

## 🚀 Features

- 🍳 **Create TypeScript libraries** in seconds
- ⚙️ Comes with **Rollup** pre-configured
- 📦 Generates `tsconfig.json`, `package.json`, and source templates
- 📥 Installs dev dependencies automatically
- 🚀 **Publish** to npm with versioning and tagging
- 🧠 Interactive and beginner-friendly UX

---

## 📦 Installation

```bash
npm install -g pancakes-cli
```

## 🛠 Usage

pancakes-cli

Then follow the interactive prompts:

🥞 pancakes-cli v1.0.0
Your TypeScript library toolkit
Build. Publish. Repeat.

✔ What would you like to do?

- Create a new TypeScript library
- Publish package

## 📁 Example Project Structure

<pre>my-library/
├── src/
│ └── index.ts
├── tsconfig.json
├── package.json
├── rollup.config.js
└── README.md
</pre>

## 🧰 Commands

You can run commands directly too:

```bash
pancakes-cli
```

```bash
npx pancakes-cli
```

## 🧪 Tech Stack

    TypeScript

    Node.js

    Rollup

    Prompts (for interactivity)

    Colorette (for colored output)

    Nanospinner (for loading spinners)

    Minimist (arg parsing)

Got it! You want it formatted as **README markdown text** that looks clean and natural, not just a JSON snippet.

Here’s a full markdown section you can add to your README:

---

## 🔐 Granting Publish Access

To let `pancakes-cli` publish your package smoothly, add the following property to your `package.json`:

```json
{
  "pancakes-cli": true
}
```

This setting gives the CLI permission to manage npm publishing tasks like versioning, tagging, and validation for your package.

## 🛡 License

ISC © azcpcf
❤️ Contributions

Pull requests welcome!
Found a bug or want a feature? Open an issue
📬 Contact

Email: 99.a.cpcf.r.99@gmail.com
