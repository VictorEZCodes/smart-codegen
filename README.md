
# Smart CodeGen 🚀

**A robust, AI-powered CLI tool for efficient React development.** Generate React components, custom hooks, and CRUD operations with TypeScript support and industry best practices baked in.

---

## 🌟 Features

- 🤖 **AI-Powered Code Generation**: Write less, build more.
- ⚛️ **React Components**: Generate functional or class-based components.
- 🪝 **Custom Hooks**: Quickly scaffold reusable logic.
- 📡 **CRUD Operations**: Automate RESTful API code generation.
- 📘 **TypeScript Support**: Built-in type safety.
- 🎨 **CSS Modules Integration**: Clean, modular styling out of the box.
- 📝 **Auto-Documentation**: Document your code as you build.
- ✨ **Best Practices**: Adheres to industry standards.

---

## 🚀 Installation

```bash
npm install -g smart-codegen
# or
yarn global add smart-codegen
```
## Usage

### Component Generation
```bash 
# Interactive mode
	codegen component 
# Direct mode 
	codegen component --name Button --type functional
# Generated structure:
	src/
	  components/
	    Button/
	      Button.tsx
	      Button.module.css
```

### Custom Hook Generation 
```bash 
# Interactive mode
	codegen hook 
# Direct mode 
	codegen hook --name WindowSize
# Generated structure:
	src/
	  hooks/
	    useWindow.ts
```

### CRUD Generation
```bash 
# Interactive mode
	codegen crud 
# Direct mode 
	codegen crud --model User
# Generated structure:
	src/
	  features/
		  user/
		    user.service.ts
		    useUser.ts
```

## ⚙️ Configuration

Add a  `.env`  file in your project root:
```bash
OPENAI_API_KEY=your_api_key_here
GITHUB_USER=your_github_username
```

🛠️ Commands Reference

### Component Options
| Option       | Shortcut | Description                          | Default     |
|--------------|----------|--------------------------------------|-------------|
| `--name`     | `-n`     | Component name                      | (prompts)   |
| `--type`     | `-t`     | Component type (functional/class)   | functional  |

### Hook Options
| Option       | Shortcut | Description                          | Default     |
|--------------|----------|--------------------------------------|-------------|
| `--name`     | `-n`     | Hook name (without 'use' prefix)    | (prompts)   |
| `--type`     | `-t`     | Hook type                           | custom      |

### CRUD Options
| Option         | Shortcut | Description                          | Default     |
|----------------|----------|--------------------------------------|-------------|
| `--model`      | `-m`     | Model/Entity name                   | (prompts)   |
| `--operations` | `-o`     | CRUD operations to generate         | All         |

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

## 📝 License

MIT License - see the [LICENSE](https://mit-license.org/) file for details

## 🙏 Acknowledgments

-   OpenAI for providing the AI capabilities
-   React community for inspiration and best practices
-   All contributors who help improve this tool

Generated with ❤️ by Smart CodeGen